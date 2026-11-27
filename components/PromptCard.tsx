import type { Step } from "@/lib/types";

type PromptStep = Extract<Step, { type: "prompt" }>;

export function PromptCard({
  step,
  onCancel,
  onApprove,
  note,
}: {
  step: PromptStep;
  onCancel: () => void;
  onApprove: () => void;
  note: string | null;
}) {
  return (
    <section className="sim-surface" aria-label="Simulated wallet prompt">
      <div className="watermark" aria-hidden="true">
        SIMULATION
      </div>
      <div className="relative z-10 px-4 py-5">
        <p className="text-xs font-bold tracking-wide text-muted uppercase">Wallet prompt</p>
        <h2 className="mt-1 text-xl font-bold">{step.title}</h2>
        <p className="mt-3 text-sm text-muted">This is a payment out</p>
        <p className="text-3xl font-bold tracking-tight">Pay {step.amount}</p>
        <p className="mt-1">
          to <span className="font-mono font-semibold">{step.destination}</span>
        </p>
        <p className="mt-3">{step.body}</p>
        <div className="mt-4 grid gap-2">
          <button type="button" className="btn btn-primary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn border border-dashed border-line bg-[#f6f1e8]"
            onClick={onApprove}
          >
            Enter PIN to approve
          </button>
        </div>
        <p className="mt-2 text-sm text-muted">
          These buttons are not live. Cancel is the safe look. Confirm your choice in the list
          below.
        </p>
        {note ? <p className="mt-2 text-sm font-semibold text-miss">{note}</p> : null}
      </div>
    </section>
  );
}
