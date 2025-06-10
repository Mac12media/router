'use client';

import { useState } from 'react';
import { SendIcon, RocketIcon } from 'lucide-react';
import { Activity as CampaignChart } from '@/components/dashboard/activity';
import { DataTable } from '@/components/groups/logs/data-table';
import { columns } from '@/components/groups/logs/columns';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';

export function Campaigns() {
  const [showModal, setShowModal] = useState(false);
  const [segments, setSegments] = useState({
    fbs: true,
    fcs: true,
    d2: true,
    d3: true,
  });

  const toggle = (key: keyof typeof segments) =>
    setSegments((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
        <Card className={cn("shadow-none")}>

    <div className=" p-4">
      {/* Header + buttons */}
      <div className="flex items-center justify-between">
        
       <div className="flex space-x-2">
              <div className="flex-col space-y-4 flex text-xs text-gray-500">

          <button
            onClick={() => setShowModal(true)}
            className="bg-orange-500 hover:bg-orange-600 gap-2 flex text-white px-4 py-2 rounded text-sm truncate whitespace-nowrap"
          > <SendIcon className="w-5 h-5 self-center" />
            Start New Campaign

          </button>
                  <span>1 remaining campaign</span>
      </div>

      <div className="flex-col space-y-4 flex  text-xs text-gray-500">

          <button className="bg-black dark:bg-white hover:bg-gray-800 gap-2 flex dark:text-black text-white px-4 py-2 rounded text-sm truncate whitespace-nowrap">
            <RocketIcon className="w-5 h-5 self-center" />
            Boost on X
            
          </button>
                  <span>1 remaining boost</span>

                    </div>

        </div>
      </div>

     


    
      {/* Popup Modal */}
      {showModal && (
<div className="fixed inset-0 bg-black/75 flex items-center justify-center">
          <div className="bg-black text-white p-6 rounded-lg w-80 relative"> {/* Added 'relative' here */}
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
            {/* End Close Button */}

            <div className="space-y-2">
              {([
                ['fbs', 'FBS'],
                ['fcs', 'FCS'],
                ['d2', 'Division II'],
                ['d3', 'Division III'],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center">
                 <input
  type="checkbox"
  checked={segments[key]}
  onChange={() => toggle(key)}
  className="mr-2 h-4 w-4 accent-orange-500 focus:ring-orange-500"
/>
{label}

                </label>
              ))}
            </div>
            <button
              onClick={() => {
                // TODO: wire up real "start campaign" logic
                setShowModal(false);
              }}
              className="mt-6 w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded"
            >
              <span>Start Campaign</span>
              <SendIcon className="w-5 self-center h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
    </Card>
  );
}
