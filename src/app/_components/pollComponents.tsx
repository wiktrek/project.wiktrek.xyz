"use client";

import { api } from "~/trpc/react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import copy from "copy-to-clipboard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/app/_components/ui/input";
import type { CreateQuestionInputType } from "~/shared/create-question-validator";
import { createQuestionValidator } from "~/shared/create-question-validator";
import { useEffect, useMemo, useState } from "react";

type PollType = "single" | "multiple" | "ranking" | "rating";
type Option = { text: string };
type VoteData = { choice: number; answers: number[]; createdAt: Date | null };

export function DeletePoll({ id }: { id: number }) {
  const mutation = api.question.deleteQuestion.useMutation();
  return <button className="text-accent ml-2 text-sm font-semibold hover:text-red-300" onClick={() => mutation.mutate({ id })}>Delete</button>;
}

export function CopyUrl({ id }: { id: number }) {
  return <button className="text-muted-foreground text-xs hover:text-foreground" onClick={() => { copy(`${window.location.origin}/poll/q/${id}`); toast("Poll link copied"); }}>Copy link</button>;
}

export function FormComponent() {
  const router = useRouter();
  const mutation = api.question.createQuestion.useMutation({ onSuccess(data) { reset(); if (data[0]) router.push(`/poll/q/${data[0].insertedId}`); toast("Poll created"); } });
  const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm<CreateQuestionInputType>({
    resolver: zodResolver(createQuestionValidator),
    defaultValues: { options: [{ text: "Yes" }, { text: "No" }], questionType: "single", endsAt: "" },
  });
  const { fields, append, remove } = useFieldArray({ name: "options", control });
  const type = watch("questionType") as PollType;
  return <form onSubmit={handleSubmit((data) => mutation.mutate({ question: data.question, options: data.options, questionType: data.questionType, endsAt: data.endsAt ? new Date(data.endsAt) : null }))} className="w-full max-w-2xl space-y-7 text-left">
    <label className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Question</span><Input {...register("question")} placeholder="What should we make next?" className="h-14 text-lg" />{errors.question && <p className="text-xs text-red-300">{errors.question.message}</p>}</label>
    <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Answer format</span><select {...register("questionType")} className="h-11 rounded-md border bg-card px-3 text-sm text-foreground"><option value="single">Single choice</option><option value="multiple">Multiple choice</option><option value="ranking">Ranking</option><option value="rating">Rating scale</option></select></label><label className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Close at (optional)</span><Input type="datetime-local" {...register("endsAt")} className="h-11" /></label></div>
    <label className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{type === "rating" ? "Scale labels" : "Answer options"}</span>{fields.map((field, index) => <div key={field.id} className="flex gap-2"><Input {...register(`options.${index}.text`)} placeholder={`Option ${index + 1}`} />{fields.length > 2 && <button type="button" onClick={() => remove(index)} className="px-2 text-sm text-muted-foreground hover:text-red-300">Remove</button>}</div>)}{type !== "rating" && <button type="button" onClick={() => append({ text: "" })} className="justify-self-start text-sm font-semibold text-primary hover:underline">+ Add option</button>}{errors.options && <p className="text-xs text-red-300">{errors.options.message}</p>}</label>
    <button type="submit" disabled={mutation.isPending} className="w-full rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 active:translate-y-px disabled:opacity-50">{mutation.isPending ? "Creating…" : "Create poll"}</button>
  </form>;
}

function VoteForm({ questionId, type, options, onVoted }: { questionId: number; type: PollType; options: Option[]; onVoted: () => void }) {
  const [selected, setSelected] = useState<number[]>([]);
  const mutation = api.question.voteOn.useMutation({ onSuccess: onVoted, onError: (error) => toast(error.message) });
  const toggle = (index: number) => setSelected((current) => {
    if (type === "single" || type === "rating") return current[0] === index ? [] : [index];
    return current.includes(index) ? current.filter((item) => item !== index) : [...current, index];
  });
  return <div className="mt-6 grid gap-2"><p className="text-xs text-muted-foreground">{type === "multiple" ? "Choose all that apply" : type === "ranking" ? "Tap answers in your preferred order" : type === "rating" ? "Choose a rating" : "Choose one answer"}</p>{options.map((option, index) => { const active = selected.includes(index); return <button key={option.text + index} onClick={() => toggle(index)} className={`flex items-center justify-between rounded-md border px-4 py-3 text-left transition-colors ${active ? "border-primary bg-primary/15 text-primary" : "hover:border-primary/60"}`}><span>{type === "ranking" && active ? `${selected.indexOf(index) + 1}. ` : ""}{option.text}</span>{active && <span className="text-xs">Selected</span>}</button>; })}<button onClick={() => { if (!selected.length) return toast("Choose at least one answer"); mutation.mutate({ questionId, option: selected[0]!, answers: selected }); }} disabled={mutation.isPending} className="mt-2 rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-50">{mutation.isPending ? "Saving…" : "Submit answer"}</button></div>;
}

