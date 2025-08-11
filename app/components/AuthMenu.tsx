"use client";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function AuthMenu() {
  return (
    <button
      onClick={async () => { await supabase.auth.signOut(); window.location.href = "/login"; }}
      className="text-sm px-3 py-1.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 shadow-card"
    >
      Sign out
    </button>
  );
}
