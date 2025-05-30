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
import { getUsageForUser, getUser } from "@/lib/data/users";
import { Usage } from "@/components/parts/usage";
import { PlayerProfile } from "@/components/parts/playerprofile";

const pageData = {
  name: "Dashboard",
  title: "Dashboard",
  description: "Snapshot of your sent emails and more",
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
  const user = await getUser();
  const { data: usageData, serverError: usageServerError } = user || {};

    console.log("Sending email:", usageData);

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
    case "lite":
      leadLimit = 1000;
      break;
    case "pro":
      leadLimit = 10000;
      break;
    case "business":
      leadLimit = 50000;
      break;
    case "enterprise":
      leadLimit = 999999;
      break;
    default:
      leadLimit = 100; // Fallback to free tier limit
  }

  return (
    <>
      <Breadcrumbs pageName={pageData?.name} />
      <PageWrapper>
        <Header title={pageData?.title}>{pageData?.description}</Header>
        <div className="grid grid-cols-3 gap-4">
          <Chart
            chartData={chartData}
            className={`${
              usageData.plan === "enterprise" ? "col-span-3" : "col-span-2"
            }`}
          />
          <PlayerProfile
name={`${usageData.name} ${usageData.last_name}`}
  gradClass={usageData.grad_year ?? ''}
  position="Wide Receiver"
  height="6'1″"
  weight="190 lbs"
  imageUrl="https://s3media.247sports.com/Uploads/Assets/110/127/12127110.jpg?width=70&fit=crop" // Replace with your actual image path
/>

          <Links />
        </div>
        <div className="mt-8">
          <h2 className="text-lg mb-4">Recent Contacts</h2>
          <DataTable
            columns={columns}
            data={recentLeads}
            endpoints={endpointsData}
          />
        </div>
      </PageWrapper>
    </>
  );
}

const navLinks = [
  {
    name: "College Programs",
    description: "Find coaches and programs",
    href: "/coaches",
  },
  {
    name: "Track",
    description: "Track your previous campaigns",
    href: "/leads",
  },
  {
    name: "Activity & Tasks",
    description: "Monitor your campaign activity",
    href: "/activity",
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
