// src/components/AppShell.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/reports', label: 'Reports' },
  { href: '/settings', label: 'Settings' }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    window.localStorage.removeItem('campaignhq_token');
    router.push('/login');
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-900/60 p-4 md:flex">
        <div className="mb-6 text-lg font-semibold">CampaignHQ</div>
        <nav className="space-y-1 text-sm">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 ${
                  active ? 'bg-sky-500/10 text-sky-400' : 'hover:bg-slate-800'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="mt-auto rounded-lg bg-slate-800 px-3 py-2 text-xs hover:bg-slate-700"
        >
          Log out
        </button>
      </aside>
      <main className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/40 px-4 py-3">
          <div className="text-sm text-slate-300">Marketing Analytics Dashboard</div>
        </header>
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}
