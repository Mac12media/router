import { PageWrapper } from "@/components/parts/page-wrapper";
import { Header } from "@/components/parts/header";
import { GraduationCap, FileText } from "lucide-react";

export default function RecruitingToolkitCoursePage() {
  const modules = [
    {
      title: "1. The Recruiting Timeline",
      description:
        "Understand the key stages of the recruiting process from freshman to senior year. Learn when to start outreach and how to prepare in advance.",
    },
    {
      title: "2. Building a Target School List",
      description:
        "Learn how to identify colleges that are the right athletic, academic, and cultural fit. Create a smart, focused list based on realistic goals.",
    },
    {
      title: "3. Crafting a Compelling Athletic Resume",
      description:
        "Write a one-page resume that summarizes your athletic background, stats, academics, and goals in a coach-friendly format.",
    },
    {
      title: "4. Contacting Coaches the Right Way",
      description:
        "Discover how to write clear, concise, and confident emails to college coaches—and what to avoid. Includes subject line tips and follow-up advice.",
    },
    {
      title: "5. How to Prepare for Campus Visits",
      description:
        "Make the most of official and unofficial visits. Learn what to ask, what to observe, and how to leave a positive impression.",
    },
    {
      title: "6. Understanding Scholarships & Financial Aid",
      description:
        "Break down athletic scholarships, academic aid, and walk-on offers. Learn how to ask the right questions and evaluate opportunities.",
    },
  ];

  return (
    <PageWrapper>
      <Header title="College Recruiting Toolkit">
        A practical, self-paced text course to help you navigate the college athletic recruiting process.
      </Header>

      <main className="max-w-3xl mx-auto p-6 space-y-10">
        {/* Course Intro */}
        <section className="bg-muted rounded-xl p-6 border shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-muted-foreground text-sm">
            <GraduationCap className="w-5 h-5" />
            <span>Self-paced text course</span>
          </div>
          <p className="text-lg">
            This toolkit gives student-athletes the written guidance they need to take control of their recruiting journey—from research to contacting coaches.
          </p>
        </section>

        {/* Modules */}
        <section>
          <h2 className="text-xl font-semibold mb-4">📘 Course Modules</h2>
          <ul className="space-y-6">
            {modules.map((module, i) => (
              <li key={i} className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  {module.title}
                </h3>
                <p className="text-gray-700 mt-1">{module.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Call to Action */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Ready to Get Recruited?</h3>
          <p className="mb-4 text-gray-700">
            Use this free text-based course to take actionable steps in your recruiting journey.
            Whether you're just starting or refining your approach, this toolkit will help.
          </p>
          <a
            href="#"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition"
          >
            Start Reading the Course
          </a>
        </section>

        {/* Instructor */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Instructor</h3>
          <div className="flex items-center gap-4">
            <img
              src="/images/instructor.jpg"
              alt="Instructor"
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">Coach Taylor Reynolds</p>
              <p className="text-sm text-muted-foreground">
                Former Division I recruiting coordinator with over 15 years of experience helping
                athletes navigate college athletics.
              </p>
            </div>
          </div>
        </section>
      </main>
    </PageWrapper>
  );
}
