"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Pencil, QrCode, Trash2, X } from "lucide-react";
import { Input } from "~/app/_components/ui/input";
import { toast } from "sonner";
import { api as trpc } from "~/trpc/react";
import { Toaster } from "./ui/sonner";

type ShortLink = { slug: string; url: string; id: number; owner: string };

function QrPreview({ slug, onClose }: { slug: string; onClose: () => void }) {
  const [src, setSrc] = useState("");
  useEffect(() => { void QRCode.toDataURL(`${window.location.origin}/go/${slug}`, { width: 240, margin: 2 }).then(setSrc); }, [slug]);
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={onClose}><div className="rounded-xl border bg-card p-5 text-center" onClick={(event) => event.stopPropagation()}><div className="mb-4 flex items-center justify-between"><p className="font-semibold">QR code for /{slug}</p><button onClick={onClose} aria-label="Close"><X size={18} /></button></div>{src ? <img src={src} alt={`QR code for ${slug}`} className="mx-auto rounded bg-white p-2" /> : <div className="h-60 w-60 animate-pulse bg-muted" />}<a href={src} download={`${slug}-qr.png`} className="mt-4 block text-sm font-semibold text-primary hover:underline">Download PNG</a></div></div>;
}

export function UrlComponent({ data }: { data: ShortLink[] }) {
  const [slug, setSlug] = useState("");
  const [url, setUrl] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [qrSlug, setQrSlug] = useState<string | null>(null);
  const removeMutation = trpc.short.removeSlug.useMutation();
  const createMutation = trpc.short.createSlug.useMutation();
  const updateMutation = trpc.short.updateSlug.useMutation();
  const submitData = (event: React.FormEvent) => { event.preventDefault(); createMutation.mutate({ slug, url }, { onSuccess: () => { toast("Short link created"); window.location.reload(); }, onError: (error) => toast(error.message) }); };
  return <div className="w-full max-w-2xl px-4 py-12 text-left sm:py-20"><div className="mb-10"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Redirect desk</p><h1 className="text-4xl font-semibold tracking-tight">Short links with a second life.</h1><p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">Create clean redirects, update their destination later, and share them as QR codes.</p></div><form onSubmit={submitData} className="mb-12 grid gap-3 rounded-xl border bg-card p-5 sm:grid-cols-[0.6fr_1fr_auto] sm:items-end"><label className="grid gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Slug<Input required value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="launch" /></label><label className="grid gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Destination<Input required type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com" /></label><button className="h-10 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50" disabled={createMutation.isPending}>{createMutation.isPending ? "Creating…" : "Create"}</button></form><div className="flex items-baseline justify-between"><h2 className="text-lg font-semibold">Your short links</h2><span className="text-xs text-muted-foreground">{data.length} total</span></div><ul className="mt-4 grid gap-3">{data.map((item) => <li key={item.slug} className="rounded-lg border bg-card p-4"><div className="flex flex-wrap items-center gap-3"><div className="min-w-0 flex-1"><a href={`/go/${item.slug}`} className="font-mono text-sm font-semibold text-primary hover:underline">/go/{item.slug}</a><p className="truncate text-xs text-muted-foreground">{item.url}</p></div><button title="Copy" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/go/${item.slug}`); toast("Short link copied"); }}><Copy size={16} /></button><button title="QR code" onClick={() => setQrSlug(item.slug)}><QrCode size={16} /></button><button title="Edit destination" onClick={() => { setEditing(item.slug); setEditUrl(item.url); }}><Pencil size={16} /></button><button title="Delete" className="text-muted-foreground hover:text-red-300" onClick={() => removeMutation.mutate({ slug: item.slug }, { onSuccess: () => window.location.reload() })}><Trash2 size={16} /></button></div>{editing === item.slug && <form className="mt-4 flex gap-2" onSubmit={(event) => { event.preventDefault(); updateMutation.mutate({ slug: item.slug, url: editUrl }, { onSuccess: () => { toast("Destination updated"); window.location.reload(); }, onError: (error) => toast(error.message) }); }}><Input type="url" value={editUrl} onChange={(event) => setEditUrl(event.target.value)} /><button className="rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground">Save</button><button type="button" className="px-2 text-sm text-muted-foreground" onClick={() => setEditing(null)}>Cancel</button></form>}</li>)}</ul>{qrSlug && <QrPreview slug={qrSlug} onClose={() => setQrSlug(null)} />}<Toaster /></div>;
}
