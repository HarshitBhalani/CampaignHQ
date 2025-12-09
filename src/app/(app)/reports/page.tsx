'use client';

import { useQuery } from '@apollo/client';
import { GET_REPORTS } from '@/graphql/queries';

export default function ReportsPage() {
  const { data, loading, error } = useQuery(GET_REPORTS);

  const reports = data?.reports ?? [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Reports</h1>
        <p className="text-xs text-slate-400">
          Saved views and shareable performance reports for your organization.
        </p>
      </div>

      {loading && <p className="text-sm text-slate-400">Loading reports…</p>}
      {error && <p className="text-sm text-red-400">Failed to load reports.</p>}

      {!loading && reports.length === 0 && (
        <p className="text-sm text-slate-400">
          No reports yet. From the dashboard you could save filtered views as reports.
        </p>
      )}

      {reports.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((r: any) => (
            <div
              key={r.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-xs"
            >
              <h2 className="mb-2 text-sm font-semibold">{r.name}</h2>
              <p className="mb-3 text-slate-300">
                {r.filters.dateFrom} → {r.filters.dateTo}{' '}
                {r.filters.channel ? `· ${r.filters.channel} only` : '· All channels'}
              </p>
              <p className="text-[11px] text-slate-500">
                Created by {r.createdBy.name} on{' '}
                {new Date(r.createdAt).toLocaleString()}
              </p>
              <p className="mt-2 text-[11px] text-slate-500">
                In a real app this card would link to a statically generated report page (SSG/ISR).
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
