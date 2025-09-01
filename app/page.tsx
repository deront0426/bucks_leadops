import { useState, useRef } from 'react';
import LeadOps from "./components/LeadOps";

export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Bucks4Buckets</h1>
      <p>Click below to see the typical junk-car range.</p>

      <LeadOps />
    </main>
  );
}
