"use client";

import { useState } from "react";

interface Lead {
  id: number;
  name: string;
  phone: string;
  vehicle: string;
}

export default function LeadOps() {
  const [leads, setLeads] = useState<Lead[]>([
    { id: 1, name: "John Doe", phone: "555-1234", vehicle: "2005 Toyota Camry" },
    { id: 2, name: "Jane Smith", phone: "555-5678", vehicle: "2010 Honda Accord" },
  ]);

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Incoming Leads</h2>
      <ul>
        {leads.map((lead) => (
          <li key={lead.id} className="border-b py-2">
            <strong>{lead.name}</strong> — {lead.phone} — {lead.vehicle}
          </li>
        ))}
      </ul>
    </div>
  );
}
