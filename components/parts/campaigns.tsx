'use client';

import { useState, useTransition } from "react";
import { SendIcon, RocketIcon } from "lucide-react";
import { createCampaignSchema as formSchema } from "@/lib/data/validations";
import { createCampaign } from "@/lib/data/endpoints";
import { decreaseCampaignCount } from "@/lib/data/users";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

export function Campaigns({
  id,
  name,
  campaigncount,
}: {
  id: string;
  name: string;
  campaigncount: number;
}) {
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [localCampaignCount, setLocalCampaignCount] = useState(campaigncount);
const [showBoostModal, setShowBoostModal] = useState(false);
const [boostType, setBoostType] = useState({ custom: false, repost: true });
const [boostLink, setBoostLink] = useState("");

  const [segments, setSegments] = useState({
    fbs: true,
    fcs: true,
    d2: true,
    d3: true,
  });

  const toggle = (key: keyof typeof segments) =>
    setSegments((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleStartCampaign = () => {
    const selectedSegments = Object.entries(segments)
      .filter(([_, checked]) => checked)
      .map(([key]) => key);

    const result = formSchema.safeParse({
      name,
      segments: selectedSegments,
      userId: id,
    });

    if (!result.success) {
      console.error("Invalid campaign input:", result.error.format());
      alert("Invalid data: please check segments or name.");
      return;
    }

    startTransition(() => {
      createCampaign(result.data)
        .then(() => {
          setShowModal(false);
          setLocalCampaignCount((prev) => Math.max(prev - 1, 0));
          decreaseCampaignCount(id);
        })
        .catch((err) => {
          console.error("Failed to create campaign:", err);
          alert("Something went wrong while creating the campaign.");
        });
    });
  };

  const isOutOfCampaigns = localCampaignCount <= 0;

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
        <div>
          <h3 className="text-sm font-semibold text-orange-600 mb-2">Campaign Type</h3>
          {["Intro Campaign (1st Campaign)", "Basic Marketing Campaign", "Important Announcement"].map((label, idx) => (
           <label key={idx} className="flex items-center mb-2 text-sm bg-white rounded-md px-2 py-1 shadow-sm">
  <input
    type="checkbox"
    className="mr-2 accent-orange-500 bg-white text-black focus:ring-orange-400 rounded"
  />
  {label}
</label>

          ))}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-orange-600 mb-2">Campaign Material</h3>
          {["Use Saved Info (Profile)", "Use New Info (Custom)"].map((label, idx) => (
            <label key={idx} className="flex items-center mb-2 text-sm bg-white rounded-md px-2 py-1 shadow-sm">
  <input
    type="checkbox"
    className="mr-2 accent-orange-500 bg-white text-black focus:ring-orange-400 rounded"
  />
  {label}
</label>

          ))}
        </div>
      </div>

      {/* Custom Message */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Custom Bio/Material</label>
        <textarea
          rows={3}
          placeholder="Add your personalized message..."
          className="w-full rounded-lg bg-white text-black placeholder:text-gray-500 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Film Link */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Add Custom Film Link</label>
        <input
          type="text"
          placeholder="Add film link..."
          className="w-full rounded-lg bg-white text-black placeholder:text-gray-500 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Campaign Target */}
      <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200 shadow-inner">
        <h3 className="text-sm font-semibold text-orange-500 mb-2">Campaign Target</h3>
        {["NCAA D1 (FBS + FCS)", "NCAA D2", "NCAA D3 & NAIA", "Junior College", "My Target Programs Only"].map((label, idx) => (
          <label key={idx} className="flex items-center mb-2 text-sm">
            <input type="checkbox" className="mr-2 accent-orange-500" />
            {label}
          </label>
        ))}
      </div>

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
{showBoostModal && (
  <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center px-4">
    <div className="bg-black text-white p-8 rounded-2xl w-full max-w-md relative shadow-[0_15px_30px_rgba(0,0,0,0.5)] border border-gray-800">
      {/* Header */}
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold">Boost Your Film on</h2>
        <img
          src="https://www.mrl.ims.cam.ac.uk/sites/default/files/media/x-logo.png"
          alt="X Logo"
          className="w-10 invert"
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
        {["Custom Post", "Repost"].map((label, idx) => {
          const key = label.toLowerCase().includes("custom") ? "custom" : "repost";
          return (
            <label
              key={idx}
              className="flex items-center mb-2 text-sm  rounded-md px-3 py-2 shadow-sm"
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
        <p>🚀 <strong>Get Your Film Seen</strong> by 250,000+ followers & 10,000+ College Coaches!</p>
        <p className="font-bold text-orange-600">The Largest Player Marketing Platform</p>
      </div>
    </div>
  </div>
)}


      </div>
    </Card>
  );
}
