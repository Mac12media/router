"use client";

import { useState, useTransition } from "react";
import { SendIcon, RocketIcon } from "lucide-react";
import { createCampaignSchema as formSchema } from "@/lib/data/validations";
import { createCampaign } from "@/lib/data/endpoints";
import { decreaseCampaignCount } from "@/lib/data/users";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

/**
 * Props
 */

/**
 * UI constants
 */
const CAMPAIGN_TYPE_OPTIONS = [
  "Intro Campaign (1st Campaign)",
  "Basic Marketing Campaign",
  "Important Announcement",
];

const SEGMENT_KEYS = {
  fbs: "NCAA D1 (FBS + FCS)",
  fcs: "NCAA D2",
  d2: "NCAA D3 & NAIA",
  d3: "Junior College",
  my: "My Target Programs Only",
} as const;

type SegmentKey = keyof typeof SEGMENT_KEYS;

export function Campaigns({
  id,
  name,
  campaigncount,
  profile,
}: {
  id: string;
  name: string;
  campaigncount: number;
  profile: any;
}) {  /** ----------------------------------------------------
   *  Core local state
   * -------------------------------------------------- */
  const [showModal, setShowModal] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  // remaining campaign credits (local optimistic)
  const [localCampaignCount, setLocalCampaignCount] = useState(campaigncount);


    const profileData = {
    bio: profile.bio ?? "",
    video: profile.film ?? profile.video ?? null,
    grad_year: profile.classYear ?? profile.grad_year ?? "",
    height: profile.height ?? "",
    weight: profile.weight ?? "",
  } as const;
  /** ----------------------------------------------------
   *  Campaign form state
   * -------------------------------------------------- */
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [segments, setSegments] = useState<Record<SegmentKey, boolean>>({
    fbs: true,
    fcs: true,
    d2: true,
    d3: true,
    my: false,
  });

  const [useCustomInfo, setUseCustomInfo] = useCustomInfoInitial();
  const [customBio, setCustomBio] = useState("");
  const [customFilm, setCustomFilm] = useState("");
  const [customClass, setCustomClass] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [customWeight, setCustomWeight] = useState("");

  /** ----------------------------------------------------
   *  Boost form state
   * -------------------------------------------------- */
  const [boostType, setBoostType] = useState({ custom: false, repost: true });
  const [boostLink, setBoostLink] = useState("");

  /** ----------------------------------------------------
   *  Helpers
   * -------------------------------------------------- */
  function toggleSegment(key: SegmentKey) {
    if (key === "my") {
      setSegments({ fbs: false, fcs: false, d2: false, d3: false, my: true });
    } else {
      setSegments((prev) => ({ ...prev, [key]: !prev[key], my: false }));
    }
  }

  function selectCampaignType(label: string) {
    setSelectedType((prev) => (prev === label ? null : label));
  }

  const isOutOfCampaigns = localCampaignCount <= 0;

  /** ----------------------------------------------------
   *  Submission handler
   * -------------------------------------------------- */
  function handleStartCampaign() {
    const selectedSegments = (Object.entries(segments) as [SegmentKey, boolean][]) // TS 5.5 – ensure tuple type
      .filter(([_, checked]) => checked)
      .map(([key]) => key);

const payload = {
      name,
      userId: id,
      segments: selectedSegments,
      types: selectedType ? [selectedType] : [],
      material: useCustomInfo ? "custom" : "profile",
      bio: useCustomInfo ? customBio.trim() : profileData.bio,
      filmLink: useCustomInfo ? customFilm.trim() : profileData.video,
      classYear: useCustomInfo ? customClass.trim() : profileData.grad_year,
      height: useCustomInfo ? customHeight.trim() : profileData.height,
      weight: useCustomInfo ? customWeight.trim() : profileData.weight,
    } as const;

        console.log("Attempting campaign submit with payload:", payload);

    const result = formSchema.safeParse(payload);

    if (!result.success) {
      console.error("Invalid campaign input:", result.error.format());
      alert("Invalid data: please check the form fields.");
      return;
    }

    startTransition(() => {
      createCampaign(result.data)
        .then(() => {
          setShowModal(false);
          setLocalCampaignCount((prev) => Math.max(prev - 1, 0));
          decreaseCampaignCount(id);
          // reset after success
          setSelectedType(null);
        })
        .catch((err) => {
          console.error("Failed to create campaign:", err);
          alert("Something went wrong while creating the campaign.");
        });
    });
  }

  /** ----------------------------------------------------
   *  Render helpers
   * -------------------------------------------------- */
  function renderCampaignTypeSelect() {
    return (
      <div>
        <h3 className="text-sm font-semibold text-orange-600 mb-2">Campaign Type</h3>
        {CAMPAIGN_TYPE_OPTIONS.map((label) => (
          <label
            key={label}
            className="flex items-center mb-2 text-sm bg-white rounded-md px-2 py-1 shadow-sm"
          >
            <input
  type="checkbox"
  className="mr-2 accent-orange-500 bg-white text-black focus:ring-orange-400 rounded"
  checked={selectedType === label}
  onChange={() => selectCampaignType(label)}
/>

            {label}
          </label>
        ))}
      </div>
    );
  }

  function renderMaterialSelect() {
    return (
      <div>
        <h3 className="text-sm font-semibold text-orange-600 mb-2">Campaign Material</h3>
        {[
          { label: "Use Saved Info (Profile)", isCustom: false },
          { label: "Use New Info (Custom)", isCustom: true },
        ].map(({ label, isCustom }) => (
          <label
            key={label}
            className="flex items-center mb-2 text-sm bg-white rounded-md px-2 py-1 shadow-sm"
          >
            <input
              type="checkbox"
              className="mr-2 accent-orange-500 bg-white text-black focus:ring-orange-400 rounded"
              checked={isCustom ? useCustomInfo : !useCustomInfo}
              onChange={() => setUseCustomInfo(isCustom)}
            />
            {label}
          </label>
        ))}
      </div>
    );
  }

  function renderCustomOrProfileFields() {
    return (
      <div className="mb-4 space-y-4">
        {useCustomInfo ? (
          <>
            {/* Custom Bio */}
            <div>
              <label className="block text-sm font-medium mb-1">Custom Bio</label>
              <textarea
                rows={2}
                className="w-full rounded-lg bg-white text-black placeholder:text-gray-500 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Write your custom bio..."
                value={customBio}
                onChange={(e) => setCustomBio(e.target.value)}
              />
            </div>

            {/* Custom Film */}
            <div>
              <label className="block text-sm font-medium mb-1">Custom Film Link</label>
              <input
                type="text"
                className="w-full rounded-lg bg-white text-black placeholder:text-gray-500 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Paste highlight link..."
                value={customFilm}
                onChange={(e) => setCustomFilm(e.target.value)}
              />
            </div>

            {/* Class & Ht/Wt */}
              <div>
                <label className="block text-sm font-medium mb-1">Class</label>
                <input
                  type="text"
                  className="w-full rounded-lg bg-white text-black placeholder:text-gray-500 px-4 py-2 text-sm shadow-sm"
                  placeholder="e.g. 2026"
                  value={customClass}
                  onChange={(e) => setCustomClass(e.target.value)}
                />
              </div>
                          <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium mb-1">Height</label>
                <input
                  type="text"
                  className="w-full rounded-lg bg-white text-black placeholder:text-gray-500 px-4 py-2 text-sm shadow-sm"
                  placeholder="e.g. 6'1\"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Weight</label>
                <input
                  type="text"
                  className="w-full rounded-lg bg-white text-black placeholder:text-gray-500 px-4 py-2 text-sm shadow-sm"
                  placeholder="e.g. 190 lbs"
                  value={customWeight}
                  onChange={(e) => setCustomWeight(e.target.value)}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-sm bg-gray-100 text-black rounded-lg px-4 py-3 border border-gray-200 space-y-2">
            <div>
              <strong>Bio:</strong> {profileData.bio}
            </div>
            <div>
              <strong>Film:</strong>{" "}
              <a
                href={profileData.video}
                target="_blank"
                rel="noreferrer"
                className="text-orange-600 underline"
              >
                {profileData.video}
              </a>
            </div>
            <div>
              <strong>Class:</strong> {profileData.grad_year}
            </div>
            <div>
              <strong>Height / Weight:</strong> {profileData.height} / {profileData.weight}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderSegmentSelect() {
    return (
      <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200 shadow-inner">
        <h3 className="text-sm font-semibold text-orange-500 mb-2">Campaign Target</h3>
        {(Object.entries(SEGMENT_KEYS) as [SegmentKey, string][]).map(([key, label]) => (
          <label key={key} className="flex items-center mb-2 text-sm">
            <input
              type="checkbox"
              className="mr-2 accent-orange-500"
              checked={segments[key]}
              onChange={() => toggleSegment(key)}
            />
            {label}
          </label>
        ))}
      </div>
    );
  }

  /** ----------------------------------------------------
   *  JSX output
   * -------------------------------------------------- */
  return (
    <Card className={cn("shadow-none")}>
      <div className="p-4">
        {/* Header + buttons */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {/* Campaign Button */}
            <div className="flex-col space-y-4 flex text-xs text-gray-500">
              <button
                onClick={() => setShowModal(true)}
                disabled={isOutOfCampaigns}
                className="bg-orange-500 hover:bg-orange-600 gap-2 flex text-white px-4 py-2 rounded text-sm disabled:opacity-50"
              >
                <SendIcon className="w-5 h-5 self-center" />
                Start New Campaign
              </button>
              <span>
                {localCampaignCount} remaining campaign
                {localCampaignCount !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Boost Button */}
            <div className="flex-col space-y-4 flex text-xs text-gray-500">
              <button
                onClick={() => setShowBoostModal(true)}
                className="bg-black dark:bg-white hover:bg-gray-800 gap-2 flex dark:text-black text-white px-4 py-2 rounded text-sm"
              >
                <RocketIcon className="w-5 h-5 self-center" />
                Boost on X
              </button>

              <span>1 remaining boost</span>
            </div>
          </div>
        </div>

        {/* ---------------- Modal: Start Campaign ---------------- */}
        {showModal && (
          <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="bg-white text-black p-8 rounded-2xl w-full max-w-xl relative shadow-[0_15px_30px_rgba(0,0,0,0.1)] border border-gray-100">
              <h2 className="text-2xl font-bold mb-6">Start a New Campaign</h2>

              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black hover:bg-gray-200 rounded-full p-2 transition"
              >
                ✕
              </button>

              {/* Campaign Type + Material */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {renderCampaignTypeSelect()}
                {renderMaterialSelect()}
              </div>

              {/* Custom or Profile Fields */}
              {renderCustomOrProfileFields()}

              {/* Campaign Target */}
              {renderSegmentSelect()}

              {/* Submit Button */}
              <button
                disabled={isPending || isOutOfCampaigns}
                onClick={handleStartCampaign}
                className="w-full flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                <SendIcon className="w-4 h-4 mr-2" />
                {isPending ? "Starting..." : "Start Campaign"}
              </button>
            </div>
          </div>
        )}

        {/* ---------------- Modal: Boost ---------------- */}
        {showBoostModal && (
          <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="bg-black text-white p-8 rounded-2xl w-full max-w-md relative shadow-[0_15px_30px_rgba(0,0,0,0.5)] border border-gray-800">
              {/* Header */}
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold">Boost Your Film on</h2>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://www.mrl.ims.cam.ac.uk/sites/default/files/media/x-logo.png"
                  alt="X Logo"
                  className="w-10 invert ml-2"
                />
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowBoostModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-full transition"
              >
                ✕
              </button>

              {/* Boost Type */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-orange-500 mb-2">Boost Type</h3>
                {["Custom Post", "Repost"].map((label) => {
                  const key = label.toLowerCase().includes("custom") ? "custom" : "repost";
                  return (
                    <label
                      key={label}
                      className="flex items-center mb-2 text-sm rounded-md px-3 py-2 shadow-sm"
                    >
                      <input
                        type="checkbox"
                        className="mr-2 accent-orange-500 text-black rounded"
                        checked={boostType[key as keyof typeof boostType]}
                        onChange={() =>
                          setBoostType((prev) => ({
                            ...prev,
                            [key]: !prev[key as keyof typeof boostType],
                          }))
                        }
                      />
                      {label}
                    </label>
                  );
                })}
              </div>

              {/* Boost Link Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Add Boost Content (Link)</label>
                <input
                  type="text"
                  placeholder="Add custom post film or Repost (X Post)"
                  value={boostLink}
                  onChange={(e) => setBoostLink(e.target.value)}
                  className="w-full rounded-lg bg-black placeholder:text-gray-500 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Submit Button */}
              <button
                className="w-full flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                <RocketIcon className="w-4 h-4 mr-2" />
                Boost On X
              </button>

              {/* Promo Banner */}
              <div className="mt-6 p-4 rounded-lg text-sm space-y-1 text-center shadow-sm">
                <p>
                  🚀 <strong>Get Your Film Seen</strong> by 250,000+ followers & 10,000+ College
                  Coaches!
                </p>
                <p className="font-bold text-orange-600">The Largest Player Marketing Platform</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * Custom hook to remember user's last choice (optional):
 *   Reads "customInfo" from localStorage so refreshing the page preserves the toggle.
 */
function useCustomInfoInitial(): [boolean, (v: boolean) => void] {
  const [state, setState] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("customInfo") === "true";
  });

  const update = (v: boolean) => {
    setState(v);
    if (typeof window !== "undefined") {
      localStorage.setItem("customInfo", v ? "true" : "false");
    }
  };

  return [state, update];
}
