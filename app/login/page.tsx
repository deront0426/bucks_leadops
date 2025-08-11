"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function LoginPage() {
  const [mode, setMode] = useState<"signin"|"signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr("");
    const fn = mode === "signin" ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { error } = await fn({ email, password });
    setLoading(false);
    if (error) return setErr(error.message);
    window.location.href = "/"; // go to dashboard
  }

  return (
    <main className="min-h-screen grid place-items-center bg-gradient-to-b from-indigo-50 via-sky-50 to-white">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-card border border-slate-100">
        <h1 className="text-2xl font-bold mb-1">Bucks for Buckets</h1>
        <p className="text-slate-600 mb-4">{mode === "signin" ? "Sign in" : "Create your account"}</p>
        <form onSubmit={submit} className="grid gap-3">
          <input className="border border-slate-200 rounded-2xl px-3 py-2"
                 placeholder="Email" type="email"
                 value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="border border-slate-200 rounded-2xl px-3 py-2"
                 placeholder="Password" type="password"
                 value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button className="bg-brand-600 hover:bg-brand-700 text-white rounded-2xl px-3 py-2 shadow-card" disabled={loading}>
            {loading ? "Please wait…" : (mode==="signin" ? "Sign in" : "Sign up")}
          </button>
          {err && <div className="text-rose-600 text-sm">{err}</div>}
        </form>
        <div className="text-sm text-slate-600 mt-4">
          {mode==="signin" ? (
            <>No account? <button className="text-brand-700 underline" onClick={()=>setMode("signup")}>Sign up</button></>
          ) : (
            <>Have an account? <button className="text-brand-700 underline" onClick={()=>setMode("signin")}>Sign in</button></>
          )}
        </div>
        <div className="text-xs mt-4">
          <Link className="text-slate-500 hover:text-slate-700" href="/">← Back to dashboard</Link>
        </div>
      </div>
    </main>
  );
}
