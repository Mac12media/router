import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { Header } from "@/components/parts/header";
import { PageWrapper } from "@/components/parts/page-wrapper";
import { notFound } from "next/navigation";
import { getUserFullById } from "@/lib/data/users";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { X, Instagram } from "lucide-react";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getUserFullById({ id });
  const { data: user } = data || {};

  if (!user) return notFound();

  return (
    <>
      <Breadcrumbs pageName="Player Profile" />
      <PageWrapper>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 sm:gap-x-4">

        <Card className="col-span-2 shadow-lg overflow-hidden">
          {/* Header */}
          <CardHeader className=" p-6 flex flex-col md:flex-row justify-between items-center gap-6 ">
            <div className="flex items-center gap-5">
              <img
                src={"https://static.wixstatic.com/media/e49d37_a38ac7355793484f9d8076cf676d0f02~mv2.jpg/v1/fill/w_230,h_218,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/38E43FA1-1ACB-4087-8EC0-BCDD0818123B_PNG.jpg"}
                alt={`${user.name} profile`}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
              />
              <div>
                <CardTitle className="text-3xl font-bold text-[#FF7200]">
                  {user.name} {user.last_name}
                </CardTitle>
                

              </div>
            </div>


          </CardHeader>
           <CardContent className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-1 p-4 rounded-b-xl">
            <ProfileField label="Class" value={user.grad_year ?? ""} />
            <ProfileField label="Position" value={user.position ?? ""} />
            <ProfileField label="Height" value={user.height ?? ""} />
            <ProfileField label="Weight" value={user.weight ?? ""} />
            <ProfileField label="ACT" value={user.test_score ?? ""} />
            <ProfileField label="High School" value={user.high_school ?? ""} />
            <ProfileField label="City" value={user.city ?? ""} />
            <ProfileField label="State" value={user.state ?? ""} />
                     </CardContent>
        </Card>

 <div className="">
                {user.video && <HighlightVideo url={user.video} />}
              </div>
        </div>

        <Card className="w-full shadow-lg overflow-hidden mt-6">

          {/* Info Grid */}
           <CardContent className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-1 p-6 rounded-b-xl">
            <ProfileField label="Class" value={user.grad_year ?? ""} />
            <ProfileField label="Position" value={user.position ?? ""} />
            <ProfileField label="Height" value={user.height ?? ""} />
            <ProfileField label="Weight" value={user.weight ?? ""} />
            <ProfileField label="ACT" value={user.test_score ?? ""} />
            <ProfileField label="High School" value={user.high_school ?? ""} />
            <ProfileField label="City" value={user.city ?? ""} />
            <ProfileField label="State" value={user.state ?? ""} />
                     </CardContent>
        </Card>

<CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <ProfileField label="Bio" value={user.bio ?? ""} />
                <ProfileField label="Highlight Video URL" value={user.video ?? ""} />
              </div>
             
            </div>
          </CardContent>
          {/* Metrics Section */}
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start rounded-xl p-6">
              {/* Measureables */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#FF7200] uppercase">Measureables:</h3>
                <div className="text-2xl font-semibold">
                  <p>{user.height ?? "N/A"}</p>
                  <p>{user.weight ? `${user.weight} lbs` : "N/A"}</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#FF7200] uppercase">Metrics</h3>
                <div className="grid grid-cols-2 gap-3">
                 </div>
              </div>

             
            </div>
          </CardContent>

          
      </PageWrapper>
    </>
  );
}

// Profile Field component
function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-base">
        {value?.trim() ? value : <span className="italic text-muted-foreground">Not provided</span>}
      </p>
    </div>
  );
}

// Social Field with Icon
function SocialField({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <ProfileField label={label} value={value} />
    </div>
  );
}

function HighlightVideo({ url }: { url?: string }) {
  if (!url?.trim()) {
    return <p className="italic text-sm text-muted-foreground">No highlight video provided.</p>;
  }

  const trimmed = url.trim();

  if (isYouTubeUrl(trimmed)) {
    const id = getYouTubeId(trimmed);
    if (id) {
      return (
        <div className="w-full aspect-[16/9]">
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            title="YouTube Highlight"
            className="w-full h-full rounded-lg object-cover shadow"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
  }

  if (isHudlUrl(trimmed)) {
    const hudlId = getHudlId(trimmed);
    if (hudlId) {
      return (
        <div className="w-full aspect-[16/9]">
          <iframe
            src={`https://www.hudl.com/embed/video/${hudlId}`}
            title="Hudl Highlight"
            className="w-full h-full rounded-lg  object-cover shadow"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      );
    }
  }

  return (
    <a
      href={trimmed}
      className="text-blue-600 hover:underline text-sm"
      target="_blank"
      rel="noopener noreferrer"
    >
      ▶ Watch Highlight Video
    </a>
  );
}

// Helpers
function isYouTubeUrl(url: string): boolean {
  return /youtu\.be|youtube\.com/.test(url);
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com.*(?:\/|v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function isHudlUrl(url: string): boolean {
  return url.includes("hudl.com/video/");
}

function getHudlId(url: string): string | null {
  const match = url.match(/hudl\.com\/video\/([^?#]+)/);
  return match ? match[1] : null;
}
