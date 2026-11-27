import { shuffleChoices } from "@/lib/shuffle";
import type { Choice } from "@/lib/types";

export function ChoiceList({
  scenarioId,
  choices,
  onSelect,
}: {
  scenarioId: string;
  choices: Choice[];
  onSelect: (choice: Choice) => void;
}) {
  const ordered = shuffleChoices(scenarioId, choices);
  return (
    <div id="choices" className="mt-4">
      <h2 className="text-base font-bold">What would you do?</h2>
      <div className="mt-2 grid gap-2">
        {ordered.map((choice) => (
          <button
            key={choice.id}
            type="button"
            className="btn btn-choice"
            onClick={() => onSelect(choice)}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}
