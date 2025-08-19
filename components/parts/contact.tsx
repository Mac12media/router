// ContactButton.tsx
"use client";

export function ContactButton({ email }: { email: string }) {
  return (
    <button
      onClick={() => (window.location.href = `mailto:${email}`)}
      className="bg-black text-white text-sm font-semibold px-6 py-2 rounded-full shadow-md hover:bg-gray-900 transition"
    >
      Contact Me
    </button>
  );
}
