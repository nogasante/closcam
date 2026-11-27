import { SiteHeader } from "./SiteHeader";

export function PageShell({
  children,
  action,
  banner = false,
  wide = false,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
  banner?: boolean;
  wide?: boolean;
}) {
  return (
    <>
      <div className={banner ? "sticky top-0 z-30" : undefined}>
        <SiteHeader action={action} />
        {banner ? <SimulationBanner /> : null}
      </div>
      <main
        id="content"
        className={`mx-auto w-full flex-1 px-3 py-4 lg:px-8 lg:py-8 ${wide ? "max-w-[1120px]" : "max-w-lg"}`}
      >
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
