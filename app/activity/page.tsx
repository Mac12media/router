import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { Header } from "@/components/parts/header";
import { getLogs } from "@/lib/data/logs";
import { getEndpoints } from "@/lib/data/endpoints";
import { DataTable } from "@/components/groups/logs/data-table";
import { columns } from "@/components/groups/logs/columns";
import { PageWrapper } from "@/components/parts/page-wrapper";
import { notFound } from "next/navigation";
import { getUsageForUser } from "@/lib/data/users";
import { getLeads } from "@/lib/data/leads";
import { getLeadAndErrorCounts } from "@/lib/data/dashboard";
import { RecruitingTasks } from "@/components/parts/tasks";
import { Activity } from "@/components/dashboard/activity";

const pageData = {
  name: "Activity",
  title: "Activity",
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

  // check for errors
  if (!logsData || !endpointsData || logsServerError || endpointsServerError) {
    notFound();
  }

    // fetch chart data
    const charts = await getLeadAndErrorCounts();
    const { data: chartData, serverError: chartServerError } = charts || {};
  
    // fetch leads
    const leads = await getLeads();
    const { data: leadsData, serverError: leadsServerError } = leads || {};
  

  
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

const totalSteps = 5;    // Total steps for a task (e.g., 5 students to contact)


  return (
    <>
      <Breadcrumbs pageName={pageData?.name} />
      <PageWrapper>
        <Header title={pageData?.title}>{pageData?.description}</Header>
        <div className="grid grid-cols-3 gap-4 pb-4">
                  <Activity
                    chartData={chartData}
                    className={`${
                      usageData.plan === "enterprise" ? "col-span-3" : "col-span-2"
                    }`}
                  />
                  
      <RecruitingTasks tasks={tasksData} totalSteps={totalSteps} />
                  
                </div>
        <DataTable
          columns={columns}
          data={logsData}
          endpoints={endpointsData}
        />
      </PageWrapper>
    </>
  );
}
