import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { Header } from "@/components/parts/header";
import { PageWrapper } from "@/components/parts/page-wrapper";
import { notFound } from "next/navigation";
import { getPublicUserById, getUser, getUserFullById } from "@/lib/data/users";
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
import { createLead } from "@/lib/data/leads";
import { ContactButton } from "@/components/parts/contact";

const COLORS = ["#FF7200", "#e5e5e5"];

const CircleChart = dynamic(() => import("@/components/parts/charts"));

const DEFAULT_ID = "f169ff24-a542-4e6a-b351-731f685d9482";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getPublicUserById({ id: id ?? DEFAULT_ID });
    const result = await getUser();
    const real = result?.data;
  const isFlagFootball =
    user?.sport === "girls_flag_football" ||
    user?.sport?.toLowerCase().includes("flag");
  const accentColor = isFlagFootball ? "#EC4899" : "#FF7200";

        const leadId = await createLead(id);

  if (!user) return notFound();

  return (
    <>
      <Breadcrumbs pageName="Player Profile" />
      <PageWrapper>
<div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-8 gap-y-4 sm:gap-x-4">

{(() => {
  const isFlagFootball =
    user.sport === "girls_flag_football" ||
    user.sport?.toLowerCase().includes("flag");
  const profileGradient = isFlagFootball
    ? "radial-gradient(circle at top left, rgba(255,255,255,0.22), transparent 34%), linear-gradient(145deg, rgba(244,114,182,0.98) 0%, rgba(236,72,153,0.92) 46%, rgba(190,24,93,0.84) 100%)"
    : "radial-gradient(circle at top left, rgba(255,255,255,0.22), transparent 34%), linear-gradient(145deg, rgba(255,153,92,0.98) 0%, rgba(255,114,0,0.92) 46%, rgba(194,65,12,0.84) 100%)";
  const nameClass = isFlagFootball ? "text-pink-100" : "text-white";
  const metaClass = isFlagFootball ? "text-pink-100/80" : "text-white/80";
  return (
<Card className="relative w-full col-span-2 content-center p-5 sm:p-8 text-white" style={{ background: profileGradient }}>
  <div className="w-full flex flex-col items-center gap-6">
    {/* Profile Image */}
    <div className="relative">
      <img
        src={
          user?.image && !user.image.includes('blob')
            ? user.image
            : placeholder.src
        }
        alt={`${user.name} profile`}
        className="w-36 h-36 self-center lg:w-36 lg:h-36 rounded-full object-cover border-2 border-white/70 shadow-lg"
      />
    </div>
    

    {/* Name, Class, Position */}
    <div className="flex flex-col items-center text-center space-y-2">
      <CardTitle className={`text-2xl font-bold tracking-tight ${nameClass}`}>
        {user.name} {user.last_name}
      </CardTitle>
      {user.plan && user.plan !== "free" && (
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
          <img src="/sport-icons/verified.png" alt="" className="h-5 w-5" />
          Expo Member
        </span>
      )}
      <div className={`text-lg font-medium ${metaClass}`}>
        {user.grad_year} • {user.position}
      </div>
    </div>
  </div>


  {/* Contact Me Button */}
  <a
    href={user.x_username ? `https://x.com/${user.x_username}` : "/"}
    target="_blank"
    rel="noopener noreferrer"
    className="absolute right-5 top-5 rounded-full p-2  hover:bg-white/30"
  >
    <img
      src="https://www.mrl.ims.cam.ac.uk/sites/default/files/media/x-logo.png"
      alt={`${user.name} profile`}
      className="h-6"
    />
  </a>

  <div className="w-full mt-6 flex justify-center">
    <ContactButton email={user.email ?? ""} />
    
  </div>
  
</Card>
  );
})()}


        <Card className="col-span-3 shadow-lg overflow-hidden">
          {/* Header */}
          <CardHeader className="p-4 flex flex-col gap-6 border-b border-white/10">

            <div className="flex justify-between gap-2">

            {real?.id === id && (
  <Link
    href="/profile"
    className="px-4 py-2 border  rounded-full text-sm  hover:text-black hover:bg-black/10"
  >
    Edit Profile
  </Link>
  
)}

            </div>


 

          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 p-4">

            <ProfileField label="Height" value={user.height ?? ""} />
            <ProfileField label="Weight" value={user.weight ?? ""} />
                                             </CardContent>
           <CardContent className="grid grid-cols-2 gap-4 p-4">

            <ProfileField label="High School" value={user.high_school ?? ""} />
            <ProfileField label="City" value={user.city ?? ""} />
            <ProfileField label="State" value={user.state ?? ""} />
                                             </CardContent>
          <CardContent className="p-4 pt-2 [--expo-divider:rgba(209,213,219,0.6)] dark:[--expo-divider:rgba(75,85,99,0.6)]">
            <h4 className="uppercase text-xs text-gray-400 mb-3 text-center">
              Academics
            </h4>
            <div className="flex justify-center gap-6">
              <CircleChart
                label="GPA"
                value={Number(user.gpa) || 0}
                max={4.0}
                color={accentColor}
              />
              <CircleChart
                label="ACT"
                value={Number(user.test_score) || 0}
                max={36}
                color={accentColor}
              />
            </div>
          </CardContent>

        </Card>

<div className="w-full flex flex-col col-span-3  gap-2 self-center
 items-center">
  <div className="w-full aspect-[16/9] rounded-2xl border border-white/10 bg-black/50 flex items-center justify-center">
    {user.video ? (
      <HighlightVideo url={user.video} accentColor={accentColor} />
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
        className="px-4 py-2 text-sm rounded-full border  hover:bg-white/20 transition"
      >
        Watch More
      </a>
    ) : (
      <button
        disabled
        className="px-4 py-2 text-sm rounded-full border  text-white/40"
      >
        Watch More
      </button>
    )}
  </div>
</div>

        </div>
          <div className="grid grid-cols-1 md:grid-cols-8 gap-y-2 sm:gap-x-4">

<Card className="w-full col-span-2 mt-6 p-0 overflow-hidden order-2 md:order-1">
  {/* EXPO+ SCORES */}
  <div
    className="text-white text-center py-4 text-xl font-extrabold tracking-wide"
    style={{ background: "linear-gradient(135deg, rgba(255,114,0,0.95), rgba(255,114,0,0.75))" }}
  >
    EXPO SCORES
  </div>
  <div className="h-1 bg-gray-300/60 dark:bg-gray-600/60" />
  <div className="rounded-xl flex flex-col items-center text-center p-6">
    <div className="w-full flex items-center justify-around" style={{ color: accentColor }}>
      <div className="flex flex-col items-center gap-2">
        <div className="h-10 w-10 rounded-full border-2 flex items-center justify-center text-sm font-bold" style={{ borderColor: accentColor }}>
          {user.ACD_score ?? 0}
        </div>
        <span className="text-sm font-semibold">ACD</span>
      </div>

      <div className="relative flex items-center justify-center">
        <div
          className="h-24 w-24 rounded-full border-[10px] flex items-center justify-center bg-transparent shadow-md"
          style={{ borderColor: accentColor }}
        >
          <span className="text-3xl font-extrabold" style={{ color: accentColor }}>
            {user.expo_score ?? 0}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="h-10 w-10 rounded-full border-2 flex items-center justify-center text-sm font-bold" style={{ borderColor: accentColor }}>
          {user.ATH_score ?? 0}
        </div>
        <span className="text-sm font-semibold">ATH</span>
      </div>
    </div>

    <div className="w-full border-t border-gray-300/60 dark:border-gray-600/60 my-6" />

    {(user.forty_time != null || user.l_drill != null || user.vertical != null) && (
      <div className="w-full space-y-3 text-left">
        {user.forty_time != null && (
          <div className="flex items-stretch overflow-hidden rounded-xl border border-gray-300/60 dark:border-gray-600/60">
            <div className="flex-1 px-4 py-3 font-semibold tracking-wide text-gray-900 dark:text-white bg-gray-300/60 dark:bg-gray-600/60">
              40 TIME
            </div>
            <div className="min-w-[92px] px-4 py-3 font-bold text-right text-gray-900 dark:text-white">
              {user.forty_time}s
            </div>
          </div>
        )}
        {user.l_drill != null && (
          <div className="flex items-stretch overflow-hidden rounded-xl border border-gray-300/60 dark:border-gray-600/60">
            <div className="flex-1 px-4 py-3 font-semibold tracking-wide text-gray-900 dark:text-white bg-gray-300/60 dark:bg-gray-600/60">
              L DRILL
            </div>
            <div className="min-w-[92px] px-4 py-3 font-bold text-right text-gray-900 dark:text-white">
              {user.l_drill}s
            </div>
          </div>
        )}
        {user.vertical != null && (
          <div className="flex items-stretch overflow-hidden rounded-xl border border-gray-300/60 dark:border-gray-600/60">
            <div className="flex-1 px-4 py-3 font-semibold tracking-wide text-gray-900 dark:text-white bg-gray-300/60 dark:bg-gray-600/60">
              VERTICAL
            </div>
            <div className="min-w-[92px] px-4 py-3 font-bold text-right text-gray-900 dark:text-white">
              {user.vertical}&quot;
            </div>
          </div>
        )}
      </div>
    )}

    {(user.forty_time != null || user.l_drill != null || user.vertical != null) && (
      <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-gray-200 text-center">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          ✓
        </span>
        <span className="inline-flex items-center gap-1 whitespace-nowrap">
          Verified at The
          <a
            href="https://exporecruits.com/combine"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#FF7200] dark:[#FF7200]"
          >
            EXPO Combine
          </a>
        </span>
      </div>
    )}
  </div>

  {/* METRICS */}
  <div className="p-6 pt-0">
    {/* Athletic */}
    <div>
      <h4 className="uppercase text-xs text-gray-400 mb-3 text-center">
        Athletic
      </h4>
      <div className="grid grid-cols-2 gap-6 text-center">
        <div>
          <p className="font-bold text-lg" style={{ color: accentColor }}>
            {user.height || "N/A"}
          </p>
          <p className="text-xs text-gray-400">Height</p>
        </div>
        <div>
          <p className="font-bold text-lg" style={{ color: accentColor }}>
            {user.weight ? `${user.weight} lbs` : "N/A"}
          </p>
          <p className="text-xs text-gray-400">Weight</p>
        </div>
      </div>
    </div>
  </div>
</Card>
<Card className="w-full col-span-6 mt-6 p-6 order-1 md:order-2">
    {/* EXPO+ METRICS */}
    <div className=" rounded-xl p-6 ">
       <h2 className="text-lg font-bold uppercase mb-6" style={{ color: accentColor }}>
    Player Bio
  </h2>

  <div className="text-sm  leading-relaxed whitespace-pre-line max-w-4xl">
    {user.bio?.trim() ? (
      user.bio
    ) : (
      <span className="italic text-gray-500">
        No bio provided yet.
      </span>
    )}
  </div>

      {/* Evaluation Box */}
      <div className="mt-6 bg-gray-300/60 dark:bg-gray-600/60 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-200">
<p><span className="font-bold text-gray-900 dark:text-white">Coach&rsquo;s Evaluation:</span></p>
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

function HighlightVideo({ url, accentColor }: { url?: string; accentColor: string }) {
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
      className="underline text-sm"
      style={{ color: accentColor }}
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
