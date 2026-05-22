"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/account/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Errore');
      setMessage('Account creato. Puoi ora usare il carrello e ricevere aggiornamenti via email.');
      setName(''); setEmail(''); setPassword('');
    } catch (e: any) {
      setMessage(e.message || 'Errore');
    } finally { setLoading(false); setTimeout(() => setMessage(null), 5000); }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <Label htmlFor="reg-name">Nome</Label>
        <Input id="reg-name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="reg-email">Email</Label>
        <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="reg-pass">Password</Label>
        <Input id="reg-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={loading}>{loading ? 'Creazione...' : 'Crea account'}</Button>
        {message && <span className="text-sm text-stone-600">{message}</span>}
      </div>
    </form>
  );
}
