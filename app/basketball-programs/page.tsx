import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { Header } from "@/components/parts/header";
import { DataTable } from "@/components/groups/bbcoaches/data-table"; // Make sure this exists
import { columns } from "@/components/groups/bbcoaches/columns"; // Define columns for coach data
import { PageWrapper } from "@/components/parts/page-wrapper";
import { getBBCoaches } from "@/lib/data/coaches";

const pageData = {
  name: "Basketball Programs",
  title: "Basketball Programs",
  description: "All college basketball coaches",
};

// Sample data for college coaches
const sampleCoachesData = [
  {
    id: "1",
    name: "John Smith",
    college: "University of Michigan",
    sport: "Basketball",
    email: "jsmith@umich.edu",
    phone: "555-123-4567",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Michigan_Wolverines_logo.svg/1200px-Michigan_Wolverines_logo.svg.png",

  },
  {
    id: "2",
    name: "Sarah Johnson",
    college: "Stanford University",
    sport: "Soccer",
    email: "sarahj@stanford.edu",
    phone: "555-987-6543",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/1341px-Stanford_Cardinal_logo.svg.png",

  }, 
  {
    id: "3",
    name: "Mike Brown",
    college: "Ohio State University",
    sport: "Football",
    email: "mbrown@osu.edu",
    phone: "555-321-7890",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Ohio_State_Buckeyes_logo.svg/2082px-Ohio_State_Buckeyes_logo.svg.png",

  },
];

export default async function Page() {

    // fetch logs
    const coaches = await getBBCoaches();


  const { data: coachesdata, serverError: logsServerError } = coaches || {};



  return (
    <>
      <Breadcrumbs pageName={pageData.name} />
      <PageWrapper>
        <Header title={pageData.title}></Header>
        <DataTable
          columns={columns}
          data={coachesdata ?? []}
        />
      </PageWrapper>
    </>
  );
}
