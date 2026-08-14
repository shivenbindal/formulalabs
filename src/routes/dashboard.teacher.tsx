import { createFileRoute } from "@tanstack/react-router";
import TeacherPage from "@/app/pages/dashboard/TeacherPage.jsx";

export const Route = createFileRoute("/dashboard/teacher")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Teacher — FormulaX" },
      { name: "description", content: "Create class groups, post announcements and publish tests." },
      { property: "og:title", content: "Teacher — FormulaX" },
      { property: "og:description", content: "Create class groups, post announcements and publish tests." },
    ],
  }),
  component: TeacherPage as never,
});
