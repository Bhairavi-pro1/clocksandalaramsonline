export interface Holiday {
  name: string
  date: Date
  daysRemaining: number
}

function getNextOccurrence(month: number, day: number): Date {
  const now = new Date()
  let year = now.getFullYear()
  let holidayDate = new Date(year, month, day)
  
  if (holidayDate < now) {
    holidayDate = new Date(year + 1, month, day)
  }
  return holidayDate
}

function getNthDayOfMonth(year: number, month: number, dayOfWeek: number, n: number): Date {
  // n = 1 for 1st, 2 for 2nd, etc. 
  // n = -1 for last
  const date = new Date(year, month, 1)
  let count = 0
  
  if (n > 0) {
    while (date.getMonth() === month) {
      if (date.getDay() === dayOfWeek) {
        count++
        if (count === n) return new Date(date)
      }
      date.setDate(date.getDate() + 1)
    }
  } else {
    // Last nth (e.g. n=-1 is last Monday)
    const lastDate = new Date(year, month + 1, 0)
    while (lastDate.getMonth() === month) {
      if (lastDate.getDay() === dayOfWeek) {
        return new Date(lastDate)
      }
      lastDate.setDate(lastDate.getDate() - 1)
    }
  }
  return new Date()
}

function getEaster(year: number): Date {
  const f = Math.floor,
    G = year % 19,
    C = f(year / 100),
    H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
    I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
    J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
    L = I - J,
    month = 3 + f((L + 40) / 44),
    day = L + 28 - 31 * f(month / 4);
  return new Date(year, month - 1, day);
}

export function getHolidays(): Holiday[] {
  const now = new Date()
  const year = now.getFullYear()
  
  const holidayConfigs = [
    { name: 'New Year', type: 'fixed', month: 0, day: 1 },
    { name: 'Chinese New Year', type: 'special', dates: { 2026: [1, 17], 2027: [1, 6], 2028: [0, 26] } },
    { name: 'Valentine\'s Day', type: 'fixed', month: 1, day: 14 },
    { name: 'St. Patrick\'s Day', type: 'fixed', month: 2, day: 17 },
    { name: 'Good Friday', type: 'relative-easter', offset: -2 },
    { name: 'Easter', type: 'relative-easter', offset: 0 },
    { name: 'Earth Day', type: 'fixed', month: 3, day: 22 },
    { name: 'International Workers\' Day', type: 'fixed', month: 4, day: 1 },
    { name: 'World Environment Day', type: 'fixed', month: 5, day: 5 },
    { name: 'International Friendship Day', type: 'fixed', month: 6, day: 30 },
    { name: 'World Teachers\' Day', type: 'fixed', month: 9, day: 5 },
    { name: 'United Nations Day', type: 'fixed', month: 9, day: 24 },
    { name: 'Halloween', type: 'fixed', month: 9, day: 31 },
    { name: 'Christmas Eve', type: 'fixed', month: 11, day: 24 },
    { name: 'Christmas', type: 'fixed', month: 11, day: 25 },
    { name: 'New Year\'s Eve', type: 'fixed', month: 11, day: 31 },
  ]

  return holidayConfigs.map(config => {
    let holidayDate: Date
    
    const calculateForYear = (y: number) => {
      let d: Date
      if (config.type === 'fixed') {
        d = new Date(y, config.month!, config.day!)
      } else if (config.type === 'nth') {
        d = getNthDayOfMonth(y, config.month!, (config as any).dayOfWeek!, (config as any).n!)
      } else if (config.type === 'relative-easter') {
        const easter = getEaster(y)
        d = new Date(easter)
        d.setDate(easter.getDate() + config.offset!)
      } else if (config.type === 'nth-relative') {
        const base = getNthDayOfMonth(y, config.month!, (config as any).dayOfWeek!, (config as any).n!)
        d = new Date(base)
        d.setDate(base.getDate() + (config as any).offsetDays!)
      } else if (config.type === 'special') {
        const dates = (config as any).dates
        const [m, day] = dates[y] || [0, 1] // Default to Jan 1st if not found
        d = new Date(y, m, day)
      } else {
        d = new Date()
      }
      return d
    }

    holidayDate = calculateForYear(year)
    // If holiday already passed this year, look at next year
    if (holidayDate < now) {
      holidayDate = calculateForYear(year + 1)
    }

    const diffTime = Math.abs(holidayDate.getTime() - now.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return {
      name: config.name,
      date: holidayDate,
      daysRemaining: diffDays
    }
  }).sort((a, b) => a.date.getTime() - b.date.getTime())
}
