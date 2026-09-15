import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { Header } from "@/components/parts/header";
import { PageWrapper } from "@/components/parts/page-wrapper";
import { PlanTiles } from "./plan-tiles";
import { getUsageForUser } from "@/lib/data/users";
import { UpgradeCountdownBanner } from "./countdown";

const pageData = {
  name: "Upgrade",
  title: "Upgrade",
  description: "Upgrade your plan to capture more leads",
};
 
export default async function Page() {
  const usage = await getUsageForUser();
  const { data: usageData } = usage || {};

  return (
    <>
      <Breadcrumbs pageName={pageData?.name} />
      <PageWrapper>
        <div className="space-y-8">
          <UpgradeCountdownBanner />

          <div className="rounded-3xl border border-border bg-card px-6 py-10 text-center shadow-sm">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Recruiting plans
            </p>
            <h1 className="text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl">
              Pick a plan that matches your next move
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Get more player campaigns, deeper analytics, and recruiting visibility.
              Every plan is built to help you stay visible and recruit smarter.
            </p>
          </div>
        </div>
        <PlanTiles usage={usageData} />
      </PageWrapper>
    </>
  );
}
