import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { Header } from "@/components/parts/header";
import { PageWrapper } from "@/components/parts/page-wrapper";
import { notFound } from "next/navigation";
import { getUserFullById } from "@/lib/data/users";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Twitter, Instagram, Facebook } from "lucide-react";

export default async function ProfilePage({params}: {params: Promise<{ id: string }>}) {
const { id } = await params; 
  const data = await getUserFullById({ id });
  const { data: user } = data || {};

  if (!user) return notFound();

 
  return (
    <>
      <Breadcrumbs pageName="Player Profile" />
      <PageWrapper>
        <Header title="Player Profile">Showcase your athletic journey</Header>

        {/* Cover Image */}
        <div
          className="w-full h-48 rounded-xl bg-cover bg-center mt-6"
          style={{ backgroundImage: `url(${user.x_username || '/placeholder-cover.jpg'})` }}
        />

        {/* Profile Card */}
        <Card className="w-full shadow-lg overflow-hidden mt-6">
          <CardHeader className="border-b p-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-5">
              <img
                src={user.x_username || '/placeholder.jpg'}
                alt={`${user.name} profile`}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
              />
              <div>
                <CardTitle className="text-2xl font-bold text-primary">
                  {user.name} {user.last_name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Class of {user.grad_year} — {user.position}
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Contact Coach</button>
              <button className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">Request Highlight Video</button>
            </div>
          </CardHeader>

          {/* Info Grid */}
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-muted rounded-b-xl">
            <ProfileField label="Sport" value={user.sport ?? ''} />
            <ProfileField label="Position" value={user.position ?? ''} />
            <ProfileField label="Height" value={user.height ?? ''} />
            <ProfileField label="Weight" value={user.weight ?? ''} />
            <ProfileField label="Test Score" value={user.test_score ?? ''} />
            <ProfileField label="High School" value={user.high_school ?? ''} />
            <ProfileField label="City" value={user.city ?? ''} />
            <ProfileField label="State" value={user.state ?? ''} />
            <SocialField icon={<Twitter className="text-blue-500" />} label="X Username" value={user.x_username ?? ''} />
            <SocialField icon={<Instagram className="text-pink-500" />} label="Instagram" value={user.ig_username ?? ''} />
          </CardContent>

          {/* Bio & Video - Side-by-side layout */}
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <ProfileField label="Bio" value={user.bio ?? ''} />
                <ProfileField label="Highlight Video URL" value={user.video ?? ''} />
              </div>
              <div className="flex-1">
                {user.video && <HighlightVideo url={user.video} />}
              </div>
            </div>
          </CardContent>
        </Card>
      </PageWrapper>
    </>
  );
}

function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-base">
        {value?.trim() ? value : <span className="italic text-muted-foreground">Not provided</span>}
      </p>
    </div>
  );
}

function SocialField({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <ProfileField label={label} value={value} />
    </div>
  );
}

function HighlightVideo({ url }: { url?: string }) {
  if (!url?.trim()) return <p className="italic text-sm text-muted-foreground">No highlight video provided.</p>;

  const trimmed = url.trim();

  if (isYouTubeUrl(trimmed)) {
    const id = getYouTubeId(trimmed);
    if (id) {
      return (
        <div className="w-full h-[300px] md:h-[400px] lg:h-[500px]">
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            title="YouTube Highlight"
            className="w-full h-full rounded-lg shadow"
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
        <div className="w-full h-[300px] md:h-[400px] lg:h-[500px]">
          <iframe
            src={`https://www.hudl.com/embed/video/${hudlId}`}
            title="Hudl Highlight"
            className="w-full h-full rounded-lg shadow"
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
