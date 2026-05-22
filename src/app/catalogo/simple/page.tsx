import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function SimpleCatalogoPage() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let error: string | null = null;

  try {
    products = await getProducts();
  } catch (e) {
    error = String(e);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Catalogo Semplice</h1>
      {error && <p className="mt-4 text-red-500">Errore: {error}</p>}
      <p className="mt-4">Prodotti trovati: {products.length}</p>
      {products.length === 0 && !error ? (
        <p className="mt-4 text-orange-500">Nessun prodotto trovato.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {products.map((p) => (
            <li key={p.id} className="border p-2 rounded">
              {p.name} — €{Number(p.price).toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
