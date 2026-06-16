import { redirect } from 'next/navigation'
import { getSportsMatches, getSportSlug } from '@/lib/sports'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const matches = await getSportsMatches()
  return matches.map((match) => ({
    id: match.id
  }))
}

export default async function LegacyMatchRedirect({ params }: Props) {
  const { id } = await params
  const matches = await getSportsMatches()
  const match = matches.find((m) => m.id === id)
  
  if (match) {
    redirect(`/sports-schedule/${getSportSlug(match.sport)}/match/${id}/`)
  } else {
    redirect('/sports-schedule/fifa-worldcup-2026/')
  }
}
