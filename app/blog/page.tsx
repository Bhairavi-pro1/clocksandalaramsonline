import { Metadata } from 'next'
import { getAllPosts, urlFor } from '@/lib/sanity'
import Link from 'next/link'
import { BookOpen, Clock, ArrowRight, Tag } from 'lucide-react'
import StructuredData from '@/components/seo/StructuredData'
import AdBanner from '@/components/ui/AdBanner'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog & Insights',
  description:
    'Explore expert insights on the history of timekeeping, clock technology, productivity tips, and precision tool guides.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/blog',
  },
  openGraph: {
    title: 'Blog & Insights',
    description:
      'Deep-dive articles covering the fascinating history of time, modern clock technology, and actionable productivity strategies.',
    type: 'website',
  },
}

const categoryLabels: Record<string, string> = {
  'time-history': 'Time History',
  'clock-technology': 'Clock Technology',
  'productivity-tips': 'Productivity Tips',
  'tool-guides': 'Tool Guides',
  'time-zones-dst': 'Time Zones & DST',
  'fun-facts': 'Fun Facts',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Clocks and Alarms Online Blog',
    description:
      'Expert articles on the history of timekeeping, clock technology, productivity tips, and precision tool guides.',
    url: 'https://clocksandalarmsonline.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Clocks and Alarms Online',
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://clocksandalarmsonline.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://clocksandalarmsonline.com/blog',
      },
    ],
  }

  return (
    <div className="w-full min-h-screen">
      <StructuredData data={blogSchema} />
      <StructuredData data={breadcrumbSchema} />

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 pt-16 text-center space-y-6 animate-in fade-in duration-1000">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
          Expert Knowledge Base
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1]">
          Blog &{' '}
          <span className="text-primary italic font-serif">Insights</span>
        </h1>
        <p className="text-lg text-muted/60 max-w-3xl mx-auto font-medium">
          Deep-dive articles on the fascinating history of timekeeping, modern
          clock technology, and actionable productivity strategies from our
          experts.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-32 space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto border border-primary/20">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-black text-white">
              Articles Coming Soon
            </h2>
            <p className="text-muted/60 max-w-md mx-auto font-medium">
              Our experts are crafting insightful articles on time, clocks, and
              productivity. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="group relative bg-[#1a0b2e]/40 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  {post.mainImage?.asset && (
                    <div className="relative h-40 w-full overflow-hidden">
                      <img
                        src={urlFor(post.mainImage)
                          .width(600)
                          .height(340)
                          .quality(80)
                          .url()}
                        alt={post.mainImage.alt || post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e] via-transparent to-transparent" />
                    </div>
                  )}

                  <div className="p-5 space-y-3 relative z-10">
                    {/* Category & Date */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20">
                        {categoryLabels[post.category] || post.category}
                      </span>
                      <ArrowRight
                        className="text-white/20 group-hover:text-primary group-hover:translate-x-1.5 transition-all"
                        size={16}
                      />
                    </div>

                    {/* Title */}
                    <h2 className="text-base md:text-lg font-black text-white tracking-tight group-hover:text-primary transition-colors leading-tight line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-xs md:text-sm text-muted/60 font-medium line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  {/* Footer */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-primary" />
                      <span className="text-xs font-bold text-white/40">
                        {new Date(post.publishedAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        )}
                      </span>
                    </div>
                    {post.estimatedReadingTime && (
                      <span className="text-xs font-bold text-white/30">
                        {post.estimatedReadingTime} min read
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <AdBanner />
      </div>
    </div>
  )
}
