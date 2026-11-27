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
    <footer className="mx-auto w-full max-w-6xl px-4 py-12 text-sm text-[#d5dbe4] lg:px-8">
      <div className="flex items-center justify-between">
        <p>CloScam</p>
        <p>292 · 18555</p>
      </div>
      <p className="mt-3 max-w-xl text-xs leading-relaxed">
        <a className="underline" href="https://community.spline.design/file/5209eac0-5eb0-4577-9f00-402a1561c0cf">
          iPhone Mockup
        </a>{" "}
        by vexus, Spline Community,{" "}
        <a className="underline" href="https://creativecommons.org/licenses/by/4.0/">
          CC BY 4.0
        </a>
        .
      </p>
    </footer>
  );
}
