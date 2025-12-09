'use client';

import { useQuery, useMutation } from '@apollo/client';
import { GET_CAMPAIGN, CREATE_NOTE, UPDATE_NOTE, DELETE_NOTE } from '@/graphql/queries';
import { useParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, loading, error, refetch } = useQuery(GET_CAMPAIGN, {
    variables: { id }
  });

  const [note, setNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const [createNote, { loading: creating }] = useMutation(CREATE_NOTE, {
    onCompleted: () => {
      setNote('');
      refetch();
    }
  });

  const [updateNote, { loading: updating }] = useMutation(UPDATE_NOTE, {
    onCompleted: () => {
      setEditingId(null);
      setEditingContent('');
      refetch();
    }
  });

  const [deleteNote] = useMutation(DELETE_NOTE, {
    onCompleted: () => refetch()
  });

  if (loading) return <p className="text-sm text-slate-400">Loading campaign…</p>;
  if (error) return <p className="text-sm text-red-400">Failed to load campaign.</p>;

  const campaign = data?.campaign;
  if (!campaign) return <p className="text-sm text-slate-400">Campaign not found.</p>;

  const latest = campaign.metrics[0];

  async function handleAddNote(e: FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;

    try {
      await createNote({
        variables: {
          campaignId: campaign.id,
          content: note.trim()
        }
      });
    } catch {
      alert('Failed to add note. Please try again.');
    }
  }

  async function handleSaveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editingId || !editingContent.trim()) return;

    try {
      await updateNote({
        variables: {
          id: editingId,
          content: editingContent.trim()
        }
      });
    } catch {
      alert('Failed to update note.');
    }
  }

  async function handleDelete(id: string) {
    const ok = window.confirm('Delete this note?');
    if (!ok) return;

    try {
      await deleteNote({ variables: { id } });
    } catch {
      alert('Failed to delete note.');
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">{campaign.name}</h1>
        <p className="text-xs text-slate-400">
          Channel: {campaign.channel} · Status:{' '}
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] ${
              campaign.status === 'ACTIVE'
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-slate-500/10 text-slate-300'
            }`}
          >
            {campaign.status}
          </span>
        </p>
      </div>

      {latest && (
        <div className="grid gap-3 md:grid-cols-4 text-xs">
          <MetricCard label="Impressions" value={latest.impressions} />
          <MetricCard label="Clicks" value={latest.clicks} />
          <MetricCard label="Conversions" value={latest.conversions} />
          <MetricCard label="ROAS" value={latest.roas.toFixed(1)} />
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-[2fr,1fr]">
        {/* Metrics list */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-xs">
          <h2 className="mb-2 text-sm font-semibold">Performance (latest points)</h2>
          <div className="space-y-1">
            {campaign.metrics.map((m: any) => (
              <div
                key={m.date}
                className="flex flex-col rounded-lg bg-slate-900/70 px-2 py-1 md:flex-row md:items-center md:justify-between"
              >
                <span className="text-slate-300">{m.date}</span>
                <span className="text-slate-400">
                  Impr {m.impressions} · Clicks {m.clicks} · Conv {m.conversions} · CTR{' '}
                  {(m.ctr * 100).toFixed(1)}% · ROAS {m.roas.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes column */}
        <div className="space-y-3">
          {/* Add note */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-xs">
            <h2 className="mb-2 text-sm font-semibold">Add Note</h2>
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
                rows={3}
                placeholder="Add an insight or action item…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button
                type="submit"
                disabled={creating}
                className="w-full rounded-lg bg-sky-500 px-3 py-1 text-xs font-semibold hover:bg-sky-400 disabled:opacity-60"
              >
                {creating ? 'Adding…' : 'Add note'}
              </button>
            </form>
          </div>

          {/* Existing notes */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-xs">
            <h3 className="mb-2 text-sm font-semibold">Existing notes</h3>
            {campaign.notes.length === 0 && (
              <p className="text-slate-400">No notes yet. Add your first insight.</p>
            )}

            {campaign.notes.map((n: any) => (
              <div key={n.id} className="mb-2 rounded-lg bg-slate-950 px-2 py-1">
                {editingId === n.id ? (
                  <form onSubmit={handleSaveEdit} className="space-y-2">
                    <textarea
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
                      rows={3}
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditingContent('');
                        }}
                        className="rounded-lg border border-slate-600 px-2 py-1 hover:bg-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updating}
                        className="rounded-lg bg-sky-500 px-2 py-1 font-semibold hover:bg-sky-400 disabled:opacity-60"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p>{n.content}</p>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                      <span>
                        {n.author.name} · {new Date(n.createdAt).toLocaleString()}
                      </span>
                      <div className="flex gap-2">
                        <button
                          className="underline hover:text-sky-400"
                          onClick={() => {
                            setEditingId(n.id);
                            setEditingContent(n.content);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="underline hover:text-red-400"
                          onClick={() => handleDelete(n.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
