import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted">That page is not part of this training app.</p>
      <Link href="/" className="btn btn-primary mt-4">
        Home
      </Link>
    </PageShell>
  );
}
