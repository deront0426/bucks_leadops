"use client";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export default function Button({ variant="primary", className="", ...rest }: Props) {
  const base = "px-3 py-2 rounded-2xl text-sm font-semibold transition shadow";
  const styles = {
    primary: "bg-brand-600 hover:bg-brand-700 text-white shadow-card",
    secondary: "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-card",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700"
  }[variant];
  return <button className={`${base} ${styles} ${className}`} {...rest} />;
}
