import Link from "next/link";
import { Mark } from "./Mark";

export function SiteHeader({ action }: { action?: React.ReactNode }) {
  return (
    <header className="border-b border-line bg-card">
      <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-3 px-4 py-2.5">
        <Link href="/" className="flex min-h-11 items-center gap-2">
          <Mark />
          <span>
            <span className="block text-base leading-none font-bold">CloScam</span>
            <span className="mt-1 block text-xs text-muted">Training simulation</span>
          </span>
        </Link>
        {action}
      </div>
    </header>
  );
}
