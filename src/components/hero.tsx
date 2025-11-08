export function Hero() {
  return (
    <section className="section relative overflow-hidden">
      <div className="container">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-balance">
              Modern Components for <span className="text-primary">AxioQuan</span>
            </span>
          </h1>
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto mb-8">
            A comprehensive component library built with TypeScript, Tailwind CSS, and modern React patterns. Everything
            you need to build beautiful applications.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-primary text-background font-medium rounded-lg hover:bg-primary-dark transition-colors">
              Explore Components
            </button>
            <button className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-surface-hover transition-colors">
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
