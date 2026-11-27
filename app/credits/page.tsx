import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { SiteFooter } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Credits",
};

export default function CreditsPage() {
  return (
    <PageShell>
      <h1>Credits</h1>
      <p className="mt-4">
        <a className="underline" href="https://community.spline.design/file/5209eac0-5eb0-4577-9f00-402a1561c0cf">
          iPhone Mockup
        </a>{" "}
        by vexus,{" "}
        <a className="underline" href="https://creativecommons.org/licenses/by/4.0/">
          CC BY 4.0
        </a>
        .
      </p>
      <p className="mt-3">
        <a className="underline" href="https://osebow.com">
          Osebow
        </a>{" "}
        by Cecil Anglow. Community fraud database. CloScam does not read it.
      </p>
      <p className="mt-6 text-sm">
        <Link href="/">Home</Link>
      </p>
      <SiteFooter />
    </PageShell>
  );
}
