import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { DateTime } from "luxon";

export interface SportMatch {
  id: string;
  sport: 'football' | 'football-fifa' | 'basketball' | 'cricket' | 'tennis' | 'formula1';
  title: string;
  tournament: string;
  utcTime: string; // ISO UTC format
  venue: string;
  status: 'upcoming' | 'live' | 'finished';
  homeTeam?: string;
  awayTeam?: string;
}

// Templates for relative fixtures per sport
export const SPORT_TEMPLATES: Record<Exclude<SportMatch['sport'], 'football-fifa'>, { title: string; tournament: string; venue: string }[]> = {
  football: [
    { title: "Manchester City vs Arsenal", tournament: "English Premier League", venue: "Etihad Stadium, Manchester" },
    { title: "Real Madrid vs Barcelona", tournament: "La Liga - El Clásico", venue: "Santiago Bernabéu, Madrid" },
    { title: "Bayern Munich vs Borussia Dortmund", tournament: "German Bundesliga", venue: "Allianz Arena, Munich" },
    { title: "Chelsea vs Liverpool", tournament: "English Premier League", venue: "Stamford Bridge, London" },
    { title: "Paris Saint-Germain vs Marseille", tournament: "Ligue 1", venue: "Parc des Princes, Paris" },
    { title: "Juventus vs AC Milan", tournament: "Serie A", venue: "Juventus Stadium, Turin" },
    { title: "Inter Milan vs Napoli", tournament: "Serie A", venue: "San Siro, Milan" },
    { title: "Arsenal vs Tottenham Hotspur", tournament: "English Premier League", venue: "Emirates Stadium, London" },
  ],
  basketball: [
    { title: "Los Angeles Lakers vs Boston Celtics", tournament: "NBA Regular Season", venue: "Crypto.com Arena, Los Angeles" },
    { title: "Golden State Warriors vs Sacramento Kings", tournament: "NBA Western Conference", venue: "Chase Center, San Francisco" },
    { title: "Milwaukee Bucks vs Philadelphia 76ers", tournament: "NBA Eastern Conference", venue: "Fiserv Forum, Milwaukee" },
    { title: "Miami Heat vs New York Knicks", tournament: "NBA Regular Season", venue: "Kaseya Center, Miami" },
    { title: "Phoenix Suns vs Denver Nuggets", tournament: "NBA Western Conference", venue: "Footprint Center, Phoenix" },
    { title: "Dallas Mavericks vs Houston Rockets", tournament: "NBA Regular Season", venue: "American Airlines Center, Dallas" },
    { title: "Minnesota Timberwolves vs Oklahoma City Thunder", tournament: "NBA Regular Season", venue: "Target Center, Minneapolis" },
    { title: "Cleveland Cavaliers vs Indiana Pacers", tournament: "NBA Regular Season", venue: "Rocket Mortgage FieldHouse, Cleveland" },
  ],
  cricket: [
    { title: "India vs Australia", tournament: "ICC World Test Championship", venue: "Wankhede Stadium, Mumbai" },
    { title: "Chennai Super Kings vs Mumbai Indians", tournament: "Indian Premier League", venue: "M. A. Chidambaram Stadium, Chennai" },
    { title: "England vs Pakistan", tournament: "T20 International Series", venue: "Lord's Cricket Ground, London" },
    { title: "Royal Challengers Bangalore vs Kolkata Knight Riders", tournament: "Indian Premier League", venue: "M. Chinnaswamy Stadium, Bengaluru" },
    { title: "South Africa vs West Indies", tournament: "ODI International Series", venue: "The Wanderers Stadium, Johannesburg" },
    { title: "New Zealand vs Sri Lanka", tournament: "Test Match Series", venue: "Basin Reserve, Wellington" },
    { title: "Australia vs England", tournament: "The Ashes Test Series", venue: "Melbourne Cricket Ground, Melbourne" },
    { title: "India vs New Zealand", tournament: "T20 International Series", venue: "Eden Gardens, Kolkata" },
  ],
  tennis: [
    { title: "Carlos Alcaraz vs Jannik Sinner", tournament: "Wimbledon Men's Singles", venue: "Centre Court, London" },
    { title: "Novak Djokovic vs Daniil Medvedev", tournament: "US Open Men's Singles", venue: "Arthur Ashe Stadium, New York" },
    { title: "Iga Swiatek vs Aryna Sabalenka", tournament: "French Open Women's Singles", venue: "Court Philippe-Chatrier, Paris" },
    { title: "Alexander Zverev vs Taylor Fritz", tournament: "ATP Finals", venue: "Inalpi Arena, Turin" },
    { title: "Coco Gauff vs Naomi Osaka", tournament: "Wimbledon Women's Singles", venue: "Court 1, London" },
    { title: "Rafael Nadal vs Holger Rune", tournament: "Madrid Open Men's Singles", venue: "Caja Mágica, Madrid" },
    { title: "Elena Rybakina vs Jessica Pegula", tournament: "Miami Open Women's Singles", venue: "Hard Rock Stadium, Miami" },
  ],
  formula1: [
    { title: "Monaco Grand Prix - Qualifying", tournament: "Formula 1 Grand Prix", venue: "Circuit de Monaco, Monte Carlo" },
    { title: "Monaco Grand Prix - Race", tournament: "Formula 1 Grand Prix", venue: "Circuit de Monaco, Monte Carlo" },
    { title: "Italian Grand Prix - Race (Monza)", tournament: "Formula 1 Grand Prix", venue: "Autodromo Nazionale Monza, Monza" },
    { title: "Singapore Grand Prix - Practice 3", tournament: "Formula 1 Grand Prix", venue: "Marina Bay Street Circuit, Singapore" },
    { title: "United States Grand Prix - Sprint Shootout", tournament: "Formula 1 Grand Prix", venue: "Circuit of the Americas, Austin" },
    { title: "British Grand Prix - Race", tournament: "Formula 1 Grand Prix", venue: "Silverstone Circuit, Silverstone" },
    { title: "Bahrain Grand Prix - Race", tournament: "Formula 1 Grand Prix", venue: "Bahrain International Circuit, Sakhir" },
    { title: "Japanese Grand Prix - Race", tournament: "Formula 1 Grand Prix", venue: "Suzuka International Racing Course, Suzuka" },
  ]
};

