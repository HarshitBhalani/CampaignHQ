export const revalidate = 60;

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="max-w-4xl space-y-10 text-center">
        <section className="space-y-4">
          {/* <p className="text-xs uppercase tracking-[0.2em] text-sky-400">
            CampaignHQ · Next.js · TypeScript · GraphQL
          </p> */}
          <h1 className="text-4xl font-semibold md:text-5xl">
            Your marketing analytics,{' '}
            <span className="bg-gradient-to-r from-sky-400 to-sky-400 bg-clip-text text-transparent">
              in one high-performance dashboard
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-300">
            Connect ad accounts, monitor performance in real time, and collaborate with your team.
          </p>
          <div className="flex justify-center gap-3 text-sm">
            <a
              href="/login"
              className="rounded-xl bg-sky-500 px-5 py-2 font-bold hover:bg-sky-400"
            >
              Open demo dashboard
            </a>
            {/* <a
              href="#features"
              className="rounded-xl border border-slate-700 px-5 py-2 font-semibold text-slate-200 hover:bg-slate-900/60"
            >
              View features
            </a> */}
          </div>
        </section>
{/* 
        <section
          id="features"
          className="grid gap-4 text-left text-xs md:grid-cols-3 md:text-sm"
        >
          <FeatureCard
            title="Real-time insights"
            desc="Track impressions, clicks, conversions, CTR, CPC and ROAS across all campaigns in one place."
          />
          <FeatureCard
            title="Built for performance"
            desc="Next.js App Router, SSR/SSG, Apollo Client caching and Tailwind-powered responsive UI."
          />
          <FeatureCard
            title="Team-ready"
            desc="Notes on campaigns and saved views make it easy to share context with your team."
          />
        </section> */}
      </div>
    </main>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      <p className="text-xs text-slate-300">{desc}</p>
    </div>
  );
}
