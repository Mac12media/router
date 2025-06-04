'use client';

import { useEffect, useState } from 'react';
import { Breadcrumbs } from '@/components/parts/breadcrumbs';
import { Header } from '@/components/parts/header';
import { PageWrapper } from '@/components/parts/page-wrapper';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { getUserFull, updateUserProfile } from '@/lib/data/users';

const positionsBySport: Record<string, string[]> = {
  Football: [
    'Quarterback', 'Running Back', 'Wide Receiver', 'Tight End', 'Offensive Lineman',
    'Defensive Lineman', 'Linebacker', 'Cornerback', 'Safety', 'Kicker', 'Punter',
  ],
  Basketball: [
    'Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center',
  ],
};

const usStates = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
  'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
];

function sanitizeNulls(obj: any) {
  const cleaned: any = {};
  for (const key in obj) {
    if (key === 'sport') {
      cleaned[key] = obj[key] ?? 'Football';
    } else {
      cleaned[key] = obj[key] ?? '';
    }
  }
  return cleaned;
}

function formatDisplayValue(value: string) {
  return value?.trim() ? value : <span className="text-muted-foreground italic">Not provided</span>;
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({});
  const [initialData, setInitialData] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);

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
    try {
      await updateUserProfile({
        name: form.name,
        grad_year: form.grad_year,
        bio: form.bio,
        test_score: form.test_score,
        height: form.height,
        weight: form.weight,
        position: form.position,
        sport: form.sport,
        video: form.video,
        high_school: form.high_school,
        city: form.city,
        state: form.state,
        x_username: form.x_username,
        ig_username: form.ig_username,
      });
      setInitialData(form);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  };

  const handleCancel = () => {
    setForm(initialData);
    setIsEditing(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <>
      <Breadcrumbs pageName="Player Profile" />
      <PageWrapper>
        <Header title="Player Profile"></Header>

        <Card className="w-full shadow-md overflow-hidden">
          <CardHeader className="border-b flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <img
                src={"https://static.wixstatic.com/media/e49d37_a38ac7355793484f9d8076cf676d0f02~mv2.jpg/v1/fill/w_230,h_218,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/38E43FA1-1ACB-4087-8EC0-BCDD0818123B_PNG.jpg"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border"
              />
              <div>
                <CardTitle className="text-2xl font-semibold">
                  {form.name} {form.last_name}
                </CardTitle>
                <CardDescription>
                  Class of {form.grad_year} — {form.position}
                </CardDescription>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border rounded hover:bg-gray-100 text-sm"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            )}
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {isEditing ? (
              <ProfileSelect label="Sport" name="sport" value={form.sport} onChange={handleChange} options={['Football', 'Basketball']} />
            ) : (
              <ProfileField label="Sport" name="sport" value={form.sport} editable={false} onChange={handleChange} />
            )}

            {isEditing ? (
              <ProfileSelect label="Position" name="position" value={form.position} onChange={handleChange} options={positionsBySport[form.sport] || []} />
            ) : (
              <ProfileField label="Position" name="position" value={form.position} editable={false} onChange={handleChange} />
            )}

            {[
              ['Height', 'height'],
              ['Weight', 'weight'],
              ['Test Score', 'test_score'],
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

function ProfileSelect({ label, name, value, onChange, options }: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[]; }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <select name={name} value={value} onChange={onChange} className="w-full border rounded px-2 py-1 text-sm">
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
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
            className="w-full h-full rounded border"
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
            className="w-full h-full rounded border"
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

