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
<div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-y-2 sm:gap-x-4">

<Card className="bg-[#FF7200] rounded-2xl shadow-xl p-6 grid place-items-center text-white">
  <img
    src={user?.image && !user.image.includes('blob') ? user.image : placeholder.src}
    alt={`${user.name} profile`}
    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg transition-transform hover:scale-105"
  />

  <div className="text-center">
    <CardTitle className="text-3xl font-bold drop-shadow-sm">
      {user.name} {user.last_name}
    </CardTitle>
  </div>
</Card>

        <Card className="col-span-2 shadow-lg overflow-hidden">
          {/* Header */}
          <CardHeader className=" p-4 flex flex-col md:flex-row justify-between items-center gap-6 ">
<div className="flex flex-col md:flex-row items-center gap-5">
              
               

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

<div className="w-full flex flex-col gap-2 self-center
 items-center">
  <div className="w-full aspect-[16/9] bg-muted rounded-lg flex items-center justify-center ">
    {user.video ? (
      <HighlightVideo url={user.video} />
    ) : (
      <span className="text-muted-foreground text-sm italic">Video</span>
    )}
  </div>

  <div className="w-full flex justify-center">
    {user.video ? (
      <a
        href={user.video}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 text-sm rounded-md border bg-muted hover:bg-gray-300 transition"
      >
        Watch More
      </a>
    ) : (
      <button
        disabled
        className="px-4 py-2 text-sm rounded-md border bg-muted text-muted-foreground"
      >
        Watch More
      </button>
    )}
  </div>
</div>

        </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-y-2 sm:gap-x-4">

<Card className="w-full rounded-2xl shadow-lg  mt-6 p-6 ">
    {/* EXPO+ SCORES */}
    <div className=" rounded-xl p-6 flex flex-col items-center text-center ">
      <h2 className="text-[#FF7200] text-lg font-bold uppercase mb-4">EXPO+ Scores</h2>
      <p className="text-6xl font-extrabold text-[#FF7200] mb-2">82</p>
      <div className="w-full border-t border-gray-600 my-4"></div>
      <div className="flex justify-around w-full text-lg font-semibold">
        <div>
          <p className="t">91</p>
          <p className="text-sm text-gray-300 mt-1">ACD</p>
        </div>
        <div>
          <p className="">73</p>
          <p className="text-sm text-gray-300 mt-1">ATH</p>
        </div>
      </div>
    </div>
    </Card>
<Card className="w-full col-span-3 rounded-2xl shadow-2xl mt-6 p-6 ">
    {/* EXPO+ METRICS */}
    <div className=" rounded-xl p-6 ">
      <h2 className="text-[#FF7200] text-lg font-bold uppercase justify-self-center mb-6">EXPO+ Metrics</h2>

      <div className="sm:grid grid-cols-2 flex-col sm:flex-row justify-around
 gap-6 sm:gap-12">
        {/* Academics */}
        <div>
          <h3 className="uppercase text-sm text-gray-400 justify-self-center
 mb-2">Academics</h3>
          <div className="flex justify-self-center
 gap-4">
            <CircleChart label="GPA" value={3.5} max={4.0} />
            <CircleChart label="ACT" value={24} max={36} />
          </div>
        </div>

        {/* Athletic */}
        <div>
          <h3 className="uppercase text-sm text-gray-400  justify-self-center
 mb-2">Athletic</h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="font-bold text-[#FF7200]">{user.height || "N/A"}</p>
              <p className="text-xs text-gray-400">Height</p>
            </div>
            <div>
              <p className="font-bold text-[#FF7200]">{user.weight ? `${user.weight} lbs` : "N/A"}</p>
              <p className="text-xs text-gray-400">Weight</p>
            </div>
            <div>
              <p className="font-bold text-[#FF7200]">4.6s</p>
              <p className="text-xs text-gray-400">Speed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Box */}
      <div className="mt-6 bg-gray-800 rounded-lg p-4 text-sm text-gray-300">
        <p><span className="font-bold text-white">Coach's Evaluation:</span> </p>
      </div>
    </div>
</Card>
  </div>


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
