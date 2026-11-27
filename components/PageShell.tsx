import { SiteHeader } from "./SiteHeader";

export function PageShell({
  children,
  action,
  banner = false,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
  banner?: boolean;
}) {
  return (
    <>
      <div className={banner ? "sticky top-0 z-30" : undefined}>
        <SiteHeader action={action} />
        {banner ? <SimulationBanner /> : null}
      </div>
      <main id="content" className="mx-auto w-full max-w-lg flex-1 px-4 py-5">
        {children}
      </main>
    </>
  );
}

export function SimulationBanner() {
  return (
    <p className="sim-banner" role="note">
      SIMULATION / TRAINING / NOT AFFILIATED
    </p>
  );
}
