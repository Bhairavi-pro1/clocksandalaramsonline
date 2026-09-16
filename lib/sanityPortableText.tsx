import { PortableTextComponents } from '@portabletext/react'
import { urlFor } from '@/lib/sanity'

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null
      return (
        <figure className="my-4 md:my-10 space-y-1.5 md:space-y-3">
          <div className="relative rounded-xl md:rounded-2xl overflow-hidden border border-white/10 shadow-none md:shadow-xl max-h-[450px]">
            <img
              src={urlFor(value).width(1200).quality(85).url()}
              alt={value.alt || 'Article illustration'}
              className="w-full h-full object-cover max-h-[450px]"
              loading="lazy"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-[10px] sm:text-xs md:text-sm text-white/40 mt-1.5 md:mt-4 font-medium italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-base sm:text-xl md:text-3xl font-black text-white tracking-tight mt-5 md:mt-12 mb-2 md:mb-5 font-display">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-[14px] sm:text-lg md:text-2xl font-black text-white tracking-tight mt-4 md:mt-8 mb-1.5 md:mb-4 font-display">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-[13px] sm:text-base md:text-xl font-bold text-white/90 mt-3.5 md:mt-6 mb-1 md:mb-3 font-display">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-[13.5px] sm:text-[15px] md:text-[18px] text-white/80 leading-[1.6] md:leading-[1.8] mb-3 md:mb-6 font-normal text-justify">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-[3px] md:border-l-4 border-primary pl-3 md:pl-6 py-1.5 md:py-4 my-3 md:my-8 bg-primary/5 rounded-r-lg md:rounded-r-2xl relative overflow-hidden">
        <span className="absolute -left-2 -top-4 text-4xl md:text-7xl text-primary/10 font-serif pointer-events-none select-none">“</span>
        <p className="text-xs sm:text-sm md:text-lg text-white/90 italic font-medium relative z-10 leading-relaxed text-justify">{children}</p>
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-white">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-white/95">{children}</em>
    ),
    underline: ({ children }) => (
      <span className="underline underline-offset-4 decoration-primary/50">{children}</span>
    ),
    code: ({ children }) => (
      <code className="bg-primary/10 text-primary border border-primary/15 rounded-md px-1.5 py-0.5 text-xs md:text-sm font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-primary hover:text-accent underline underline-offset-4 decoration-primary/30 hover:decoration-accent/60 transition-colors font-bold"
        >
          {children}
        </a>
      )
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside ml-4 md:ml-6 space-y-1 md:space-y-3 my-2.5 md:my-6 text-white/80 marker:text-primary/70">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside ml-4 md:ml-6 space-y-1 md:space-y-3 my-2.5 md:my-6 text-white/80 marker:text-primary/70 marker:font-bold">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-[13.5px] sm:text-[15px] md:text-[18px] leading-[1.6] md:leading-[1.8] font-normal pl-1 md:pl-2 text-justify">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="text-[13.5px] sm:text-[15px] md:text-[18px] leading-[1.6] md:leading-[1.8] font-normal pl-1 md:pl-2 text-justify">
        {children}
      </li>
    ),
  },
}
