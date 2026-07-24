export default function Hero() {
  return (
    <section className="section-light">
      <div className="section grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Content */}
        <div>
          <h1 className="text-[var(--color-text)] mb-6">
            Your Personal AI Beauty Coach
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg mb-8">
            Get a personalized skincare routine in 5 minutes. Track your progress. Achieve your beauty goals with AI guidance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="btn btn-primary">Start Free</button>
            <button className="btn btn-outline">Learn More</button>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-8">
            <div>
              <div className="text-2xl font-bold text-[var(--color-rose)]">50K+</div>
              <p className="text-sm text-[var(--color-text-secondary)]">Active Users</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--color-rose)]">4.8★</div>
              <p className="text-sm text-[var(--color-text-secondary)]">Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Right: Image */}
        <div className="relative">
          <div className="w-full h-96 bg-[var(--color-rose-light)] rounded-2xl overflow-hidden flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop"
              alt="Beauty skincare"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Floating card */}
          <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 max-w-xs">
            <p className="text-sm font-medium text-[var(--color-text)]">
              ✨ Your routine, personalized for you in seconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
