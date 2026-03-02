'use client';

import { useEffect, useState } from 'react';
import { Breadcrumbs } from '@/components/parts/breadcrumbs';
import { Header } from '@/components/parts/header';
import { PageWrapper } from '@/components/parts/page-wrapper';
import placeholder from "@/public/userplaceholder.png";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { getUserFull, updateUserProfile } from '@/lib/data/users';
import { supabase } from '@/lib/supabase'; // import your client



const positionsBySport: Record<string, string[]> = {
  football: [
  'QB',     // Quarterback
  'RB',     // Running Back
  'WR',     // Wide Receiver
  'TE',     // Tight End
  'OL',     // Offensive Lineman
  'DL',     // Defensive Lineman
  'LB',     // Linebacker
  'CB',     // Cornerback
  'S',      // Safety
  'K',      // Kicker
  'P',      // Punter
],
  basketball_boys: [
  'PG',     // Point Guard
  'SG',     // Shooting Guard
  'SF',     // Small Forward
  'PF',     // Power Forward
  'C',      // Center
],
  basketball_girls: [
  'PG',
  'SG',
  'SF',
  'PF',
  'C',
],
  girls_flag_football: [
  'QB',
  'RB',
  'WR',
  'TE',
  'OL',
  'DL',
  'LB',
  'CB',
  'S',
  'K',
  'P',
],

};

const GRAD_OPTIONS = [
  ...Array.from({ length: 8 }, (_, i) => (2025 + i).toString()),
  "Transfer",
];


const usStates = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT',
  'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',
  'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI',
  'MN', 'MS', 'MO', 'MT', 'NE', 'NV',
  'NH', 'NJ', 'NM', 'NY', 'NC',
  'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
  'SC', 'SD', 'TN', 'TX', 'UT', 'VT',
  'VA', 'WA', 'WV', 'WI', 'WY',
];

const SPORT_OPTIONS = [
  { value: "football", label: "Football" },
  { value: "basketball_boys", label: "Basketball (Boys)" },
  { value: "basketball_girls", label: "Basketball (Girls)" },
  { value: "girls_flag_football", label: "Girls Flag Football" },
];

function sanitizeNulls(obj: any) {
  const cleaned: any = {};
  for (const key in obj) {
    if (key === 'sport') {
      cleaned[key] = obj[key] ?? 'football';
    } else {
      cleaned[key] = obj[key] ?? '';
    }
  }
  return cleaned;
}

function formatDisplayValue(value: string) {
  return value?.trim() ? value : <span className="text-muted-foreground italic">Not provided</span>;
}

function formatSportLabel(value: string) {
  const match = SPORT_OPTIONS.find((opt) => opt.value === value);
  return match ? match.label : value;
}