// Generate all 104 matches of FIFA World Cup 2026
export function generateFifa2026Matches(): SportMatch[] {
  const fifaMatches: SportMatch[] = [];
  const startDate = DateTime.fromISO("2026-06-11T00:00:00", { zone: "utc" });
  
  const venues = [
    "MetLife Stadium, East Rutherford",
    "Estadio Azteca, Mexico City",
    "SoFi Stadium, Los Angeles",
    "Mercedes-Benz Stadium, Atlanta",
    "Hard Rock Stadium, Miami",
    "AT&T Stadium, Arlington",
    "BC Place, Vancouver",
    "Lumen Field, Seattle",
    "Gillette Stadium, Boston",
    "Lincoln Financial Field, Philadelphia",
    "NRG Stadium, Houston",
    "Arrowhead Stadium, Kansas City",
    "Levi's Stadium, Santa Clara",
    "BMO Field, Toronto",
    "Estadio BBVA, Monterrey",
    "Estadio Akron, Guadalajara"
  ];

  const GROUPS = [
    { name: "Group A", teams: ["USA", "Germany", "Austria", "Nigeria"] },
    { name: "Group B", teams: ["Mexico", "Croatia", "Sweden", "Cameroon"] },
    { name: "Group C", teams: ["Canada", "Uruguay", "Poland", "Ghana"] },
    { name: "Group D", teams: ["Argentina", "Colombia", "Iran", "Mali"] },
    { name: "Group E", teams: ["Brazil", "Senegal", "Turkey", "Ivory Coast"] },
    { name: "Group F", teams: ["France", "Morocco", "Ecuador", "Saudi Arabia"] },
    { name: "Group G", teams: ["England", "Japan", "Chile", "Australia"] },
    { name: "Group H", teams: ["Spain", "South Korea", "Peru", "New Zealand"] },
    { name: "Group I", teams: ["Belgium", "Switzerland", "Ukraine", "Iraq"] },
    { name: "Group J", teams: ["Portugal", "Denmark", "Algeria", "Qatar"] },
    { name: "Group K", teams: ["Netherlands", "Serbia", "Egypt", "India"] },
    { name: "Group L", teams: ["Italy", "Scotland", "Tunisia", "Jamaica"] }
  ];

  let matchNum = 1;
  const now = DateTime.now().setZone("utc");

  // 1. Group Stage: 72 matches (June 11 to June 27)
  for (let g = 0; g < 12; g++) {
    const group = GROUPS[g];
    const matchups = [
      [0, 1], [2, 3],
      [0, 2], [1, 3],
      [0, 3], [1, 2]
    ];
    
    for (let m = 0; m < 6; m++) {
      const home = group.teams[matchups[m][0]];
      const away = group.teams[matchups[m][1]];
      
      const matchday = Math.floor(m / 2);
      const groupDayOffset = Math.floor(g / 3) * 4 + matchday * 5;
      const matchHour = 14 + (g % 3) * 3 + (m % 2) * 2;
      
      const matchTime = startDate.plus({ days: groupDayOffset, hours: matchHour });
      const venue = venues[(g + m) % venues.length];
      
      let status: SportMatch['status'] = "upcoming";
      if (matchTime < now.minus({ hours: 2 })) {
        status = "finished";
      } else if (matchTime <= now && matchTime >= now.minus({ hours: 2 })) {
        status = "live";
      }

      fifaMatches.push({
        id: `fifa26-m${matchNum}`,
        sport: "football-fifa",
        title: `Match ${matchNum}: ${home} vs ${away}`,
        tournament: `FIFA World Cup 2026 - ${group.name}`,
        utcTime: matchTime.toISO() || "",
        venue,
        status,
        homeTeam: home,
        awayTeam: away
      });
      
      matchNum++;
    }
  }

  // 2. Round of 32: 16 matches (June 28 to July 3)
  for (let i = 0; i < 16; i++) {
    const matchTime = startDate.plus({ days: 17 + Math.floor(i / 3), hours: 15 + (i % 3) * 3 });
    const venue = venues[i % venues.length];
    fifaMatches.push({
      id: `fifa26-m${matchNum}`,
      sport: "football-fifa",
      title: `Match ${matchNum}: Round of 32 - fixture #${i + 1}`,
      tournament: "FIFA World Cup 2026 - Round of 32",
      utcTime: matchTime.toISO() || "",
      venue,
      status: "upcoming"
    });
    matchNum++;
  }

  // 3. Round of 16: 8 matches (July 4 to July 7)
  for (let i = 0; i < 8; i++) {
    const matchTime = startDate.plus({ days: 23 + Math.floor(i / 2), hours: 16 + (i % 2) * 4 });
    const venue = venues[(i + 4) % venues.length];
    fifaMatches.push({
      id: `fifa26-m${matchNum}`,
      sport: "football-fifa",
      title: `Match ${matchNum}: Round of 16 - fixture #${i + 1}`,
      tournament: "FIFA World Cup 2026 - Round of 16",
      utcTime: matchTime.toISO() || "",
      venue,
      status: "upcoming"
    });
    matchNum++;
  }

  // 4. Quarterfinals: 4 matches (July 9 to July 11)
  for (let i = 0; i < 4; i++) {
    const matchTime = startDate.plus({ days: 28 + Math.floor(i / 2), hours: 17 + (i % 2) * 4 });
    const venue = venues[(i + 8) % venues.length];
    fifaMatches.push({
      id: `fifa26-m${matchNum}`,
      sport: "football-fifa",
      title: `Match ${matchNum}: Quarterfinal #${i + 1}`,
      tournament: "FIFA World Cup 2026 - Quarterfinals",
      utcTime: matchTime.toISO() || "",
      venue,
      status: "upcoming"
    });
    matchNum++;
  }

  // 5. Semifinals: 2 matches (July 14 and July 15)
  for (let i = 0; i < 2; i++) {
    const matchTime = startDate.plus({ days: 33 + i * 1, hours: 20 });
    const venue = venues[i === 0 ? 0 : 5];
    fifaMatches.push({
      id: `fifa26-m${matchNum}`,
      sport: "football-fifa",
      title: `Match ${matchNum}: Semifinal #${i + 1}`,
      tournament: "FIFA World Cup 2026 - Semifinals",
      utcTime: matchTime.toISO() || "",
      venue,
      status: "upcoming"
    });
    matchNum++;
  }

  // 6. Third-Place Play-off: Match 103 (July 18)
  const thirdPlaceTime = startDate.plus({ days: 37, hours: 18 });
  fifaMatches.push({
    id: `fifa26-m${matchNum}`,
    sport: "football-fifa",
    title: `Match ${matchNum}: Third-Place Play-off`,
    tournament: "FIFA World Cup 2026 - 3rd Place Play-off",
    utcTime: thirdPlaceTime.toISO() || "",
    venue: "Hard Rock Stadium, Miami",
    status: "upcoming"
  });
  matchNum++;

  // 7. Final: Match 104 (July 19)
  const finalTime = startDate.plus({ days: 38, hours: 20 });
  fifaMatches.push({
    id: `fifa26-m${matchNum}`,
    sport: "football-fifa",
    title: `Match ${matchNum}: FIFA World Cup 2026 Final`,
    tournament: "FIFA World Cup 2026 - Final",
    utcTime: finalTime.toISO() || "",
    venue: "MetLife Stadium, East Rutherford",
    status: "upcoming"
  });

  return fifaMatches;
}

