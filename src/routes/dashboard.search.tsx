import { createFileRoute } from "@tanstack/react-router";
import SearchPage from "@/app/pages/dashboard/SearchPage.jsx";

export const Route = createFileRoute("/dashboard/search")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Search — FormulaX" },
      { name: "description", content: "Search chapters and formula sheets across every class and subject." },
      { property: "og:title", content: "Search — FormulaX" },
      { property: "og:description", content: "Search chapters and formula sheets across every class and subject." },
    ],
  }),
  component: SearchPage as never,
});
