import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, writeBatch } from "firebase/firestore";
import { DateTime } from "luxon";
import { 
  SportMatch, 
  generateFifa2026Matches, 
  fillTimetable 
} from "@/lib/sports";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const forceUpdate = new URL(request.url).searchParams.get("force") === "true";
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    let shouldFetchSportsDB = forceUpdate;

    let lastUpdated = 0;
    let statusSnap;
    let statusRef;

    // Try reading last updated timestamp from Firestore
    try {
      statusRef = doc(db, "sports_metadata", "status");
      statusSnap = await getDoc(statusRef);
      if (statusSnap.exists()) {
        lastUpdated = statusSnap.data().last_updated || 0;
      }
    } catch (dbErr) {
      console.warn("Firestore status check failed, falling back to cache expire logic:", dbErr);
    }

    if (!lastUpdated || (now - lastUpdated > oneDayMs)) {
      shouldFetchSportsDB = true;
    }

    // Try loading from Firestore first
    if (!shouldFetchSportsDB) {
      try {
        const eventsCol = collection(db, "sports_events");
        const querySnapshot = await getDocs(eventsCol);
        const matches: SportMatch[] = [];
        querySnapshot.forEach((doc) => {
          matches.push(doc.data() as SportMatch);
        });

        const sportsCount = new Set(matches.map(m => m.sport)).size;
        if (matches.length >= 180 && sportsCount >= 5) {
          matches.sort((a, b) => new Date(a.utcTime).getTime() - new Date(b.utcTime).getTime());
          return NextResponse.json({ source: "firestore", lastUpdated, matches });
        } else {
          shouldFetchSportsDB = true;
        }
      } catch (dbReadErr) {
        console.warn("Failed to read events from Firestore, forcing API fetch:", dbReadErr);
        shouldFetchSportsDB = true;
      }
    }

    const fetchedMatches: SportMatch[] = [];

    // Query TheSportsDB
    if (shouldFetchSportsDB) {
      const apiKey = process.env.SPORTSDB_API_KEY || "3";
      
      const leagues = [
        { id: "4328", sport: "football" },
        { id: "4387", sport: "basketball" },
        { id: "4370", sport: "formula1" },
        { id: "4436", sport: "cricket" }
      ] as const;

      try {
        const fetchPromises = leagues.map(async (league) => {
          try {
            const url = `https://www.thesportsdb.com/api/v1/json/${apiKey}/eventsnextleague.php?id=${league.id}`;
            const res = await fetch(url, { next: { revalidate: 0 } });
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            
            const data = await res.json();
            if (data && Array.isArray(data.events)) {
              data.events.forEach((event: any) => {
                let utcTime = "";
                
                if (event.strTimestamp) {
                  utcTime = DateTime.fromISO(event.strTimestamp).setZone("utc").toISO() || "";
                } else if (event.dateEvent && event.strTime) {
                  const timePart = event.strTime.split("+")[0].trim();
                  utcTime = DateTime.fromSQL(`${event.dateEvent} ${timePart}`, { zone: "utc" }).toISO() || "";
                } else if (event.dateEvent) {
                  utcTime = DateTime.fromISO(event.dateEvent).setZone("utc").toISO() || "";
                }

                if (utcTime) {
                  let sportKey: SportMatch['sport'] = league.sport;
                  const sportField = (event.strSport || "").toLowerCase();
                  if (sportField.includes("soccer") || sportField.includes("football")) {
                    sportKey = "football";
                  } else if (sportField.includes("basketball")) {
                    sportKey = "basketball";
                  } else if (sportField.includes("formula") || sportField.includes("motorsport") || sportField.includes("motorcycle")) {
                    sportKey = "formula1";
                  } else if (sportField.includes("cricket")) {
                    sportKey = "cricket";
                  } else if (sportField.includes("tennis")) {
                    sportKey = "tennis";
                  }

                  fetchedMatches.push({
                    id: event.idEvent || `sdb-${Math.random().toString(36).substring(2, 11)}`,
                    sport: sportKey,
                    title: event.strEvent || "Match",
                    tournament: event.strLeague || "Tournament",
                    utcTime,
                    venue: event.strVenue || "Venue TBD",
                    status: "upcoming"
                  });
                }
              });
            }
          } catch (err) {
            console.error(`Failed to fetch for league ${league.id}:`, err);
          }
        });

        await Promise.allSettled(fetchPromises);
      } catch (err) {
        console.error("General error querying SportsDB:", err);
      }
    }

    // Merge FIFA World Cup 2026 matches (exactly 104) and other sports (20 each)
    const fifaMatches = generateFifa2026Matches();
    const otherSportsMatches = fillTimetable(fetchedMatches);
    const combinedMatches = [...fifaMatches, ...otherSportsMatches];

    // Save the full combined list back to Firestore
    try {
      const batch = writeBatch(db);
      const eventsCol = collection(db, "sports_events");
      const snapshot = await getDocs(eventsCol);
      
      // Delete old documents
      snapshot.forEach((d) => {
        batch.delete(d.ref);
      });

      // Write new documents (full ~184 matches)
      combinedMatches.forEach((match) => {
        const docRef = doc(db, "sports_events", match.id);
        batch.set(docRef, match);
      });

      // Update status timestamp
      if (statusRef) {
        batch.set(statusRef, { last_updated: now });
      }

      await batch.commit();

      combinedMatches.sort((a, b) => new Date(a.utcTime).getTime() - new Date(b.utcTime).getTime());
      return NextResponse.json({ source: "api-hydrated", lastUpdated: now, matches: combinedMatches });

    } catch (dbWriteErr) {
      console.error("Failed to write full schedule cache to Firestore:", dbWriteErr);
      combinedMatches.sort((a, b) => new Date(a.utcTime).getTime() - new Date(b.utcTime).getTime());
      return NextResponse.json({ source: "memory-hydrated", lastUpdated: 0, matches: combinedMatches });
    }

  } catch (err: any) {
    console.error("Critical error in Sports API handler:", err);
    const fallback = [...generateFifa2026Matches(), ...fillTimetable([])];
    return NextResponse.json(
      { error: "Internal Server Error", matches: fallback, source: "mock-critical" },
      { status: 500 }
    );
  }
}
