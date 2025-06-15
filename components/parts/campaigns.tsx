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
              <button className="bg-black dark:bg-white hover:bg-gray-800 gap-2 flex dark:text-black text-white px-4 py-2 rounded text-sm">
                <RocketIcon className="w-5 h-5 self-center" />
                Boost on X
              </button>
              <span>1 remaining boost</span>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-black text-white p-6 rounded-lg w-80 relative">
              <h2 className="text-lg font-semibold mb-4">My Campaign</h2>

              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Segment Checkboxes */}
              <div className="space-y-2">
                {(["fbs", "fcs", "d2", "d3"] as const).map((key) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={segments[key]}
                      onChange={() => toggle(key)}
                      className="mr-2 h-4 w-4 accent-orange-500 focus:ring-orange-500"
                    />
                    {key.toUpperCase()}
                  </label>
                ))}
              </div>

              <button
                disabled={isPending || isOutOfCampaigns}
                onClick={handleStartCampaign}
                className="mt-6 w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded disabled:opacity-60"
              >
                <span>{isPending ? "Starting..." : "Start Campaign"}</span>
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
