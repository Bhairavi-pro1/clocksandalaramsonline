import { createClient, type SanityClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// Only create client if we have a valid-looking project ID (a-z, 0-9, dashes)
const isConfigured = /^[a-z0-9-]+$/.test(projectId) && projectId !== 'your_project_id'

export const client: SanityClient | null = isConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: false,
      token: process.env.SANITY_API_TOKEN,
    })
  : null 

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const builder = client ? imageUrlBuilder(client) : null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  if (!builder) throw new Error('Sanity is not configured – set NEXT_PUBLIC_SANITY_PROJECT_ID in .env')
  return builder.image(source)
}

// ── Types ────────────────────────────────────────────────

export interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  mainImage?: {
    asset: { _ref: string }
    alt?: string
  }
  body: any[]
  author: string
  category: string
  publishedAt: string
  estimatedReadingTime?: number
}

// ── GROQ Queries ─────────────────────────────────────────

const postFields = `
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  author,
  category,
  publishedAt,
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 200)
`

export async function getAllPosts(): Promise<Post[]> {
  if (!client) return []
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      ${postFields}
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!client) return null
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      ${postFields},
      body
    }`,
    { slug },
    { next: { revalidate: 60 } }
  )
}

export async function getRelatedPosts(category: string, currentSlug: string): Promise<Post[]> {
  if (!client) return []
  return client.fetch(
    `*[_type == "post" && category == $category && slug.current != $currentSlug] | order(publishedAt desc) [0...3] {
      ${postFields}
    }`,
    { category, currentSlug },
    { next: { revalidate: 60 } }
  )
}

