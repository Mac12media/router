"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ClipboardList } from "lucide-react"; // shadcn/ui icon
import { Button } from "react-day-picker";

interface CoachNotesProps {
  notes: string;
}

const extractLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <Link
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FF5722] underline hover:text-[#FF9800] transition-colors break-all"
        >
          {part}
        </Link>
      );
    }
    return part;
  });
};

export const CoachNotes: React.FC<CoachNotesProps> = ({ notes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const previewText =
    notes.length > 150 ? notes.slice(0, 150).trim() + "..." : notes;

  // Split into paragraphs
  const paragraphs = notes.split(/\n+/).map((para, idx) => (
    <p key={idx} className="whitespace-pre-wrap">
      {extractLinks(para)}
    </p>
  ));

  return (
    <>
      {/* Preview Card */}
      <div
        onClick={() => setIsOpen(true)}
        className="mt-6 p-6 bg-white dark:bg-card dark:text-gray-200 shadow-lg rounded-lg border-l-4 border-[#FF7200] dark:border-[#FF7200] cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-transform duration-200"
      >
        <div className="flex items-center space-x-3 mb-4">
          {/* Clipboard icon */}
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF7200] to-[#FF2D00] text-white">
            <ClipboardList className="w-6 h-6" />
          </div>
          <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Campaign Notes
          </p>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300">{previewText}</p>
        {notes.length > 150 && (
          <p className="text-sm text-[#FF7200] mt-2">Click to read more</p>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-black dark:text-gray-100 rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative animate-[fadeIn_0.2s_ease-out] transform scale-95 animate-[scaleUp_0.2s_ease-out]"
          >
            {/* Close Button */}
            

            {/* Comment-style Header */}
            <div className="flex items-center justify-between space-x-4 mb-6 ">
              <div className="flex items-center justify-betwen space-x-4 mb-6">
 
              <img
                src="/coach-al.jpg" // 🔹 Replace with actual avatar image
                alt="Coach"
                width={48}
                height={48}
                className="rounded-full border border-gray-300 dark:border-gray-600"
              />
              <div>
                <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                  Coach A
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Recruiting Cordinator
                </p>
                   

              </div>
                           </div>
<div className="flex items-center justify-between space-x-4 mb-6 " >
<button   onClick={() => window.location.href = "mailto:exporecruits1@gmail.com"}
 className="bg-[#FF7200] text-white text-sm font-semibold px-6 py-2 rounded-full shadow-md hover:bg-gray-900 transition">
      Contact Me

    </button>
     <button
              onClick={() => setIsOpen(false)}
              className=" w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              ✕
            </button>
            </div>
            </div>

            {/* Comment Bubble */}
            <div className="bg-gray-100 dark:bg-card rounded-2xl p-5 text-lg text-gray-800 dark:text-gray-200 leading-relaxed space-y-4 max-h-[65vh] overflow-y-auto">
              {paragraphs}
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleUp {
          from {
            transform: scale(0.95);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};
