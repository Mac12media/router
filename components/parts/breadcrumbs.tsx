"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Icon from "@/public/expo.avif";
import { useRouter } from "next/navigation"; // ✅ App Router API
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import FootballIcon from "@/public/football.png";
import BasketballIcon from "@/public/basketball.png";

export const Breadcrumbs = ({
  pageName,
  isLoading,
}: {
  pageName?: string;
  isLoading?: boolean;
}) => {
  const router = useRouter();

  const handleSwitch = (value: string) => {
    if (value === "Football Programs") {
      router.push("/football-programs");
    } else if (value === "Basketball Programs") {
      router.push("/basketball-programs");
    }
  };

  const isProgramPage =
    pageName === "Football Programs" || pageName === "Basketball Programs";

  return (
    <Breadcrumb className="h-[67.63px] bg-muted/50 rounded-lg border flex items-center justify-between p-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
       <BreadcrumbPage
  className={
    isProgramPage
      ? "border bg-background rounded-sm" // 👈 no px-2 py-1 for Football/Basketball
      : "px-2 py-1 border bg-background rounded-sm" // 👈 keep padding for normal pages
  }
>
  {isLoading ? (
    <Skeleton className="h-5 w-20" />
  ) : isProgramPage ? (
    <Select value={pageName} onValueChange={handleSwitch}>
      <SelectTrigger className="w-[210px]">
        <SelectValue placeholder="Select program" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Football Programs">
          <div className="flex flex-row items-center gap-2">
            <span>Football Programs</span>
            <Image
              src={FootballIcon}
              alt="Football icon"
              width={20}
              height={20}
              className="opacity-70 max-w-[20px] group-hover:opacity-100 transition-all"
              style={{ inlineSize: "max-content" }}
            />
          </div>
        </SelectItem>

        <SelectItem value="Basketball Programs">
          <div className="flex flex-row items-center gap-2">
            <span>Basketball Programs</span>
            <Image
              src={BasketballIcon}
              alt="Basketball icon"
              width={20}
              height={20}
              className="opacity-70 max-w-[20px] group-hover:opacity-100 transition-all"
              style={{ inlineSize: "max-content" }}
            />
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  ) : (
    <BreadcrumbLink>{pageName || "Dashboard"}</BreadcrumbLink>
  )}
</BreadcrumbPage>

      </BreadcrumbList>
      <Image
        className="hover:animate-spin dark:invert"
        src={Icon}
        width={24}
        height={24}
        alt="Router.so Icon"
      />
    </Breadcrumb>
  );
};
