import { createFileRoute } from "@tanstack/react-router";
import Login from "@/app/pages/Login.jsx";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — FormulaX" },
      { name: "description", content: "Sign in to FormulaX to access your formula sheets, tests and class groups." },
      { property: "og:title", content: "Sign in — FormulaX" },
      { property: "og:description", content: "Access your formula sheets, tests and class groups." },
    ],
  }),
  component: Login as never,
});
