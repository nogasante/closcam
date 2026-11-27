import Link from "next/link";

export function SiteHeader({ action }: { action?: React.ReactNode }) {
  return (
    <header className="nav-frost">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="display text-[17px] font-extrabold tracking-tight">
          CloScam
        </Link>
        {action}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-12 text-sm text-white/45 lg:px-8">
      <p>CloScam</p>
      <p>292 · 18555</p>
    </footer>
  );
}
