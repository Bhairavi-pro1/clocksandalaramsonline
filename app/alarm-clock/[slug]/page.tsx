import { Metadata } from 'next'
import AlarmTimeClient from './AlarmTimeClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cleaned = slug.replace('set-alarm-for-', '').replace(/-/g, ' ').trim()
  const parts = cleaned.split(/\s+/)
  
  let hours = 0
  let minutes = 0
  let period = 'AM'

  const lastPart = parts[parts.length - 1].toUpperCase()
  if (lastPart === 'AM' || lastPart === 'PM') {
    period = lastPart
    parts.pop()
  }

  const timeData = parts.join(':')
  if (timeData.includes(':')) {
    const t = timeData.split(':')
    hours = parseInt(t[0])
    minutes = parseInt(t[1]) || 0
  } else {
    hours = parseInt(timeData)
    minutes = 0
  }
  
  const displayTime = `${hours}:${String(minutes).padStart(2, '0')} ${period}`
  const title = `Set alarm for ${displayTime}`
  const description = `In fact, an alarm for minutes past ${hours}:${String(minutes).padStart(2, '0')} ${period} is preset on this page. All you need to do is to enter a custom message (optional) and select the sound you want the alarm to make.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    }
  }
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params
  return <AlarmTimeClient params={resolvedParams} />
}
