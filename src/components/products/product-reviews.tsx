"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  authorName: string;
  createdAt: Date;
  images: { url: string }[];
}

export function ProductReviews({
  productId,
  reviews,
}: {
  productId: string;
  reviews: Review[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    form.append("productId", productId);

    try {
      const res = await fetch("/api/reviews", { method: "POST", body: form });
      const data = await res.json();
      if (res.ok) {
        setMessage("Recensione inviata! Sarà visibile dopo approvazione.");
        setShowForm(false);
        e.currentTarget.reset();
      } else {
        setMessage(data.error || "Errore nell'invio");
      }
    } catch {
      setMessage("Errore di connessione");
    } finally {
      setSubmitting(false);
    }
  };

  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  return (
    <section className="mt-20 pt-12 border-t border-stone-200">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="font-display text-3xl text-charcoal">Recensioni</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i <= Math.round(avg) ? "fill-terracotta text-terracotta" : "text-stone-300"}`}
                  />
                ))}
              </div>
              <span className="text-stone-600">
                {avg.toFixed(1)} ({reviews.length} recensioni)
              </span>
            </div>
          )}
        </div>
        <Button variant="outline" onClick={() => setShowForm(!showForm)}>
          Scrivi recensione
        </Button>
      </div>

      {message && (
        <p className="mb-4 p-3 bg-sage/10 text-sage-dark rounded-lg text-sm">{message}</p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-10 p-6 bg-stone-50 rounded-xl space-y-4 max-w-xl"
        >
          <div>
            <Label htmlFor="title">Titolo (opzionale)</Label>
            <Input id="title" name="title" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="authorName">Nome</Label>
            <Input id="authorName" name="authorName" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="authorEmail">Email</Label>
            <Input id="authorEmail" name="authorEmail" type="email" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="rating">Valutazione (1-5)</Label>
            <Input
              id="rating"
              name="rating"
              type="number"
              min={1}
              max={5}
              required
              className="mt-1 w-24"
            />
          </div>
          <div>
            <Label htmlFor="comment">Commento</Label>
            <Textarea id="comment" name="comment" required className="mt-1" rows={4} />
          </div>
          <div>
            <Label htmlFor="images">Foto (opzionale)</Label>
            <Input
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
              className="mt-1"
            />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Invio..." : "Invia recensione"}
          </Button>
        </form>
      )}

      <div className="space-y-8">
        {reviews.map((review) => (
          <article key={review.id} className="border-b border-stone-100 pb-8">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i <= review.rating ? "fill-terracotta text-terracotta" : "text-stone-300"}`}
                />
              ))}
            </div>
            {review.title && (
              <h3 className="font-medium text-charcoal">{review.title}</h3>
            )}
            <p className="text-stone-600 mt-2">{review.comment}</p>
            <p className="text-sm text-stone-400 mt-2">
              {review.authorName} ·{" "}
              {new Date(review.createdAt).toLocaleDateString("it-IT")}
            </p>
            {review.images.length > 0 && (
              <div className="flex gap-2 mt-4">
                {review.images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden">
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
        {reviews.length === 0 && !showForm && (
          <p className="text-stone-500">Nessuna recensione ancora. Sii il primo!</p>
        )}
      </div>
    </section>
  );
}
