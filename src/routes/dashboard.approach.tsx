import { createFileRoute } from "@tanstack/react-router";
import FormulaFinderPage from "@/app/pages/dashboard/FormulaFinderPage.jsx";

export const Route = createFileRoute("/dashboard/approach")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Approach — FormulaX" },
      { name: "description", content: "Paste or snap a question and get the exact formulas plus a step-by-step approach." },
      { property: "og:title", content: "Approach — FormulaX" },
      { property: "og:description", content: "Paste or snap a question and get the exact formulas plus a step-by-step approach." },
    ],
  }),
  component: FormulaFinderPage as never,
});
