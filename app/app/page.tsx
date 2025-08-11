import LeadOps from "./components/LeadOps";

export default function Home() {
  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Bucks for Buckets — Lead Ops Dashboard</h1>
      <LeadOps />
    </main>
  );
}