// Fill other sports to ensure each has exactly 20 upcoming matches
export function fillTimetable(existing: SportMatch[]): SportMatch[] {
  // Use a fixed date reference or set hour/minute to 0 to keep times stable throughout the day
  const base = DateTime.now().setZone("utc").startOf('day');
  const filled: SportMatch[] = [...existing];
  
  const otherSports: Exclude<SportMatch['sport'], 'football-fifa'>[] = ["football", "basketball", "cricket", "tennis", "formula1"];
  const TARGET_COUNT_PER_SPORT = 20;

  otherSports.forEach(sport => {
    const sportMatches = filled.filter(m => m.sport === sport);
    const needed = TARGET_COUNT_PER_SPORT - sportMatches.length;
    
    if (needed > 0) {
      const templates = SPORT_TEMPLATES[sport];
      for (let i = 0; i < needed; i++) {
        const template = templates[i % templates.length];
        
        let matchTime;
        if (i === 0) {
          matchTime = base.plus({ hours: 12 });
        } else {
          matchTime = base.plus({ days: Math.floor(i / 2) + 1, hours: 12 + (i % 2) * 4 });
        }

        let homeTeam, awayTeam;
        if (template.title.includes(" vs ")) {
          const parts = template.title.split(" vs ");
          homeTeam = parts[0].trim();
          awayTeam = parts[1].trim();
        }

        filled.push({
          id: `gen-${sport}-${i}`,
          sport,
          title: template.title,
          tournament: template.tournament,
          utcTime: matchTime.toISO() || "",
          venue: template.venue,
          status: "upcoming",
          homeTeam,
          awayTeam
        });
      }
    }
  });

  return filled;
}

