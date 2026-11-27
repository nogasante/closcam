import Link from "next/link";

export function SiteHeader({ action }: { action?: React.ReactNode }) {
  return (
    <header className="nav-frost">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="display text-[17px] font-extrabold tracking-tight">
          CloScam
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/tools" className="inline-flex min-h-11 items-center text-sm font-semibold">
            Tools
          </Link>
          {action}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 py-12 text-sm text-[#d5dbe4] lg:px-8">
      <Link href="/credits">Credits</Link>
    </footer>
  );
}
