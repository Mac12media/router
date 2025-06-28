import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { Header } from "@/components/parts/header";
import { getLogs } from "@/lib/data/logs";
import { getCampaigns, getEndpoints } from "@/lib/data/endpoints";
import { DataTable } from "@/components/groups/campaigns/data-table";
import { columns } from "@/components/groups/campaigns/columns";
import { PageWrapper } from "@/components/parts/page-wrapper";
import { notFound } from "next/navigation";
import { getUsageForUser, getUserFull } from "@/lib/data/users";
import { getLeads } from "@/lib/data/leads";
import { getLeadAndErrorCounts } from "@/lib/data/dashboard";
import { RecruitingTasks } from "@/components/parts/tasks";
import { Activity } from "@/components/dashboard/activity";
import { Campaigns } from "@/components/parts/campaigns";
import { FavPrograms } from "@/components/parts/favprograms";

const pageData = {
  name: "My Campaigns",
  title: "Campaigns",
  description: "View of all your activity",
};

export default async function Page() {
  // fetch logs
  const logs = await getLogs();
  const { data: logsData, serverError: logsServerError } = logs || {};

  // fetch endpoints
  const endpoints = await getEndpoints();
  const { data: endpointsData, serverError: endpointsServerError } =
    endpoints || {};

      const campaigns = await getCampaigns();
  const { data: campaignsData, serverError: campaignssServerError } =
    campaigns || {};
  // check for errors
  if (!logsData || !endpointsData || !campaignsData || logsServerError || endpointsServerError) {
    notFound();
  }

  // fetch chart data
  const charts = await getLeadAndErrorCounts();
  const { data: chartData, serverError: chartServerError } = charts || {};

  // fetch leads
  const leads = await getLeads();
  const { data: leadsData, serverError: leadsServerError } = leads || {};

  const result = await getUserFull();
  const user = result?.data;

  // fetch number of leads for user this month
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
    leadLimit = 100; // fallback to free tier
}

  const tasksData: RecruitingTask[] = [
    {
      name: "Make X Profile",
      status: "In Progress",
      dueDate: "2025-06-10T00:00:00Z",
      completed: 3,
      totalSteps: 5,
      category: "Follow-up",
      assignedTo: "Jane Doe",
    },
  ];

  const totalSteps = 5; // Total steps for a task (e.g., 5 students to contact)

  return (
    <>
      <Breadcrumbs pageName={pageData?.name} />
      <PageWrapper>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
          <Activity
            chartData={chartData}
            className={`${
              usageData.plan === "elite" ? "col-span-3" : "col-span-2"
            }`}
          />
                  <div className="grid grid-cols-1 gap-4" style={{gridTemplateRows: '.5fr 2fr'}}>
  <Campaigns name={user?.name ?? "New Campaign"} id={user?.id ?? ""} campaigncount={usageData?.campaigncount} profile={user} />
  <FavPrograms />
</div>

        </div>
        <div className="overflow-x-auto mt-8">
          <DataTable
            columns={columns}
            data={campaignsData}
          />
        </div>
      </PageWrapper>
    </>
  );
}
