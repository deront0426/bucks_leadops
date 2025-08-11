"use client";
import AuthGate from "../components/AuthGate";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Driver = {
  id: string;
  name: string;
  phone: string;
  region: string | null;
  active: boolean | null;
  created_at: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", region: "" });
  const [editing, setEditing] = useState<Driver | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from("drivers").select("*").order("created_at", { ascending: false });
      if (!error && data) setDrivers(data as Driver[]);
      setLoading(false);
    })();
  }, []);

  function resetForm() {
    setForm({ name: "", phone: "", region: "" });
    setEditing(null);
    setError("");
  }

  async function saveDriver(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const payload = { name: form.name.trim(), phone: form.phone.trim(), region: form.region.trim() || null, active: true };
    if (!payload.name || !payload.phone) { setError("Name and phone are required."); return; }

    if (editing) {
      const { error } = await supabase.from("drivers").update(payload).eq("id", editing.id);
      if (error) return setError(error.message);
      setDrivers(prev => prev.map(d => d.id === editing.id ? { ...d, ...payload } as Driver : d));
    } else {
      const { data, error } = await supabase.from("drivers").insert(payload).select().single();
      if (error) return setError(error.message);
      if (data) setDrivers(prev => [data as Driver, ...prev]);
    }
    resetForm();
  }

  async function toggleActive(d: Driver) {
    const { error } = await supabase.from("drivers").update({ active: !d.active }).eq("id", d.id);
    if (error) return alert(error.message);
    setDrivers(prev => prev.map(x => x.id === d.id ? { ...x, active: !d.active } : x));
  }

  async function removeDriver(d: Driver) {
    if (!confirm(`Delete ${d.name}?`)) return;
    const { error } = await supabase.from("drivers").delete().eq("id", d.id);
    if (error) return alert(error.message);
    setDrivers(prev => prev.filter(x => x.id !== d.id));
  }

  function startEdit(d: Driver) {
    setEditing(d);
    setForm({ name: d.name, phone: d.phone, region: d.region || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AuthGate>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Drivers</h1>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card border border-slate-100">
          <h2 className="font-semibold mb-3">{editing ? "Edit Driver" : "Add Driver"}</h2>
          <form onSubmit={saveDriver} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input className="border border-slate-200 rounded-2xl px-3 py-2" placeholder="Name"
                   value={form.name} onChange={(e)=>setForm(s=>({...s, name: e.target.value}))}/>
            <input className="border border-slate-200 rounded-2xl px-3 py-2" placeholder="Phone"
                   value={form.phone} onChange={(e)=>setForm(s=>({...s, phone: e.target.value}))}/>
            <input className="border border-slate-200 rounded-2xl px-3 py-2" placeholder="Region (optional)"
                   value={form.region} onChange={(e)=>setForm(s=>({...s, region: e.target.value}))}/>
            <div className="flex gap-2">
              <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-3 py-2 rounded-2xl shadow-card">
                {editing ? "Save" : "Add"}
              </button>
              {editing && (
                <button type="button" onClick={resetForm}
                        className="bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded-2xl shadow-card hover:bg-slate-50">
                  Cancel
                </button>
              )}
            </div>
          </form>
          {error && <div className="text-rose-600 text-sm mt-2">{error}</div>}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card border border-slate-100">
          {loading ? (
            <div>Loading…</div>
          ) : drivers.length === 0 ? (
            <div>No drivers yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b">
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Phone</th>
                    <th className="py-2 pr-3">Region</th>
                    <th className="py-2 pr-3">Active</th>
                    <th className="py-2 pr-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((d) => (
                    <tr key={d.id} className="border-b last:border-0">
                      <td className="py-2 pr-3 font-medium">{d.name}</td>
                      <td className="py-2 pr-3">{d.phone}</td>
                      <td className="py-2 pr-3">{d.region || "-"}</td>
                      <td className="py-2 pr-3">
                        <span className={`px-2 py-1 rounded-xl text-xs ${d.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                          {d.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-2 pr-3">
                        <div className="flex gap-2">
                          <button onClick={()=>startEdit(d)}
                                  className="bg-white border border-slate-200 text-slate-800 px-3 py-1.5 rounded-2xl shadow-card hover:bg-slate-50">
                            Edit
                          </button>
                          <button onClick={()=>toggleActive(d)}
                                  className="bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-2xl shadow-card">
                            {d.active ? "Deactivate" : "Activate"}
                          </button>
                          <button onClick={()=>removeDriver(d)}
                                  className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-2xl shadow-card">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AuthGate>
  );
}
