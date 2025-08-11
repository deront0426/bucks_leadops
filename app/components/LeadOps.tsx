"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Lead = {
  id: number;
  name: string | null;
  phone: string | null;
  details: string | null;
  created_at: string;
};

// Uses the env vars you set in Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnon);

export default function LeadOps() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", details: "" });
  const [error, setError] = useState<string>("");

  // Initial fetch + realtime subscription
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) setError(error.message);
      setLeads((data as Lead[]) || []);
      setLoading(false);
    })();

    const channel = supabase
      .channel("realtime:leads")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leads" },
        (payload) => {
          setLeads((prev) => [payload.new as Lead, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function addLead(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.phone) {
      setError("Name and phone are required.");
      return;
    }
    const { data, error } = await supabase
      .from("leads")
      .insert({
        name: form.name,
        phone: form.phone,
        details: form.details || null,
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
      return;
    }
    // Realtime will prepend it too; this keeps UI snappy
    if (data) setLeads((prev) => [data as Lead, ...prev]);
    setForm({ name: "", phone: "", details: "" });
  }

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Incoming Leads (Supabase)</h2>

      {/* Quick add form */}
      <form onSubmit={addLead} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
        />
        <input
          className="border rounded px-3 py-2 md:col-span-2"
          placeholder="Details (vehicle, notes, etc.)"
          value={form.details}
          onChange={(e) => setForm((s) => ({ ...s, details: e.target.value }))}
        />
        <button className="bg-blue-600 text-white rounded px-3 py-2" type="submit">
          Add lead
        </button>
      </form>

      {error && <div className="text-sm text-rose-600 mb-3">{error}</div>}

      {loading ? (
        <p>Loading…</p>
      ) : leads.length === 0 ? (
        <p>No leads yet.</p>
      ) : (
        <ul>
          {leads.map((lead) => (
            <li key={lead.id} className="border-b py-3">
              <div className="font-medium">
                {lead.name || "Unknown"} — {lead.phone || "No phone"}
              </div>
              {lead.details && (
                <div className="text-sm text-gray-700">{lead.details}</div>
              )}
              <div className="text-xs text-gray-500">
                {new Date(lead.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
