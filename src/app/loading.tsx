export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="h-8 w-56 rounded-md bg-stone-100" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="aspect-[4/3] animate-pulse rounded-lg bg-stone-100"
          />
        ))}
      </div>
    </div>
  );
}
