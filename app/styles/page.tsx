import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Style studies",
  robots: { index: false, follow: false },
};

export default function StylesPage() {
  return (
    <main className="bg-[#070b12] text-white">
      <p className="px-6 py-8 text-sm text-white/50">
        Internal comparison. Not linked from the product.
      </p>
      <Variant id="glass" title="A. Glass" note="Frosted layers, deep field, one action.">
        <div className="style-glass">
          <Study />
        </div>
      </Variant>
      <Variant id="soft" title="B. Soft hardware" note="Raised surfaces, inset shadows, a physical phone.">
        <div className="style-soft">
          <Study />
        </div>
      </Variant>
      <Variant id="flat" title="C. Flat" note="Solid colour, type, and space. No blur, no bevel.">
        <div className="style-flat">
          <Study />
        </div>
      </Variant>
    </main>
  );
}

function Variant({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-white/10 px-4 py-16 lg:px-10">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      <p className="mt-2 max-w-xl text-white/60">{note}</p>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Study() {
  return (
    <div className="study grid items-center gap-16 lg:grid-cols-2">
      <div>
        <p className="study-kicker">Ghana mobile money</p>
        <h2 className="study-title">Shut scammers out before they get in.</h2>
        <p className="study-copy">
          Practise the chat, then decide. Nothing real is sent.
        </p>
        <button type="button" className="study-cta">
          Start training
        </button>
      </div>
      <div className="study-phone">
        <div className="study-bar">
          <span>Ama</span>
          <span>online</span>
        </div>
        <p className="study-chip">Today</p>
        <p className="study-bubble">Please help me vote. Send me the code.</p>
        <p className="study-bubble study-bubble-me">I will not send it.</p>
      </div>
    </div>
  );
}
