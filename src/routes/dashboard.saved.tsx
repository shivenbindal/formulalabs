import { createFileRoute } from "@tanstack/react-router";
import MySheetsPage from "@/app/pages/dashboard/MySheetsPage.jsx";

export const Route = createFileRoute("/dashboard/saved")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My sheets — FormulaX" },
      { name: "description", content: "Every formula sheet you saved, ready for revision." },
      { property: "og:title", content: "My sheets — FormulaX" },
      { property: "og:description", content: "Every formula sheet you saved, ready for revision." },
    ],
  }),
  component: MySheetsPage as never,
});
