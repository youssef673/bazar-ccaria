import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function SimpleCatalogoPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Catalogo Semplice</h1>
      <p className="mt-4">Prodotti trovati: {products.length}</p>
      {products.length === 0 ? (
        <p className="mt-4 text-red-500">Nessun prodotto trovato.</p>
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
