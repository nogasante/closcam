import { TrainingHub } from "@/components/hub/TrainingHub";
import { drillSummaries } from "@/lib/scenarios";

export default function HubPage() {
  return <TrainingHub drills={drillSummaries()} />;
}
