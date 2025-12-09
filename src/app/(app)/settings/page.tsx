'use client';

import { useQuery } from '@apollo/client';
import { GET_ME } from '@/graphql/queries';

export default function SettingsPage() {
  const { data, loading, error } = useQuery(GET_ME);

  const user = data?.me;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-xs text-slate-400">
          Manage your profile, organization and ad account connections.
        </p>
      </div>

      {loading && <p className="text-sm text-slate-400">Loading profile…</p>}
      {error && <p className="text-sm text-red-400">Failed to load profile.</p>}

      {user && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Profile card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs">
            <h2 className="mb-3 text-sm font-semibold">Profile</h2>
            <div className="space-y-2">
              <Row label="Name" value={user.name} />
              <Row label="Email" value={user.email} />
              <Row label="Organization" value={user.organization.name} />
            </div>
          </div>

          {/* Ad accounts mock card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs">
            <h2 className="mb-3 text-sm font-semibold">Ad Accounts</h2>
            <p className="mb-3 text-slate-400">
              In a production setup you would connect Google Ads, Meta Ads and other platforms
              here. For this demo it&apos;s mocked.
            </p>
            <div className="space-y-2">
              <button className="w-full rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold hover:bg-sky-400">
                Connect Google Ads (mock)
              </button>
              <button className="w-full rounded-lg bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-500/20">
                Connect Meta Ads (mock)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-950 px-3 py-2">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
