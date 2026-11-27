import Link from "next/link";
import { Mark } from "./Mark";

export function SiteHeader({ action }: { action?: React.ReactNode }) {
  return (
    <header className="border-b border-line bg-card">
      <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-3 px-3 py-2 lg:px-8">
        <Link href="/" className="flex min-h-11 items-center gap-2">
          <Mark />
          <span>
            <span className="block text-[15px] leading-none font-medium tracking-tight">CloScam</span>
            <span className="mt-1 hidden text-[12px] text-muted sm:block">Training simulation</span>
          </span>
        </Link>
        {action}
      </div>
    </header>
  );
}
