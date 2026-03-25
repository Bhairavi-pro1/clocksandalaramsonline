import { DateTime } from 'luxon'
import { countryToZone } from './timezoneData'

export interface DSTChange {
  country: string
  zone: string
  date: string
  time: string
  offsetBefore: number
  offsetAfter: number
  type: 'Spring Forward' | 'Fall Back' | 'Time Shift'
  daysRemaining: number
  timestamp: number
  isHalfHourShift: boolean
  isLordHowe: boolean
  isHistorical: boolean
  description?: string
}

const extendedZones = {
  ...countryToZone,
  "Lord Howe Island": "Australia/Lord_Howe"
}

export function getUpcomingDSTChanges(): DSTChange[] {
  const changes: DSTChange[] = []
  const now = DateTime.now()

  // Helper to find next change for a zone
  const findNextChange = (zone: string, country: string): DSTChange | null => {
    try {
      const dt = now.setZone(zone)
      if (!dt.isValid) return null
      const currentOffset = dt.offset

      for (let i = 1; i <= 366; i++) {
        const checkTime = dt.plus({ days: i }).endOf('day')
        if (checkTime.offset !== currentOffset) {
          let transitionMoment = dt.plus({ days: i }).startOf('day')
          for (let h = 0; h <= 24; h++) {
            const hourSlice = transitionMoment.plus({ hours: h })
            if (hourSlice.offset !== currentOffset) {
              const offsetDiff = hourSlice.offset - currentOffset
              const isHalfHour = Math.abs(offsetDiff) === 30
              const isLordHowe = zone.includes('Lord_Howe')
              
              let isPermanent = true
              const futureCheck = hourSlice.plus({ months: 10 })
              if (futureCheck.setZone(zone).offset === currentOffset) {
                isPermanent = false
              }
              
              const isNotable = Math.abs(offsetDiff) !== 60 && Math.abs(offsetDiff) !== 30
              const isHistorical = isPermanent || isNotable

              let description = ""
              if (isLordHowe) {
                  description = "Unique 30-minute shift: Lord Howe Island is the only place in the world that shifts its clocks by exactly 30 minutes for DST."
              } else if (isHistorical && isPermanent) {
                  description = "Historical Shift: This location is implementing a permanent change to its standard time offset."
              } else if (isNotable) {
                  description = `Notable Transition: A unique ${Math.abs(offsetDiff)} minute shift in local time.`
              }

              return {
                country,
                zone,
                date: hourSlice.toFormat('MMMM d, yyyy'),
                time: hourSlice.toFormat('h:mm a'),
                offsetBefore: currentOffset / 60,
                offsetAfter: hourSlice.offset / 60,
                type: isNotable || isPermanent ? 'Time Shift' : (hourSlice.offset > currentOffset ? 'Spring Forward' : 'Fall Back'),
                daysRemaining: Math.max(0, Math.floor(hourSlice.diff(now, 'days').days)),
                timestamp: hourSlice.toMillis(),
                isHalfHourShift: isHalfHour,
                isLordHowe,
                isHistorical,
                description
              }
            }
          }
        }
      }
    } catch (e) {
      return null
    }
    return null
  }

  Object.entries(extendedZones).forEach(([country, zone]) => {
    const change = findNextChange(zone, country)
    if (change) {
      changes.push(change)
    }
  })

  // Sort by date then country
  return changes.sort((a, b) => a.timestamp - b.timestamp || a.country.localeCompare(b.country))
}
