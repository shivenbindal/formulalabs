import { createFileRoute } from "@tanstack/react-router";
import Admin from "@/app/pages/Admin.jsx";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — FormulaX" },
      { name: "description", content: "Internal FormulaX administration console." },
      { property: "og:title", content: "Admin — FormulaX" },
      { property: "og:description", content: "Internal FormulaX administration console." },
    ],
  }),
  component: Admin as never,
});
