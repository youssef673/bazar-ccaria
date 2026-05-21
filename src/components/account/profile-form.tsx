"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileForm({
  name,
  email,
}: {
  name?: string | null;
  email?: string | null;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">(
    "idle"
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.get("name") }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus("error");
      setMessage(data.error || "Non è stato possibile salvare il profilo.");
      return;
    }

    setStatus("ok");
    setMessage("Profilo aggiornato.");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-stone-200 bg-white p-6"
    >
      <h2 className="font-display text-2xl text-charcoal">Profilo</h2>
      <p className="mt-1 text-sm text-stone-600">
        Aggiorna i dati base associati al tuo account.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="profile-name">Nome</Label>
          <Input
            id="profile-name"
            name="name"
            defaultValue={name || ""}
            minLength={2}
            maxLength={80}
            placeholder="Nome e cognome"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="profile-email">Email</Label>
          <Input
            id="profile-email"
            value={email || ""}
            readOnly
            className="mt-1 bg-stone-50"
          />
        </div>
      </div>

      {message && (
        <p
          className={`mt-4 rounded-md p-3 text-sm ${
            status === "ok"
              ? "bg-sage/10 text-sage-dark"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </p>
      )}

      <Button type="submit" className="mt-5" disabled={status === "saving"}>
        <Save className="h-4 w-4" />
        {status === "saving" ? "Salvataggio..." : "Salva profilo"}
      </Button>
    </form>
  );
}