// Read matches from Firestore (or fallback to generated matches if empty or errors out)
export async function getSportsMatches(): Promise<SportMatch[]> {
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
      return matches;
    }
  } catch (err) {
    console.error("Error fetching sports matches from Firestore, generating fallback:", err);
  }

  // Generate fallback
  const fifaMatches = generateFifa2026Matches();
  const otherSportsMatches = fillTimetable([]);
  const fallback = [...fifaMatches, ...otherSportsMatches];
  fallback.sort((a, b) => new Date(a.utcTime).getTime() - new Date(b.utcTime).getTime());
  return fallback;
}

// Generate the sport schema URL
function getSportUrl(sport: SportMatch['sport']): string {
  switch (sport) {
    case 'football':
    case 'football-fifa':
      return "https://en.wikipedia.org/wiki/Association_football";
    case 'basketball':
      return "https://en.wikipedia.org/wiki/Basketball";
    case 'cricket':
      return "https://en.wikipedia.org/wiki/Cricket";
    case 'tennis':
      return "https://en.wikipedia.org/wiki/Tennis";
    case 'formula1':
      return "https://en.wikipedia.org/wiki/Formula_One";
    default:
      return "https://en.wikipedia.org/wiki/Sport";
  }
}

// Helper to extract competitors for SportsEvent schema
function getCompetitorsSchema(match: SportMatch) {
  if (match.homeTeam && match.awayTeam) {
    return [
      { "@type": "SportsTeam", "name": match.homeTeam },
      { "@type": "SportsTeam", "name": match.awayTeam }
    ];
  }
  
  if (match.title.includes(" vs ")) {
    const parts = match.title.split(" vs ");
    const homeName = parts[0].replace(/Match \d+:\s*/, "").trim();
    const awayName = parts[1].trim();
    return [
      { "@type": "SportsTeam", "name": homeName },
      { "@type": "SportsTeam", "name": awayName }
    ];
  }
  
  return undefined;
}

