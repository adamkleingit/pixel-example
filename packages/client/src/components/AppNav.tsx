"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">Flowboard</span>
        <span className="brand-sub">Ship work through clear columns</span>
      </div>
      <nav className="nav-links">
        <Link className="nav-link" href="/" data-active={pathname === "/"}>
          Board
        </Link>
        <Link
          className="nav-link"
          href="/settings"
          data-active={pathname === "/settings"}
        >
          Settings
        </Link>
      </nav>
    </header>
  );
}
