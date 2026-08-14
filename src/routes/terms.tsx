import { createFileRoute } from "@tanstack/react-router";
import Terms from "@/app/pages/Terms.jsx";

export const Route = createFileRoute("/terms")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Terms of Service — FormulaX" },
      { name: "description", content: "The terms that govern your use of FormulaX." },
      { property: "og:title", content: "Terms of Service — FormulaX" },
      { property: "og:description", content: "The terms that govern your use of FormulaX." },
    ],
  }),
  component: Terms as never,
});
