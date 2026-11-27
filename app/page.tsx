import { TrainingHub } from "@/components/hub/TrainingHub";
import { drillSummaries } from "@/lib/scenarios";

export default function HomePage() {
  return <TrainingHub drills={drillSummaries()} />;
}
