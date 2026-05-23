export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function TestFetchPage() {
  let data: any = null;
  let error: string | null = null;

  try {
    const res = await fetch("http://127.0.0.1:3000/api/debug/db", { cache: "no-store" });
    if (res.ok) {
      data = await res.json();
    } else {
      error = `HTTP ${res.status}`;
    }
  } catch (e) {
    error = String(e);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Test Fetch Interno</h1>
      {error && <p className="mt-4 text-red-500">Errore: {error}</p>}
      {data && (
        <pre className="mt-4 bg-gray-100 p-4 rounded text-sm">{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
