import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { Header } from "@/components/parts/header";
import { PageWrapper } from "@/components/parts/page-wrapper";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { getUser } from "@/lib/data/users";

// Mock function: replace with real data fetching
async function getPlayerProfile() {
  return {
    firstName: "Jason",
    lastName: "Williams",
    gradYear: "2025",
    gpa: "3.8",
    about: "Hard-working wide receiver with great route-running ability.",
    test: "ACT",
    testScore: "28",
    height: "6'1″",
    weight: "190 lbs",
    position: "Wide Receiver",
    video: "https://youtube.com/samplevideo",
    highSchool: "Lincoln High School",
    city: "Dallas",
    state: "TX",
    xUsername: "@jwill2025",
    instagram: "@jwilliams_athlete",
    photo: "https://s3media.247sports.com/Uploads/Assets/110/127/12127110.jpg?width=70&fit=crop", // Replace with actual path
  };
}

export default async function Page() {
  const profile = await getPlayerProfile();

  if (!profile) notFound();

    const user = await getUser();
    const { data: usageData, serverError: usageServerError } = user || {};

  return (
    <>
      <Breadcrumbs pageName="Player Profile" />
      <PageWrapper>
        <Header title="Player Profile">
          Manage and showcase your athletic profile
        </Header>

        <Card className="w-full overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-6">
              <div className="w-28 h-28 rounded-full overflow-hidden border shadow-sm">
                <img
                  src={profile.photo}
                  alt={`${usageData?.name} ${usageData?.last_name}`}
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="mt-4 md:mt-0 text-center md:text-left">
                <CardTitle className="text-2xl font-semibold">
                  {usageData?.name} {usageData?.last_name}
                </CardTitle>
                <CardDescription className="text-sm">
                  Class of {usageData?.grad_year} — {profile.position}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            <Info label="Height" value={profile.height} />
            <Info label="Weight" value={profile.weight} />
            <Info label="GPA" value={profile.gpa} />
            <Info label="SAT / ACT" value={`${profile.test}: ${profile.testScore}`} />
            <Info label="High School" value={profile.highSchool} />
            <Info label="City" value={profile.city} />
            <Info label="State" value={profile.state} />
            <Info label="X Username" value={profile.xUsername || "—"} />
            <Info label="Instagram" value={profile.instagram || "—"} />
          </CardContent>

          <CardContent className="px-6 pb-6">
            <Section label="About Me" value={profile.about} />
            <Section
              label="Highlight Video"
              value={
                <a
                  href={profile.video}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch Video
                </a>
              }
            />
          </CardContent>
        </Card>
      </PageWrapper>
    </>
  );
}

const Info = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className="text-base font-medium">{value}</p>
  </div>
);

const Section = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="mb-4">
    <p className="text-sm font-semibold mb-1">{label}</p>
    <div className="text-sm text-muted-foreground">{value}</div>
  </div>
);
