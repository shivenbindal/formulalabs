import { createFileRoute } from "@tanstack/react-router";
import HistoryPage from "@/app/pages/dashboard/HistoryPage.jsx";

export const Route = createFileRoute("/dashboard/history")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "History — FormulaX" },
      { name: "description", content: "Revisit the questions you solved and the formulas they needed." },
      { property: "og:title", content: "History — FormulaX" },
      { property: "og:description", content: "Revisit the questions you solved and the formulas they needed." },
    ],
  }),
  component: HistoryPage as never,
});