function Results({ options, votes, viewCount }: { options: Option[]; votes: VoteData[]; viewCount: number }) {
  const counts = useMemo(() => options.map((_, index) => votes.reduce((total, item) => total + ((item.answers ?? [item.choice]).includes(index) ? 1 : 0), 0)), [options, votes]);
  const total = votes.length;
  return <section className="mt-8 border-t border-border/70 pt-6 text-left"><div className="mb-5 grid grid-cols-3 gap-2 text-center"><div><p className="font-mono text-xl tabular-nums">{viewCount}</p><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Views</p></div><div><p className="font-mono text-xl tabular-nums">{viewCount ? `${Math.round((total / viewCount) * 100)}%` : "0%"}</p><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Completion</p></div><div><p className="font-mono text-xl tabular-nums">{total || "—"}</p><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Responses</p></div></div><div className="space-y-3">{options.map((option, index) => { const percent = total ? Math.round((counts[index]! / total) * 100) : 0; return <div key={option.text + index}><div className="mb-1 flex justify-between text-sm"><span>{option.text}</span><span className="font-mono text-muted-foreground">{percent}% · {counts[index]}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${percent}%` }} /></div></div>; })}</div></section>;
}

export function QuestionPageContent({ id }: { id: number }) {
  const { isLoaded, isSignedIn } = useUser();
  const { isLoading, data, refetch } = api.question.getById.useQuery({ id }, { refetchInterval: 3000 });
  const recordView = api.question.recordView.useMutation();
  useEffect(() => { recordView.mutate({ id }); }, [id]);
  if (isLoading) return <main className="mx-auto max-w-xl p-6"><div className="h-8 animate-pulse rounded bg-muted" /></main>;
  if (!data?.question) return <main className="mx-auto max-w-xl p-6">Poll not found</main>;
  const question = data.question;
  const options = question.options as Option[];
  const closed = question.end || (!!question.endsAt && new Date(question.endsAt) <= new Date());
  const canSeeResults = data.isOwner || data.vote !== undefined;
  return <main className="mx-auto min-h-[calc(100dvh-5rem)] w-full max-w-xl px-4 py-10 sm:py-16"><article className="rounded-xl border bg-card p-6 shadow-sm sm:p-8"><div className="mb-6 flex items-center justify-between gap-4"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{question.questionType} poll</span><Link href="/poll" className="text-xs text-muted-foreground hover:text-foreground">All polls →</Link></div><h1 className="text-balance text-3xl font-semibold tracking-tight">{question.question}</h1>{question.endsAt && <p className="mt-3 text-sm text-muted-foreground">{closed ? "Closed" : `Closes ${new Date(question.endsAt).toLocaleString()}`}</p>}{closed ? <p className="mt-8 rounded-md border border-primary/30 bg-primary/10 p-4 text-sm text-primary">This poll is closed.</p> : !isLoaded ? <p className="mt-8 text-sm text-muted-foreground">Loading voting options…</p> : !isSignedIn ? <Link href="/sign-in" className="mt-8 block rounded-md border p-4 text-center text-sm font-semibold hover:border-primary">Sign in to vote</Link> : data.vote ? <p className="mt-8 rounded-md border border-primary/30 bg-primary/10 p-4 text-sm text-primary">Your response is recorded.</p> : <VoteForm questionId={id} type={question.questionType as PollType} options={options} onVoted={() => void refetch()} />}{canSeeResults && <Results options={options} votes={(data.votes ?? []) as VoteData[]} viewCount={question.viewCount} />}{data.isOwner && <div className="mt-6 flex justify-between text-xs"><span className="text-muted-foreground">Owner view</span><CopyUrl id={id} /></div>}</article></main>;
}
