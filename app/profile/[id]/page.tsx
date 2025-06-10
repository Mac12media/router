import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { Header } from "@/components/parts/header";
import { PageWrapper } from "@/components/parts/page-wrapper";
import { notFound } from "next/navigation";
import { getUser, getUserFullById } from "@/lib/data/users";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { X, Instagram } from "lucide-react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import dynamic from "next/dynamic";

import placeholder from "@/public/userplaceholder.png";

const COLORS = ["#FF7200", "#e5e5e5"];

const CircleChart = dynamic(() => import("@/components/parts/charts"));


export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getUserFullById({ id });
  const { data: user } = data || {};

    const result = await getUser();
    const real = result?.data;

  if (!user) return notFound();

  return (
    <>
      <Breadcrumbs pageName="Player Profile" />
      <PageWrapper>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 sm:gap-x-4">

        <Card className="col-span-2 shadow-lg overflow-hidden">
          {/* Header */}
          <CardHeader className=" p-4 flex flex-col md:flex-row justify-between items-center gap-6 ">
<div className="flex flex-col md:flex-row items-center gap-5">
              <img
src={user?.image && !user.image.includes('blob') ? user.image : placeholder.src}
  alt={`${user.name} profile`}
  className="w-28 h-28 rounded-full object-cover  border-white shadow"
/>

              <div>
                <CardTitle className="text-3xl font-bold text-[#FF7200]">
                  {user.name} {user.last_name}
                </CardTitle>
                

              </div>
               

            </div>
            <div className="flex gap-2">

            {real?.id === id && (
  <Link
    href="/profile"
    className="px-4 py-2 border rounded hover:bg-gray-300 text-sm"
  >
    Edit Profile
  </Link>
  
)}
<a
  href={user.x_username ? `https://x.com/${user.x_username}` : '/'}
  target="_blank"
  rel="noopener noreferrer"
  className="self-center"
>
  <img
    src="https://www.mrl.ims.cam.ac.uk/sites/default/files/media/x-logo.png"
    alt={`${user.name} profile`}
    className="w-10 dark:invert"
  />
</a>
            </div>


 

          </CardHeader>
           <CardContent className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4 gap-1 p-4 rounded-b-xl">
            <ProfileField label="Class" value={user.grad_year ?? ""} />
            <ProfileField label="Position" value={user.position ?? ""} />
            <ProfileField label="Height" value={user.height ?? ""} />
            <ProfileField label="Weight" value={user.weight ?? ""} />
                                 </CardContent>
           <CardContent className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4 gap-1 p-4 rounded-b-xl">

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
           <CardContent className="p-6">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start rounded-xl p-1">
    {/* Measureables */}
    

    {/* ACT & GPA Circle Graphs */}
    <div className="flex justify-center gap-8">
      {user.name && (
<CircleChart label="ACT" value={ 24} max={36} />
      )}
      {user.name && (
<CircleChart label="GPA" value={ 3.5} max={4.0} />
      )}
    </div>
    <div className="">
      <h3 className="text-lg font-bold text-[#FF7200] uppercase">Measureables:</h3>
      <div className="text-2xl font-semibold">
        <p>{user.height ?? "N/A"}</p>
        <p>{user.weight ? `${user.weight} lbs` : "N/A"}</p>
      </div>
    </div>

    {/* Metrics */}
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-[#FF7200] uppercase">Metrics</h3>
      <div className="grid grid-cols-2 gap-3">
        {/* Add any metric fields here if needed */}
      </div>
    </div>
  </div>

  
</CardContent>

        </Card>


          {/* Metrics Section */}
         

          
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
        {value?.trim() ? value : <span className="italic text-muted-foreground"></span>}
      </p>
    </div>
  );
}

// Social Field with Icon
function SocialField({ icon}: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
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
