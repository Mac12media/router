import Link from "next/link";
import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { Header } from "@/components/parts/header";
import { Chart } from "@/components/dashboard/chart";
import { PageWrapper } from "@/components/parts/page-wrapper";
import { getLeadAndErrorCounts } from "@/lib/data/dashboard";
import { notFound } from "next/navigation";
import { getLeads } from "@/lib/data/leads";
import { getEndpoints } from "@/lib/data/endpoints";
import { DataTable } from "@/components/groups/leads/data-table";
import { columns } from "@/components/groups/leads/columns";
import { getUsageForUser, getUserFull } from "@/lib/data/users";
import { Usage } from "@/components/parts/usage";
import { PlayerProfile } from "@/components/parts/playerprofile";
import { RecruitingTasks } from "@/components/parts/tasks";
import placeholder from "@/public/userplaceholder.png";
import { RecruitingCalendar } from "@/components/parts/calender";
import { CoachNotes } from "@/components/parts/coachnotes";



const pageData = {
  name: "Dashboard",
  title: "Dashboard",
};

export default async function Page() {
  // fetch chart data
  const charts = await getLeadAndErrorCounts();
  const { data: chartData, serverError: chartServerError } = charts || {};

  // fetch leads
  const leads = await getLeads();
  const { data: leadsData, serverError: leadsServerError } = leads || {};

  // fetch endpoints
  const endpoints = await getEndpoints();
  const { data: endpointsData, serverError: endpointsServerError } =
    endpoints || {};

  // fetch number of leads for user this month
  const result = await getUserFull();
  const user = result?.data;

  const usage = await getUsageForUser();
  const { data: usageData, serverError: usageServerError } = usage || {};

  // check for errors
  if (
    !leadsData ||
    !endpointsData ||
    !chartData ||
    usageData === null ||
    usageData === undefined ||
    leadsServerError ||
    endpointsServerError ||
    chartServerError ||
    usageServerError
  ) {
    notFound();
  }

  // get the 5 most recent leads
  const recentLeads = leadsData.slice(0, 5);

  // get the lead limit for the user's plan
  let leadLimit: number;
  switch (usageData?.plan) {
    case "free":
      leadLimit = 100;
      break;
    case "rookie":
      leadLimit = 1000;
      break;
    case "mvp":
      leadLimit = 10000;
      break;
    case "elite":
      leadLimit = 50000;
      break;
    default:
      leadLimit = 100; // Fallback to free tier limit
  }


  return (
    <>
      <Breadcrumbs pageName={pageData?.name} />
      <PageWrapper>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-y-4 sm:gap-x-4">
          {/* Player Profile */}
          <PlayerProfile
            id={user?.id ?? ""}
            name={user?.name ?? ""}
            gradClass={user?.grad_year ?? ""}
            position={user?.position ?? ""}
            height={user?.height ?? ""}
            weight={user?.weight ?? ""}
            ACD_score={user?.ACD_score ?? ""}
                        ATH_score={user?.ATH_score ?? ""}

            imageUrl={user?.image && !user.image.includes('blob') ? user.image.trim() : placeholder.src}
          />

          <Link href="/campaigns" className="sm:col-span-1 lg:col-span-2 transition-shadow">
            <Chart
              chartData={chartData}
              className={`${
                usageData.plan === "elite" ? "col-span-3" : "col-span-2"
              } sm:col-span-1 lg:col-span-2 hover:shadow-md`}
            />
          </Link>

          {/* Recruiting Tasks */}
          <RecruitingCalendar user={user} />

        </div>
{user?.coachNote && <CoachNotes notes={user.coachNote} />}

        {/* Coach Notes Section below Recruiting Calendar */}
        
        <div className="mt-8">
          <RecruitingTasks user={user} />
        </div>
      </PageWrapper>
    </>
  );
}

const navLinks = [
  {
    name: "Football Programs",
    description: "Find coaches and programs",
    href: "/football-programs",
  },
    {
    name: "Basketball Programs",
    description: "Find coaches and programs",
    href: "/basketball-programs",
  },
  {
    name: "Track",
    description: "Track your previous campaigns",
    href: "/leads",
  },
  {
    name: "Campaigns",
    description: "Monitor your campaign activity",
    href: "/campaigns",
  },
];

const Links = () => {
  return (
    <>
      {navLinks.map((link) => (
        <Link
          className="bg-background p-4 rounded-lg border hover:bg-accent/75 transition-all"
          key={link.href}
          href={link.href}
        >
          {link.name}
          <p className="text-sm text-gray-500">{link.description}</p>
        </Link>
      ))}
    </>
  );
};
