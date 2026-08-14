import { createFileRoute } from "@tanstack/react-router";
import Pricing from "@/app/pages/Pricing.jsx";

export const Route = createFileRoute("/pricing")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Pricing — FormulaX" },
      { name: "description", content: "Simple plans for students and teachers. Start free, upgrade when you need more." },
      { property: "og:title", content: "Pricing — FormulaX" },
      { property: "og:description", content: "Simple plans for students and teachers. Start free, upgrade when you need more." },
    ],
  }),
  component: Pricing as never,
});
