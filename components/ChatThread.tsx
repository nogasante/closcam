import type { ChatMessage } from "@/lib/types";

function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export function ChatThread({
  contact,
  messages,
  visible,
}: {
  contact: string;
  messages: ChatMessage[];
  visible: number;
}) {
  const shown = messages.slice(0, visible);
  return (
    <section className="sim-surface" aria-label={`Simulated chat with ${contact}`}>
      <div className="watermark" aria-hidden="true">
        SIMULATION
      </div>
      <div className="relative z-10 bg-[#243044] px-3 py-3 text-[#f4f7fb]">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d7e0ea] text-base font-bold text-[#243044]"
            aria-hidden="true"
          >
            {initial(contact)}
          </span>
          <span>
            <span className="block font-semibold">{contact}</span>
            <span className="block text-xs text-[#d5deea]">Chat simulation</span>
          </span>
        </div>
      </div>
      <div className="relative z-10 space-y-2 bg-[#e7eee9] px-3 py-3" aria-live="polite">
        {shown.map((message, index) => (
          <p
            key={`${message.time}-${index}`}
            className="max-w-[92%] rounded-2xl rounded-tl-sm bg-card px-3 py-2 text-[1.02rem] shadow-sm"
          >
            <span className="mb-0.5 block text-xs font-bold text-green">{message.sender}</span>
            {message.text}
            <span className="mt-1 block text-right text-xs text-muted">{message.time}</span>
          </p>
        ))}
      </div>
    </section>
  );
}
