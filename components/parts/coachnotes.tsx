"use client";
import React, { useState } from "react";
import Link from "next/link";

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
          className="text-[#FF5722] underline hover:text-[#FF9800] transition-colors"
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

  return (
    <>
      {/* Preview Card */}
      <div
        onClick={() => setIsOpen(true)}
        className="mt-6 p-6 bg-white dark:bg-card dark:text-gray-200 shadow-lg rounded-lg border-l-4 border-[#FF7200] dark:border-[#FF7200] cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-transform duration-200"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF7200] to-[#FF2D00] text-white flex items-center justify-center text-xl font-semibold">
            C
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Coach
            </p>
          </div>
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
            className="bg-white dark:bg-[#262626] dark:text-gray-100 rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative animate-[fadeIn_0.2s_ease-out] transform scale-95 animate-[scaleUp_0.2s_ease-out]"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold text-[#FF7200] mb-6 border-b border-gray-200 dark:border-gray-600 pb-3">
              Coach Notes
            </h2>

            {/* Content */}
            <div className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-3 max-h-[75vh] overflow-y-auto">
              {extractLinks(notes)}
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
