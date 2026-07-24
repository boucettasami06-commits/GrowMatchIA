export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)]">
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--color-rose)] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="font-bold text-xl text-[var(--color-text)]">GlowMatch</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="#pricing"
            className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition"
          >
            FAQ
          </a>
          <button className="btn btn-primary text-sm">Start Free</button>
        </div>
      </nav>
    </header>
  );
}
