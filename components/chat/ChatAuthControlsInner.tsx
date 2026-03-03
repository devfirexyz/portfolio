"use client";

import { SignInButton, SignOutButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export function ChatAuthControlsInner() {
  const { user } = useUser();

  return (
    <>
      <SignedOut>
        <SignInButton mode="modal" forceRedirectUrl="/chat" fallbackRedirectUrl="/chat">
          <button
            type="button"
            className="inline-flex h-10 items-center border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] px-3 text-xs font-black uppercase tracking-[0.12em] text-white shadow-[4px_4px_0px_0px_var(--nb-shadow-accent)]"
          >
            Log In
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-2">
          <div className="inline-flex h-10 items-center gap-2 border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-2 text-[11px] font-black uppercase tracking-[0.1em] text-[var(--nb-foreground)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName ?? "Account avatar"}
                className="h-6 w-6 border-2 border-[var(--nb-border)] object-cover"
              />
            ) : (
              <span className="inline-flex h-6 w-6 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] text-[10px]">
                A
              </span>
            )}
            <span>Account</span>
          </div>
          <SignOutButton redirectUrl="/chat">
            <button
              type="button"
              className="inline-flex h-10 items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-3 text-xs font-black uppercase tracking-[0.12em] text-[var(--nb-foreground)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              Log Out
            </button>
          </SignOutButton>
        </div>
      </SignedIn>
    </>
  );
}
