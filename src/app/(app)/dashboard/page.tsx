'use client';

import { useQuery } from '@apollo/client';
import { GET_CAMPAIGNS } from '@/graphql/queries';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type Channel = 'GOOGLE' | 'META' | undefined;
type Status = 'ACTIVE' | 'PAUSED' | undefined;

export default function DashboardPage() {
  const [channel, setChannel] = useState<Channel>();
  const [status, setStatus] = useState<Status>();
  const [search, setSearch] = useState('');

  const { data, loading, error, refetch } = useQuery(GET_CAMPAIGNS, {
    variables: {
      filter: {
        channel,
        status,
        search: search || undefined
      },
      pagination: {
        offset: 0,
        limit: 50
      }
    }
  });

  const campaigns = data?.campaigns.items ?? [];

  const summary = useMemo(() => {
    if (!campaigns.length) return null;

    let totalImpr = 0;
    let totalClicks = 0;
    let totalConv = 0;
    let totalCost = 0;

    campaigns.forEach((c: any) => {
      const latest = c.metrics[0];
      if (!latest) return;
      totalImpr += latest.impressions;
      totalClicks += latest.clicks;
      totalConv += latest.conversions;
      totalCost += latest.cost;
    });

    const ctr = totalImpr ? (totalClicks / totalImpr) * 100 : 0;
    const cpc = totalClicks ? totalCost / totalClicks : 0;
    const convRate = totalClicks ? (totalConv / totalClicks) * 100 : 0;

    return {
      totalImpr,
      totalClicks,
      totalConv,
      totalCost,
      ctr,
      cpc,
      convRate
    };
  }, [campaigns]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Performance Overview</h1>
          <p className="text-xs text-slate-400">
            Monitor all your Google & Meta campaigns in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <select
            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1"
            value={channel ?? ''}
            onChange={(e) =>
              setChannel(e.target.value ? (e.target.value as Channel) : undefined)
            }
          >
            <option value="">All channels</option>
            <option value="GOOGLE">Google</option>
            <option value="META">Meta</option>
          </select>
          <select
            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1"
            value={status ?? ''}
            onChange={(e) => setStatus(e.target.value ? (e.target.value as Status) : undefined)}
          >
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
          </select>
          <input
            placeholder="Search by name…"
            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-sky-500 px-3 py-1 font-semibold hover:bg-sky-400"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid gap-3 text-xs md:grid-cols-4">
          <SummaryCard label="Total Impressions" value={summary.totalImpr.toLocaleString()} />
          <SummaryCard label="Total Clicks" value={summary.totalClicks.toLocaleString()} />
          <SummaryCard label="Total Conversions" value={summary.totalConv.toLocaleString()} />
          <SummaryCard
            label="Avg CTR / Conv%"
            value={`${summary.ctr.toFixed(1)}% / ${summary.convRate.toFixed(1)}%`}
          />
        </div>
      )}

      {/* Table */}
      {loading && <p className="text-sm text-slate-400">Loading campaigns…</p>}
      {error && (
        <p className="text-sm text-red-400">
          Failed to load campaigns. Try logging in again or refreshing.
        </p>
      )}

      {!loading && campaigns.length === 0 && (
        <p className="text-sm text-slate-400">No campaigns found.</p>
      )}

      {campaigns.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-900/60 text-[11px] uppercase text-slate-400">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Channel</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Impr.</th>
                <th className="px-4 py-2">Clicks</th>
                <th className="px-4 py-2">Conv.</th>
                <th className="px-4 py-2">CTR</th>
                <th className="px-4 py-2">CPC</th>
                <th className="px-4 py-2">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c: any) => {
                const latest = c.metrics[0];
                if (!latest) return null;
                const ctr = latest.ctr * 100;
                const cpc = latest.clicks ? latest.cost / latest.clicks : 0;

                return (
                  <tr
                    key={c.id}
                    className="border-b border-slate-800/60 hover:bg-slate-800/40"
                  >
                    <td className="px-4 py-2">
                      <Link
                        href={`/campaigns/${c.id}`}
                        className="text-xs font-medium text-sky-400 hover:underline"
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2">{c.channel}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] ${
                          c.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-slate-500/10 text-slate-300'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{latest.impressions}</td>
                    <td className="px-4 py-2">{latest.clicks}</td>
                    <td className="px-4 py-2">{latest.conversions}</td>
                    <td className="px-4 py-2">{ctr.toFixed(1)}%</td>
                    <td className="px-4 py-2">₹{cpc.toFixed(2)}</td>
                    <td className="px-4 py-2">{latest.roas.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