// Generate schema markup for the list of sports events
export function generateSportsScheduleSchema(matches: SportMatch[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Global Sports Schedule",
    "description": "Upcoming matches for Football, NBA, Cricket, Tennis, and Formula 1 converted to local time zones.",
    "numberOfItems": matches.length,
    "itemListElement": matches.slice(0, 100).map((match, index) => { // Cap list elements to 100 for payload optimization
      const competitors = getCompetitorsSchema(match);
      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SportsEvent",
          "name": match.title,
          "description": `${match.title} scheduled in the ${match.tournament}`,
          "startDate": match.utcTime,
          "location": {
            "@type": "Place",
            "name": match.venue,
            "address": match.venue
          },
          "sport": getSportUrl(match.sport),
          "competitor": competitors
        }
      };
    })
  };
}

// Generate schema markup for a single match event page
export function generateSingleMatchSchema(match: SportMatch) {
  const competitors = getCompetitorsSchema(match);
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": match.title,
    "description": `${match.title} in the ${match.tournament} - Convert kickoff time to any timezone.`,
    "startDate": match.utcTime,
    "location": {
      "@type": "Place",
      "name": match.venue,
      "address": match.venue
    },
    "sport": getSportUrl(match.sport),
    "competitor": competitors
  };
}

export function getSportSlug(sport: SportMatch['sport']): string {
  switch (sport) {
    case 'football-fifa':
      return 'fifa-worldcup-2026';
    case 'football':
      return 'football';
    case 'basketball':
      return 'basketball';
    case 'cricket':
      return 'cricket';
    case 'tennis':
      return 'tennis';
    case 'formula1':
      return 'formula1';
    default:
      return 'sports';
  }
}

export function getSportFromSlug(slug: string): SportMatch['sport'] | null {
  switch (slug) {
    case 'fifa-worldcup-2026':
      return 'football-fifa';
    case 'football':
      return 'football';
    case 'basketball':
      return 'basketball';
    case 'cricket':
      return 'cricket';
    case 'tennis':
      return 'tennis';
    case 'formula1':
      return 'formula1';
    default:
      return null;
  }
}
