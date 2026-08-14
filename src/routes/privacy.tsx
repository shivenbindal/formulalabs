import { createFileRoute } from "@tanstack/react-router";
import Privacy from "@/app/pages/Privacy.jsx";

export const Route = createFileRoute("/privacy")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Privacy Policy — FormulaX" },
      { name: "description", content: "How FormulaX collects, stores and protects your data." },
      { property: "og:title", content: "Privacy Policy — FormulaX" },
      { property: "og:description", content: "How FormulaX collects, stores and protects your data." },
    ],
  }),
  component: Privacy as never,
});
