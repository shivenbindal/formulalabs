import { createFileRoute } from "@tanstack/react-router";
import DashboardGuard from "@/app/components/DashboardGuard.jsx";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dashboard — FormulaX" },
      { name: "description", content: "Your formula sheets, tests, streaks and class activity in one place." },
      { property: "og:title", content: "Dashboard — FormulaX" },
      { property: "og:description", content: "Your formula sheets, tests, streaks and class activity in one place." },
    ],
  }),
  component: DashboardGuard as never,
});
