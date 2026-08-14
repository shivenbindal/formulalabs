import { createFileRoute } from "@tanstack/react-router";
import TakeTestPage from "@/app/pages/dashboard/TakeTestPage.jsx";

export const Route = createFileRoute("/dashboard/test/$classroomId/$testId")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Take test — FormulaX" },
      { name: "description", content: "Attempt the test assigned by your teacher." },
      { property: "og:title", content: "Take test — FormulaX" },
      { property: "og:description", content: "Attempt the test assigned by your teacher." },
    ],
  }),
  component: TakeTestPage as never,
});
