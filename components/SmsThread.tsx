import type { ChatMessage } from "@/lib/types";

export function SmsThread({
  sender,
  messages,
  visible,
}: {
  sender: string;
  messages: ChatMessage[];
  visible: number;
}) {
  const shown = messages.slice(0, visible);
  return (
    <section className="sim-surface" aria-label={`Simulated text from ${sender}`}>
      <div className="watermark" aria-hidden="true">
        SIMULATION
      </div>
      <div className="relative z-10 border-b border-line bg-[#f7f4ee] px-3 py-3">
        <p className="text-xs font-bold tracking-wide text-muted uppercase">Text message</p>
        <p className="font-semibold">{sender}</p>
      </div>
      <div className="relative z-10 space-y-2 px-3 py-3" aria-live="polite">
        {shown.map((message, index) => (
          <p
            key={`${message.time}-${index}`}
            className="max-w-[92%] rounded-2xl rounded-tl-sm bg-[#e7eef6] px-3 py-2"
          >
            {message.text}
            <span className="mt-1 block text-right text-xs text-muted">{message.time}</span>
          </p>
        ))}
      </div>
    </section>
  );
}

export function SmsPreview({ sender, text }: { sender: string; text: string }) {
  return (
    <section className="sim-surface" aria-label="Simulated text preview">
      <div className="watermark" aria-hidden="true">
        SIMULATION
      </div>
      <div className="relative z-10 px-3 py-3">
        <p className="text-xs font-bold tracking-wide text-muted uppercase">Text preview</p>
        <p className="mt-1 text-sm font-semibold">{sender}</p>
        <p className="mt-2 rounded-2xl bg-[#e7eef6] px-3 py-2">{text}</p>
        <p className="mt-2 text-sm text-muted">
          This code is fictional. CloScam never reads a real text from your phone.
        </p>
      </div>
    </section>
  );
}
