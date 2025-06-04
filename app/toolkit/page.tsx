import { PageWrapper } from "@/components/parts/page-wrapper";
import { Header } from "@/components/parts/header";
import { GraduationCap, ExternalLink } from "lucide-react";

export default function RecruitingToolkitCoursePage() {
  const modules = [
    {
      title: "1. The Recruiting Timeline",
      description: "Understand the key stages of the recruiting process from freshman to senior year.",
      videoUrl: "#",
      thumbnail:
        "https://www.usatodayhss.com/gcdn/authoring/authoring-images/2025/01/02/SHSS/77410072007-usatsi-24910098-1.jpg?width=660&height=441&fit=crop&format=pjpg&auto=webp",
    },
    {
      title: "2. Building a Target School List",
      description: "Identify schools that match your athletic, academic, and social goals.",
      videoUrl: "#",
      thumbnail:
        "https://cloudfront-us-east-1.images.arcpublishing.com/advancelocal/YV6TFXG5VNFWHGQIOUD2B5B3EQ.JPG",
    },
    {
      title: "3. Contacting Coaches the Right Way",
      description: "Write effective emails and follow-ups to capture a coach’s attention.",
      videoUrl: "#",
      thumbnail:
        "https://alleyesdbcamp.com/wp-content/uploads/2021/09/watchingfilm-1200x675.jpeg",
    },
    {
      title: "4. Preparing for Campus Visits",
      description: "Know what to ask, observe, and how to leave a lasting impression.",
      videoUrl: "#",
      thumbnail:
        "https://www.usatoday.com/gcdn/presto/2022/04/23/PLAL/b01dffbe-8de0-458b-b9c3-39d3674cf76c-LSUSpring003.jpg?crop=3999,2250,x0,y0&width=3200&height=1801&format=pjpg&auto=webp",
    },
  ];

  const externalResources = [
    {
      name: "FAFSA – Free Application for Federal Student Aid",
      url: "https://studentaid.gov/h/apply-for-aid/fafsa",
    },
    {
      name: "NCAA Eligibility Center",
      url: "https://web3.ncaa.org/ecwr3/",
    },
    {
      name: "NAIA Eligibility Center",
      url: "https://play.mynaia.org/",
    },
    {
      name: "College Board – Scholarship Search",
      url: "https://bigfuture.collegeboard.org/scholarship-search",
    },
  ];

  return (
    <PageWrapper>
      <Header title="College Recruiting Toolkit">
      </Header>

      <main className="max-w-6xl mx-auto p-6 space-y-16">
        {/* Intro Section */}
        <section className="bg-muted rounded-xl p-6 border shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-muted-foreground text-sm">
            <GraduationCap className="w-5 h-5" />
            <span>Self-paced video course</span>
          </div>
          <p className="text-lg">
            Get the guidance you need to take control of your recruiting journey—from research and outreach to scholarships and visits.
          </p>
        </section>

        {/* Video Slider */}
        <section>
  <h2 className="text-2xl font-semibold mb-4">🎥 Course Module Videos</h2>
  <div className="overflow-x-auto no-scrollbar">
    <div className="flex gap-6 snap-x snap-mandatory pb-4 px-1">
      {modules.map((module, i) => (
        <a
  key={i}
  href={module.videoUrl}
  className="w-full sm:min-w-[60%] sm:max-w-[65%] snap-start shrink-0 rounded-xl overflow-hidden border shadow-lg transition hover:shadow-xl"
>

          <img
            src={module.thumbnail}
            alt={module.title}
            className="w-full h-[280px] md:h-[360px] object-cover"
          />
          <div className="p-4 bg-white dark:bg-muted">
            <h3 className="text-xl font-semibold">{module.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
          </div>
        </a>
      ))}
    </div>
  </div>
</section>


        {/* Resources + Divisions */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">📘 Helpful Recruiting Resources</h2>
            <ul className="space-y-4">
              {externalResources.map((res, i) => (
                <li key={i}>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#FF7200] hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {res.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">🏅 Understanding Athletic Divisions</h2>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li><strong>D1:</strong> Top-tier, competitive, full scholarships possible.</li>
              <li><strong>D2:</strong> Good balance of athletics and academics.</li>
              <li><strong>D3:</strong> No athletic scholarships, but strong academics.</li>
              <li><strong>NAIA:</strong> Smaller schools, more flexibility, aid available.</li>
              <li><strong>JUCO:</strong> 2-year path to D1 or D2 schools.</li>
            </ul>
          </div>
        </section>

        {/* Checklist */}
        <section className="bg-secondary rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">📋 Recruiting Checklist</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Create an athletic resume with your stats</li>
              <li>Build a realistic list of target schools</li>
              <li>Start outreach to coaches</li>
              <li>Register for the NCAA/NAIA Eligibility Center</li>
            </ul>
            <ul className="list-disc list-inside space-y-1">
              <li>Schedule official/unofficial visits</li>
              <li>Track communications and interest</li>
              <li>Apply for FAFSA and compare aid packages</li>
              <li>Make an informed commitment</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-muted rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Ready to Get Recruited?</h3>
          <a
            href="#"
            className="inline-block bg-[#FF7200] text-white px-6 py-2 rounded font-medium hover:bg-[#FF7200] transition"
          >
            Start the Course
          </a>
        </section>

        {/* Instructor */}
        <section className="bg-secondary rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Instructor</h3>
          <div className="flex items-center gap-4">
            <img
              src="https://static.wixstatic.com/media/e49d37_c9bd0a5f706f42a69b297163faca7bd1~mv2_d_2000_2000_s_2.png"
              alt="Coach Al"
              className="h-16 w-16 rounded-full object-cover dark:invert"
            />
            <div>
              <p className="font-medium">Coach Al</p>
              <p className="text-sm text-muted-foreground">
                Former Division I recruiting coordinator with over 15 years helping athletes get recruited.
              </p>
            </div>
          </div>
        </section>
      </main>
    </PageWrapper>
  );
}
