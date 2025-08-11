"use client";
import React from "react";

export function Tabs({ value, onChange, items }:{
  value: string;
  onChange: (v:string)=>void;
  items: { value:string; label:string }[];
}) {
  return (
    <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-card">
      {items.map(it => (
        <button
          key={it.value}
          onClick={()=>onChange(it.value)}
          className={`px-3 py-1.5 rounded-xl text-sm ${
            value===it.value
              ? "bg-brand-600 text-white"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
