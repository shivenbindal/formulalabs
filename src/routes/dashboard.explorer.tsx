import { createFileRoute } from "@tanstack/react-router";
import ExplorerPage from "@/app/pages/dashboard/ExplorerPage.jsx";

export const Route = createFileRoute("/dashboard/explorer")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Explorer — FormulaX" },
      { name: "description", content: "Browse chapter-wise formula sheets across Physics, Chemistry, Biology and Maths." },
      { property: "og:title", content: "Explorer — FormulaX" },
      { property: "og:description", content: "Browse chapter-wise formula sheets across Physics, Chemistry, Biology and Maths." },
    ],
  }),
  component: ExplorerPage as never,
});
