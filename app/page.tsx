import { HomeScreen } from "@/components/HomeScreen";
import { drillSummaries } from "@/lib/scenarios";

export default function HomePage() {
  return <HomeScreen drills={drillSummaries()} />;
}
