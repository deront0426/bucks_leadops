  
        if (isMounted) setError(err.message ?? "Failed to load leads.");
      } finally {
        if (isMounted) setLoading(false);
      }
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
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // ---- add lead ----
  async function addLead(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.phone) {
      setError("Please provide both name and phone.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from("leads")
        .insert([{ name: form.name, phone: form.phone }]);

      if (error) throw error;
      setForm({ name: "", phone: "" }); // realtime will prepend the new row
    } catch (err: any) {
      setError(err.message ?? "Failed to add lead.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Bucks4Buckets — Lead Ops</h2>

      <form onSubmit={addLead} style={{ marginBottom: 16 }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          style={{ marginRight: 8 }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Lead"}
        </button>
      </form>

      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

      {loading && leads.length === 0 ? (
        <p>Loading leads…</p>
      ) : (
        <ul>
          {leads.map((lead) => (
            <li key={lead.id}>
              <strong>{lead.name || "No name"}</strong> — {lead.phone || "No phone"}{" "}
              <small>({new Date(lead.created_at).toLocaleString()})</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
