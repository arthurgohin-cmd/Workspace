"use client";

import { logout } from "./actions";

export function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="text-sm text-paper/60 transition hover:text-terracotta-light"
    >
      Se déconnecter
    </button>
  );
}
