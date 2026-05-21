"use client";

import { signIn, signOut } from "next-auth/react";
import { LogIn, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AccountActions({ isSignedIn }: { isSignedIn: boolean }) {
  if (isSignedIn) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => signOut({ callbackUrl: "/account" })}
      >
        <LogOut className="h-4 w-4" />
        Esci
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={() => signIn(undefined, { callbackUrl: "/account" })}
    >
      <LogIn className="h-4 w-4" />
      Accesso admin
    </Button>
  );
}

export function AdminAccessButton() {
  return (
    <Button asChild variant="outline">
      <a href="/admin/login">
        <ShieldCheck className="h-4 w-4" />
        Accesso admin
      </a>
    </Button>
  );
}
