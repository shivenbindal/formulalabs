import { createFileRoute } from "@tanstack/react-router";
import Landing from "@/app/pages/Landing.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FormulaX — AI Formula Sheets & Practice for NEET/JEE" },
      {
        name: "description",
        content:
          "FormulaX turns any question into the exact formulas, approach and practice you need. Built for CBSE, NEET and JEE students.",
      },
      { property: "og:title", content: "FormulaX — AI Formula Sheets & Practice for NEET/JEE" },
      {
        property: "og:description",
        content:
          "Find the right formula instantly, explore chapter-wise sheets, take teacher tests and study with your class.",
      },
    ],
  }),
  component: Landing as never,
});
