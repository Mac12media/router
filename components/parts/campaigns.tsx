"use client";

import { useState, useTransition } from "react";
import { SendIcon, RocketIcon } from "lucide-react";
import { createCampaignSchema as formSchema } from "@/lib/data/validations";
import { createCampaign } from "@/lib/data/endpoints";
import { createBoostSchema as boostSchema } from "@/lib/data/validations"; // Assuming you have a schema for boosting
import { createBoost } from "@/lib/data/endpoints"
import { decreaseCampaignCount, decreaseBoostCount } from "@/lib/data/users"; // Assuming you have a function to decrease boost count
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Props
 */

/**
 * UI constants
 */
const CAMPAIGN_TYPE_OPTIONS = [
  "Intro Campaign (1st Campaign)",
  "Basic Marketing Campaign",
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
  boostcount,
  profile,
}: {
  id: string;
  name: string;
  campaigncount: number;
  boostcount: number;
  profile: any;
}) {  
  /** ----------------------------------------------------
   *  Core local state
   * -------------------------------------------------- */
  const [showModal, setShowModal] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  // remaining campaign credits (local optimistic)
  const [localCampaignCount, setLocalCampaignCount] = useState(campaigncount);
  const [localBoostCount, setLocalBoostCount] = useState(boostcount);

  const profileData = {
    bio: profile.bio ?? "",
    video: String(profile.film ?? profile.video ?? ""),
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
  const [xUsername, setXUsername] = useState("");
  const [selectedBoostType, setSelectedBoostType] = useState<"custom" | "repost" | "">("");
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
  const isOutOfBoosts = localBoostCount <= 0;


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
   *  Boost Submission handler
   * -------------------------------------------------- */
  function handleBoost() {
  // Prepare the payload based on form input values
  const payload = {
    userId: id,
    xUsername,
    boostTypes: selectedBoostType, // Selected boost type, can be "Custom Post" or "Repost"
    boostLink,
  };

  // Validate the payload using createBoostSchema's safeParse method
  const result = boostSchema.safeParse(payload);

  if (!result.success) {
    // If validation fails, log the errors and show an alert to the user
    console.error("Invalid boost input:", result.error.format());
    alert("Invalid data: please check the form fields.");
    return;
  }

  // If validation succeeds, continue with the boost creation logic
  const validatedPayload = result.data;

  console.log("Attempting boost submit with payload:", validatedPayload);

  startTransition(() => {
    createBoost(validatedPayload) // Pass validated data to the createBoost API function
      .then(() => {
        alert("Boost submitted successfully!");
        setShowBoostModal(false);
        setXUsername("");
        setBoostLink("");
        setSelectedBoostType("");
        setLocalBoostCount((prev) => Math.max(prev - 1, 0)); // Decrease the local boost count
        decreaseBoostCount(id); // Decrease the boost count on the server
      })
      .catch((err) => {
        console.error("Failed to create boost:", err);
        alert("Something went wrong while boosting the film.");
      });
  });
}
  /** ----------------------------------------------------
   *  Render helpers
   * -------------------------------------------------- */
  function renderCampaignTypeSelect() {
    return (
      <div>
        <h3 className="text-sm font-semibold text-orange-500 mb-2">Campaign Type</h3>
        {CAMPAIGN_TYPE_OPTIONS.map((label) => (
          <label
            key={label}
            className="flex items-center mb-2 text-sm bg-white text-black rounded-md px-2 py-1 shadow-sm border border-gray-200 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <input
              type="checkbox"
              name="campaignType"
              className="mr-2 accent-orange-500 bg-white text-black dark:bg-zinc-900 dark:text-white focus:ring-orange-400 rounded"
              checked={selectedType === label}
              onChange={() => selectCampaignType(label)}
              required
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
        <h3 className="text-sm font-semibold text-orange-500 mb-2">Campaign Material</h3>
        {[
          { label: "Use Saved Info (Profile)", isCustom: false },
          { label: "Use New Info (Custom)", isCustom: true },
        ].map(({ label, isCustom }) => (
          <label
            key={label}
            className="flex items-center mb-2 text-sm bg-white text-black rounded-md px-2 py-1 shadow-sm border border-gray-200 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <input
              type="checkbox"
              className="mr-2 accent-orange-500 bg-white text-black dark:bg-zinc-900 dark:text-white focus:ring-orange-400 rounded"
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


           <div className="grid grid-cols-3 gap-4">

              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-900 dark:text-zinc-100">Class</label>
                <input
                  type="text"
                  className="w-full rounded-lg bg-white text-black placeholder:text-gray-500 px-4 py-2 text-sm shadow-sm border border-gray-200 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g. 2026"
                  value={customClass}
                  onChange={(e) => setCustomClass(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-900 dark:text-zinc-100">Height</label>
                <input
                  type="text"
                  className="w-full rounded-lg bg-white text-black placeholder:text-gray-500 px-4 py-2 text-sm shadow-sm border border-gray-200 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g. 6'1\"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-900 dark:text-zinc-100">Weight</label>
                <input
                  type="text"
                  className="w-full rounded-lg bg-white text-black placeholder:text-gray-500 px-4 py-2 text-sm shadow-sm border border-gray-200 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g. 190 lbs"
                  value={customWeight}
                  onChange={(e) => setCustomWeight(e.target.value)}
                />
              </div>
            </div>
            {/* Custom Bio */}

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-900 dark:text-zinc-100">Custom Bio</label>
              <textarea
                rows={2}
                className="w-full rounded-lg bg-white text-black placeholder:text-gray-500 px-4 py-2 text-sm shadow-sm border border-gray-200 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Write your custom bio..."
                value={customBio}
                onChange={(e) => setCustomBio(e.target.value)}
              />
            </div>

            {/* Custom Film */}
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-900 dark:text-zinc-100">Custom Film Link</label>
              <input
                type="text"
                className="w-full rounded-lg bg-white text-black placeholder:text-gray-500 px-4 py-2 text-sm shadow-sm border border-gray-200 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Paste highlight link..."
                value={customFilm}
                onChange={(e) => setCustomFilm(e.target.value)}
              />
            </div>

            {/* Class & Ht/Wt */}
                                     
          </>
        ) : (
          <div className="text-sm bg-gray-100 text-black rounded-lg px-4 py-3 border border-gray-200 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 space-y-2">
            <div>
              <strong>Bio:</strong> {profileData.bio || "No bio added"}
            </div>
           <div>
  <strong>Film:</strong>{" "}
  {profileData.video ? (
    <a
      href={profileData.video}
      target="_blank"
      rel="noreferrer"
      className="text-orange-600 dark:text-orange-400 underline"
    >
      {profileData.video.length > 30
        ? profileData.video.slice(0, 30) + "..."
        : profileData.video}
    </a>
  ) : (
    <span className="text-zinc-500">No film link added</span>
  )}
</div>

            <div>
              <strong className="dark:text-white">Class:</strong> {profileData.grad_year || "Not added"}
            </div>
            <div>
              <strong className="dark:text-white">Height / Weight:</strong> {profileData.height || "Not added"} / {profileData.weight || "Not added"}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderSegmentSelect() {
    return (
      <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200 dark:border-white/10 dark:bg-zinc-900 shadow-inner">
        <h3 className="text-sm font-semibold text-orange-500 mb-2">Campaign Target</h3>
        {(Object.entries(SEGMENT_KEYS) as [SegmentKey, string][]).map(([key, label]) => (
          <label key={key} className="flex items-center mb-2 text-sm text-zinc-900 dark:text-zinc-100">
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


  function renderBoostForm() {
    return (
      <div>

               {/* X Username Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-zinc-900 dark:text-zinc-100">X Username</label>
          <input
            type="text"
            placeholder="@yourhandle"
            value={xUsername}
            onChange={(e) => setXUsername(e.target.value)}
            className="w-full rounded-lg bg-white text-black placeholder:text-gray-500 px-4 py-2 text-sm shadow-sm border border-gray-200 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        
        {/* Boost Type (Radio Buttons for Single Selection) */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-orange-500 mb-2">Boost Type</h3>
          {["Custom Post", "Repost"].map((label) => {
            const key = label.toLowerCase().includes("custom") ? "custom" : "repost";
            return (
              <label
                key={label}
                className="flex items-center mb-2 text-sm rounded-md px-3 py-2 shadow-sm cursor-pointer bg-white text-black border border-gray-200 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
              >
                <input
                  type="radio"
                  name="boostType"
                  className="mr-2 accent-orange-500 text-black"
                  checked={selectedBoostType === key}
                  onChange={() => setSelectedBoostType(key)}
                />
                {label}
              </label>
            );
          })}
        </div>

        {/* Boost Link Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-zinc-900 dark:text-zinc-100">Add Boost Content (Link)</label>
          <input
            type="text"
            placeholder="Add custom post film or Repost (X Post)"
            value={boostLink}
            onChange={(e) => setBoostLink(e.target.value)}
            className="w-full rounded-lg bg-white text-black placeholder:text-gray-500 px-4 py-2 text-sm shadow-sm border border-gray-200 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

 

        {/* Submit Button */}
        <button
          onClick={handleBoost}
          className="w-full flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg text-sm font-medium transition disabled:opacity-50"
          disabled={!selectedBoostType || !boostLink || !xUsername || isOutOfBoosts}
        >
          <RocketIcon className="w-4 h-4 mr-2" />
          Boost On X
        </button>

        {/* Promo Banner */}
      <div className="mt-6 p-4 rounded-lg text-sm space-y-1 text-center shadow-sm text-black bg-gray-100 border border-gray-200 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100">
        <p>
          <strong className="dark:text-white">Get Your Film Seen</strong> by 250,000+ followers & 10,000+ College Coaches!
        </p>
        <p className="font-bold text-orange-600 dark:text-orange-400">The Largest Player Marketing Platform</p>
      </div>

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
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-2">
            {/* Campaign Button */}
            <div className="flex w-full flex-col gap-2 text-xs text-gray-500 dark:text-zinc-400 sm:flex-1">
              <button
                onClick={() => setShowModal(true)}
                className="flex w-full items-center justify-center gap-2 rounded border border-orange-500/40 bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:border-orange-400 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              >
                <SendIcon className="w-5 h-5 self-center" />
                Start New Campaign
              </button>
              <span className="text-gray-500 dark:text-zinc-400">
                {localCampaignCount} remaining campaign
                {localCampaignCount !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Boost Button */}
            <div className="flex w-full flex-col gap-2 text-xs text-gray-500 sm:flex-1">
              <button
                onClick={() => setShowBoostModal(true)}
                className="flex w-full items-center justify-center gap-2 rounded bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 dark:bg-white dark:text-black"
              >
                <RocketIcon className="w-5 h-5 self-center" />
                Boost on X
              </button>
              <span>{localBoostCount} remaining boost{localBoostCount !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="z-[9999] max-h-[92vh] w-[calc(100vw-2rem)] max-w-5xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 text-black dark:border-white/10 dark:bg-[#0b0b0d] dark:text-zinc-100 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:p-6 md:p-8 [&>button]:text-gray-500 [&>button:hover]:text-black dark:[&>button]:text-zinc-400 dark:[&>button:hover]:text-white">
            <DialogHeader>
              <DialogTitle className="mb-2 text-2xl font-bold text-black dark:text-white">
                Start a New Campaign
              </DialogTitle>
            </DialogHeader>

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
                className="flex w-full items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500 px-5 py-3 text-sm font-bold !text-white shadow-sm transition hover:border-orange-400 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:!text-gray-400 dark:disabled:border-zinc-700 dark:disabled:bg-zinc-800 dark:disabled:!text-zinc-500 disabled:opacity-100"
              >
                <SendIcon className="w-4 h-4 mr-2 text-current" />
                <span className="text-current">
                  {isPending ? "Starting..." : "Start Campaign"}
                </span>
              </button>
              {isOutOfCampaigns && (
                <p className="mt-2 text-center text-xs text-orange-600 dark:text-orange-400">
                  You’ve used all your campaigns.
                </p>
              )}
          </DialogContent>
        </Dialog>

        {/* ---------------- Modal: Boost ---------------- */}
        <Dialog open={showBoostModal} onOpenChange={setShowBoostModal}>
          <DialogContent className="z-[9999] max-h-[92vh] w-[calc(100vw-2rem)] max-w-3xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 text-black dark:border-white/10 dark:bg-[#0b0b0d] dark:text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:p-6 md:p-8 [&>button]:text-gray-500 [&>button:hover]:text-black dark:[&>button]:text-zinc-400 dark:[&>button:hover]:text-white">
            <DialogHeader>
              <DialogTitle className="mb-2 text-2xl font-bold text-black dark:text-white">
                Boost Your Film on X
              </DialogTitle>
            </DialogHeader>

              {/* Boost Form */}
              {renderBoostForm()}
          </DialogContent>
        </Dialog>
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