export default function Page() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({});
  const [initialData, setInitialData] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const userRes = await getUserFull();
      const cleaned = sanitizeNulls(userRes?.data || {});
      setForm(cleaned);
      setInitialData(cleaned);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: value,
      ...(name === 'sport' ? { position: '' } : {}),
    }));
  };

  const handleSave = async () => {
    if (uploading) {
      alert("Please wait for the image upload to finish.");
      return;
    }
    try {
      await updateUserProfile({
        name: form.name,
        grad_year: form.grad_year,
        bio: form.bio,
        test_score: form.test_score,
        height: form.height,
                image: form.image,

        weight: form.weight,
        position: form.position,
        sport: form.sport,
        video: form.video,
        high_school: form.high_school,
        city: form.city,
        state: form.state,
        gpa: form.gpa,
        x_username: form.x_username,
        ig_username: form.ig_username,
      });
      setInitialData(form);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  };

  // Upload handler
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const previewUrl = URL.createObjectURL(file);
  setForm((prev: any) => ({ ...prev, image: previewUrl }));

  try {
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    body.append("userId", form.id || "user");

    const res = await fetch("/api/upload-profile-image", {
      method: "POST",
      body,
    });
    setUploading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("Upload error:", data?.error || res.statusText);
      alert("Upload failed. Please try again.");
      return;
    }

    const data = await res.json();
    if (data?.url) {
      setForm((prev: any) => ({ ...prev, image: data.url }));
    } else {
      alert("Upload succeeded but the image URL is unavailable.");
    }
  } finally {
    URL.revokeObjectURL(previewUrl);
  }
};


  const handleCancel = () => {
    setForm(initialData);
    setIsEditing(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <>
      <Breadcrumbs pageName="Edit Profile" />
      <PageWrapper>

        <Card className="w-full overflow-hidden">
          <CardHeader className="border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
  <img
  src={form.image?.trim() || placeholder.src}
    alt="Profile"
    className="w-28 h-28 rounded-full object-cover border border-white/10 shadow-lg"
  />
  {isEditing && (
    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="absolute top-0 left-0 w-28 h-28 opacity-0 cursor-pointer"
    />
  )}
</div>

              <div>
                <div>
  {isEditing ? (
    <div className="flex gap-2">
      <input
        type="text"
        name="name"
        value={form.name || ''}
        onChange={handleChange}
        placeholder="First Name"
        className="border px-2 py-1 rounded text-sm"
      />
    </div>
  ) : (
    <CardTitle className="text-2xl font-semibold">
      {formatDisplayValue(`${form.name} ${form.last_name}`)}
    </CardTitle>
  )}
</div>

                
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border  rounded-full text-sm hover:text-white hover:bg-white/10"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={uploading}
                  className="px-4 py-2 bg-[#FF7200] text-white dark:text-black rounded-full text-sm hover:opacity-90 disabled:opacity-60"
                >
                  {uploading ? "Uploading..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border rounded text-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </CardHeader>

           <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            {isEditing ? (
              <ProfileSelect label="Sport" name="sport" value={form.sport} onChange={handleChange} options={SPORT_OPTIONS} />
            ) : (
              <ProfileField label="Sport" name="sport" value={form.sport} editable={false} onChange={handleChange} />
            )}

            {isEditing ? (
              <ProfileSelect label="Position" name="position" value={form.position} onChange={handleChange} options={positionsBySport[form.sport] || []} />
            ) : (
              <ProfileField label="Position" name="position" value={form.position} editable={false} onChange={handleChange} />
            )}

             {isEditing ? (
              <ProfileSelect label="Class" name="grad_year" value={form.grad_year} onChange={handleChange} options={GRAD_OPTIONS} />
            ) : (
              <ProfileField label="Class" name="grad_year" value={form.grad_year} editable={false} onChange={handleChange} />
            )}

            {[
              ['Height', 'height'],
              ['Weight', 'weight'],
              ['ACT/SAT', 'test_score'],
                            ['GPA', 'gpa'],
              ['High School', 'high_school'],
              ['City', 'city'],
              ['X Username', 'x_username'],
              ['Instagram', 'ig_username'],

            ].map(([label, key]) => (
              <ProfileField key={key} label={label} name={key} value={form[key]} editable={isEditing} onChange={handleChange} />
            ))}

            {isEditing ? (
              <ProfileSelect label="State" name="state" value={form.state} onChange={handleChange} options={usStates} />
            ) : (
              <ProfileField label="State" name="state" value={form.state} editable={false} onChange={handleChange} />
            )}
          </CardContent>

          <CardContent className="px-6 pb-6 space-y-6">
            <ProfileTextArea label="Bio" name="bio" value={form.bio} editable={isEditing} onChange={handleChange} />
            <ProfileField label="Highlight Video URL" name="video" value={form.video} editable={isEditing} onChange={handleChange} />
            {!isEditing && form.video && <HighlightVideo url={form.video} />}
          </CardContent>
        </Card>
      </PageWrapper>
    </>
  );
}

function ProfileField({ label, name, value, editable, onChange }: { label: string; name: string; value: string; editable: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {editable ? (
        <input type="text" name={name} value={value || ''} onChange={onChange} className="w-full border rounded px-2 py-1 text-sm" />
      ) : (
        <p className="text-base font-medium">{formatDisplayValue(value)}</p>
      )}
    </div>
  );
}

function ProfileTextArea({ label, name, value, editable, onChange }: { label: string; name: string; value: string; editable: boolean; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; }) {
  return (
    <div>
      <p className="text-sm font-semibold mb-1">{label}</p>
      {editable ? (
        <textarea name={name} value={value || ''} onChange={onChange} rows={4} className="w-full border rounded px-2 py-1 text-sm" />
      ) : (
        <p className="text-sm text-muted-foreground">{formatDisplayValue(value)}</p>
      )}
    </div>
  );
}

function ProfileSelect({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<string | { value: string; label: string }>;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <select name={name} value={value} onChange={onChange} className="w-full border rounded px-2 py-1 text-sm">
        <option value="">Select {label}</option>
        {options.map((opt) =>
          typeof opt === "string" ? (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>
    </div>
  );
}

function HighlightVideo({ url }: { url?: string }) {
  if (!url || typeof url !== "string" || !url.trim()) {
    return (
      <p className="text-sm italic text-muted-foreground">
        No highlight video provided.
      </p>
    );
  }

  const trimmed = url.trim();

  if (isYouTubeUrl(trimmed)) {
    const id = getYouTubeId(trimmed);
    if (id) {
      return (
        <div className="w-full h-[400px] md:h-[500px] lg:h-[600px]">
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            title="YouTube video"
            className="w-full h-full rounded-lg border border-white/10"
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
        <div className="w-full h-[400px] md:h-[500px] lg:h-[600px]">
          <iframe
            src={`https://www.hudl.com/embed/video/${hudlId}`}
            title="Hudl video"
            className="w-full h-full rounded-lg border border-white/10"
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

function isHudlUrl(url: string) {
  return url.includes("hudl.com/video/");
}

function getHudlId(url: string): string | null {
  const match = url.match(/hudl\.com\/video\/([^?#]+)/);
  return match ? match[1] : null;
}
