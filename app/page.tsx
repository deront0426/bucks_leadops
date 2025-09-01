"use client";
import { useState } from "react";
import LeadOps from "./components/LeadOps";

export default function Page() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Your original logic here
    alert(`Estimate for ${year} ${make} ${model}`);
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bucks4Buckets</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
        <input
          type="text"
          placeholder="Make"
          required
          className="p-3 rounded-lg border border-gray-300"
          value={make}
          onChange={(e) => setMake(e.target.value)}
        />
        <input
          type="text"
          placeholder="Model"
          required
          className="p-3 rounded-lg border border-gray-300"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          required
          className="p-3 rounded-lg border border-gray-300"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <button
          type="submit"
          className="bg-orange-500 text-white p-3 rounded-lg font-bold hover:scale-105 transition-transform"
        >
          Get Estimate
        </button>
      </form>

      <LeadOps />
    </main>
  );
}
