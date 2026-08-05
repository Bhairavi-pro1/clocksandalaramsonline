import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { getAllPosts, getPostBySlug, getRelatedPosts, urlFor } from '@/lib/sanity'
import { portableTextComponents } from '@/lib/sanityPortableText'
import StructuredData from '@/components/seo/StructuredData'
import AdBanner from '@/components/ui/AdBanner'
import ShareButton from '@/components/ui/ShareButton'
import { ArrowLeft, Clock, User, Tag, ArrowRight } from 'lucide-react'

export const revalidate = 60
export const dynamicParams = true

interface Props {
  params: Promise<{ slug: string }>
}

const categoryLabels: Record<string, string> = {
  'time-history': 'Time History',
  'clock-technology': 'Clock Technology',
  'productivity-tips': 'Productivity Tips',
  'tool-guides': 'Tool Guides',
  'time-zones-dst': 'Time Zones & DST',
  'fun-facts': 'Fun Facts',
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug.current,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://clocksandalarmsonline.com/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      ...(post.mainImage?.asset && {
        images: [
          {
            url: urlFor(post.mainImage).width(1200).height(630).url(),
            width: 1200,
            height: 630,
            alt: post.mainImage.alt || post.title,
          },
        ],
      }),
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.category, slug)

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    ...(post.mainImage?.asset && {
      image: urlFor(post.mainImage).width(1200).height(630).url(),
    }),
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Clocks and Alarms Online',
      url: 'https://clocksandalarmsonline.com',
    },
    datePublished: post.publishedAt,
    mainEntityOfPage: `https://clocksandalarmsonline.com/blog/${slug}`,
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
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://clocksandalarmsonline.com/blog/${slug}`,
      },
    ],
  }

  return (
    <div className="w-full min-h-screen">
      <StructuredData data={blogPostingSchema} />
      <StructuredData data={breadcrumbSchema} />

      {/* Mobile-Only Header & Hero */}
      <div className="block md:hidden w-full relative">
        {/* First: Back & Share action row */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-white/50 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          <ShareButton
            title={post.title}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/10 transition-colors"
          />
        </div>

        {/* Second: Title & Metadata */}
        <div className="px-4 pt-6 space-y-3">
          <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-muted/60 font-bold">
            <div className="flex items-center gap-1.5">
              <Tag size={13} className="text-primary" />
              <span>{categoryLabels[post.category] || post.category}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-primary" />
              <span>
                {post.estimatedReadingTime ? `${post.estimatedReadingTime} min read` : '5 min read'}
              </span>
            </div>
          </div>
        </div>

        {/* Third: Author Section */}
        <div className="px-4 pt-6 flex items-center justify-between">
          <div>
            <div className="text-sm font-black text-white leading-tight">{post.author}</div>
            <div className="text-[11px] text-muted font-medium">Clocks & Alarms Author</div>
          </div>
        </div>

        {/* Fourth: Main Featured Image */}
        {post.mainImage?.asset && (
          <div className="px-4 mt-6">
            <div className="relative h-[220px] sm:h-[320px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl w-full">
              <img
                src={urlFor(post.mainImage).width(800).quality(85).url()}
                alt={post.mainImage.alt || post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Desktop Header & Featured Image */}
      <div className="hidden md:block">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto px-4 pt-16 space-y-8 animate-in fade-in duration-1000">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-white/50 hover:text-primary transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Blog
          </Link>

          {/* Category Badge */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/20">
              {categoryLabels[post.category] || post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.1]">
            {post.title}
          </h1>

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted/60 font-medium">
            <div className="flex items-center gap-2">
              <User size={16} className="text-primary" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              <span>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            {post.estimatedReadingTime && (
              <span className="text-white/30 font-bold">
                {post.estimatedReadingTime} min read
              </span>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {post.mainImage?.asset && (
          <div className="max-w-6xl mx-auto px-4 mt-10">
            <div className="relative h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/5 w-full">
              <img
                src={urlFor(post.mainImage).width(1400).quality(85).url()}
                alt={post.mainImage.alt || post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0118]/40 via-transparent to-transparent" />
            </div>
          </div>
        )}
      </div>

      {/* Article Body */}
      <article className="max-w-6xl mx-auto px-4 py-8 md:py-16">
        <div className="p-0 md:p-14 bg-transparent md:bg-card border-0 md:border md:border-card-border rounded-none md:rounded-2xl shadow-none md:shadow-xl">
          <PortableText value={post.body} components={portableTextComponents} />
        </div>
      </article>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <AdBanner />
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-24 space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Related{' '}
              <span className="text-primary italic font-serif">Articles</span>
            </h2>
            <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full" />
          </div>

          <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8 divide-y divide-white/10 md:divide-y-0">
            {relatedPosts.map((related) => (
              <Link
                key={related._id}
                href={`/blog/${related.slug.current}`}
                className="group relative flex flex-row md:flex-col items-center md:items-stretch justify-between md:justify-start gap-4 md:gap-0 bg-transparent md:bg-card border-0 md:border md:border-card-border rounded-none md:rounded-[2.5rem] overflow-visible md:overflow-hidden hover:border-primary/40 transition-all duration-500 py-4 md:py-0 first:pt-0 last:pb-0"
              >
                {related.mainImage?.asset && (
                  <div className="relative w-20 h-20 md:w-full md:h-40 rounded-xl md:rounded-none overflow-hidden shrink-0 order-2 md:order-1">
                    <img
                      src={urlFor(related.mainImage)
                        .width(400)
                        .height(400)
                        .quality(75)
                        .url()}
                      alt={related.mainImage.alt || related.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent hidden md:block" />
                  </div>
                )}
                <div className="p-0 md:p-6 space-y-2 md:space-y-3 flex-1 order-1 md:order-2">
                  <div className="hidden md:flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-primary/20 text-primary">
                      {categoryLabels[related.category] || related.category}
                    </span>
                    <ArrowRight
                      className="text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all"
                      size={16}
                    />
                  </div>
                  <h3 className="text-sm md:text-lg font-black text-white tracking-tight group-hover:text-primary transition-colors leading-snug md:leading-tight line-clamp-2">
                    {related.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted/50 font-bold">
                    <span className="md:hidden text-primary/70">{categoryLabels[related.category] || related.category}</span>
                    <span className="md:hidden">•</span>
                    <span>
                      {new Date(related.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
