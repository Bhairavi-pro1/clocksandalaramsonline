export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Studio has its own full-page UI, bypass the main site layout wrapper
  return (
    <div className="fixed inset-0 z-[200]">
      {children}
    </div>
  )
}
