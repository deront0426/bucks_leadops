import AuthGate from "./components/AuthGate";
import LeadOps from "./components/LeadOps";

export default function Home() {
  return (
    <AuthGate>
      <main className="min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6">Bucks for Buckets — Lead Ops Dashboard</h1>
        <LeadOps />
      </main>
    </AuthGate>
  );
}
