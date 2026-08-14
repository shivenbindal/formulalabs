import { createFileRoute } from "@tanstack/react-router";
import Onboarding from "@/app/pages/Onboarding.jsx";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set up your profile — FormulaX" },
      { name: "description", content: "Pick your class, username and subjects to personalise FormulaX." },
      { property: "og:title", content: "Set up your profile — FormulaX" },
      { property: "og:description", content: "Pick your class, username and subjects to personalise FormulaX." },
    ],
  }),
  component: Onboarding as never,
});
