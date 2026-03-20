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
    { name: 'Martin Luther King Day', type: 'nth', month: 0, dayOfWeek: 1, n: 3 },
    { name: 'Groundhog Day', type: 'fixed', month: 1, day: 2 },
    { name: 'Chinese New Year', type: 'special', dates: { 2026: [1, 17], 2027: [1, 6], 2028: [0, 26] } },
    { name: 'Valentine\'s Day', type: 'fixed', month: 1, day: 14 },
    { name: 'Presidents Day', type: 'nth', month: 1, dayOfWeek: 1, n: 3 },
    { name: 'St. Patrick\'s Day', type: 'fixed', month: 2, day: 17 },
    { name: 'Good Friday', type: 'relative-easter', offset: -2 },
    { name: 'Easter', type: 'relative-easter', offset: 0 },
    { name: 'Tax Day', type: 'fixed', month: 3, day: 15 },
    { name: 'Mother\'s Day', type: 'nth', month: 4, dayOfWeek: 0, n: 2 },
    { name: 'Memorial Day', type: 'nth', month: 4, dayOfWeek: 1, n: -1 },
    { name: 'Juneteenth', type: 'fixed', month: 5, day: 19 },
    { name: 'Father\'s Day', type: 'nth', month: 5, dayOfWeek: 0, n: 3 },
    { name: 'Independence Day', type: 'fixed', month: 6, day: 4 },
    { name: 'Labor Day', type: 'nth', month: 8, dayOfWeek: 1, n: 1 },
    { name: 'Columbus Day', type: 'nth', month: 9, dayOfWeek: 1, n: 2 },
    { name: 'Halloween', type: 'fixed', month: 9, day: 31 },
    { name: 'Veterans Day', type: 'fixed', month: 10, day: 11 },
    { name: 'Thanksgiving Day', type: 'nth', month: 10, dayOfWeek: 4, n: 4 },
    { name: 'Black Friday', type: 'nth-relative', month: 10, dayOfWeek: 4, n: 4, offsetDays: 1 },
    { name: 'Cyber Monday', type: 'nth-relative', month: 10, dayOfWeek: 4, n: 4, offsetDays: 4 },
    { name: 'Christmas', type: 'fixed', month: 11, day: 25 },
  ]

  return holidayConfigs.map(config => {
    let holidayDate: Date
    
    const calculateForYear = (y: number) => {
      let d: Date
      if (config.type === 'fixed') {
        d = new Date(y, config.month!, config.day!)
      } else if (config.type === 'nth') {
        d = getNthDayOfMonth(y, config.month!, config.dayOfWeek!, config.n!)
      } else if (config.type === 'relative-easter') {
        const easter = getEaster(y)
        d = new Date(easter)
        d.setDate(easter.getDate() + config.offset!)
      } else if (config.type === 'nth-relative') {
        const base = getNthDayOfMonth(y, config.month!, config.dayOfWeek!, config.n!)
        d = new Date(base)
        d.setDate(base.getDate() + config.offsetDays!)
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
