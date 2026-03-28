"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PostsSportSelectProps = {
  sports: string[];
  value: string;
};

export function PostsSportSelect({
  sports,
  value,
}: PostsSportSelectProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleValueChange = (nextValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sport", nextValue);

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="mb-2 h-auto w-auto gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur sm:mb-4 sm:px-4 sm:py-1.5 sm:text-[10px] sm:tracking-[0.28em]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sports.map((sport) => (
          <SelectItem key={sport} value={sport}>
            {sport}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
