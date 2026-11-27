import type { Step } from "@/lib/types";

type PaymentStep = Extract<Step, { type: "payment_page" }>;

export function PaymentPageFrame({
  step,
  onApprove,
  note,
}: {
  step: PaymentStep;
  onApprove?: () => void;
  note?: string | null;
}) {
  return (
    <section className="sim-surface" aria-label="Simulated payment page">
      <div className="watermark" aria-hidden="true">
        SIMULATION
      </div>
      <div className="relative z-10 flex items-center gap-2 border-b border-line bg-[#ece7dc] px-3 py-2">
        <span
          className="rounded bg-banner px-1.5 py-0.5 text-[0.7rem] font-bold text-banner-ink"
          aria-hidden="true"
        >
          !
        </span>
        <p className="truncate font-mono text-xs">{step.url}</p>
      </div>
      <div className="relative z-10 px-4 py-4">
        <p className="text-xs font-bold tracking-wide text-muted uppercase">Not an official wallet</p>
        <h2 className="mt-1 text-xl font-bold">{step.title}</h2>
        <p className="mt-3 text-sm text-muted">Merchant</p>
        <p className="font-semibold">{step.merchant}</p>
        <p className="mt-3 text-sm text-muted">Amount they set</p>
        <p className="text-3xl font-bold tracking-tight">{step.amount}</p>
        <button
          type="button"
          className="btn mt-4 border border-dashed border-miss bg-[#f8f1e6] text-left text-ink"
          onClick={onApprove}
        >
          {step.buttonLabel}
        </button>
        <p className="mt-2 text-sm text-muted" id="pin-note">
          This is not a PIN field. Nothing you tap here sends a payment or stores a PIN.
        </p>
        {note ? <p className="mt-2 text-sm font-semibold text-miss">{note}</p> : null}
        <p className="mt-4 text-xs text-muted">{step.finePrint}</p>
      </div>
    </section>
  );
}
