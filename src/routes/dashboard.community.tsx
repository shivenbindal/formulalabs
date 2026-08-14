import { createFileRoute } from "@tanstack/react-router";
import CommunityPage from "@/app/pages/dashboard/CommunityPage.jsx";

export const Route = createFileRoute("/dashboard/community")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Community — FormulaX" },
      { name: "description", content: "Post doubts, follow classmates and share files with your study circle." },
      { property: "og:title", content: "Community — FormulaX" },
      { property: "og:description", content: "Post doubts, follow classmates and share files with your study circle." },
    ],
  }),
  component: CommunityPage as never,
});
