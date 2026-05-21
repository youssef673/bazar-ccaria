"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BazarLogo } from "@/components/brand/bazar-logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Credenziali non valide");
      return;
    }
    const callback = searchParams.get("callbackUrl") || "/admin";
    router.push(callback);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white rounded-xl border border-stone-200 shadow-sm space-y-6"
      >
        <div className="text-center">
          <BazarLogo variant="horizontal" iconSize={44} href={null} className="mx-auto" />
          <p className="text-sm text-stone-500 mt-3">Pannello amministrazione</p>
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required className="mt-1" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Accesso..." : "Accedi"}
        </Button>
      </form>
    </div>
  );
}
