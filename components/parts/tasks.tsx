"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CircleAlert } from "lucide-react";

// Define the required fields and display labels
const requiredFields: { key: string; label: string }[] = [
  { key: "position", label: "Position" },
  { key: "sport", label: "Sport" },
  { key: "state", label: "State" },
  { key: "city", label: "City" },
  { key: "video", label: "Highlight Video" },
  { key: "bio", label: "Bio" },
  { key: "test_score", label: "Test Score" },
];

type UserProfile = Record<string, string | null | undefined>;

export const RecruitingTasks = ({ user }: { user?: UserProfile }) => {
  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recruiting Tasks</CardTitle>
          <CardDescription>Loading user profile...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Find first missing field
  const missingField = requiredFields.find(
    (field) => !user[field.key] || user[field.key]?.trim() === ""
  );

  return (
    <Card className="w-full flex flex-col">
      <CardHeader className="mb-4 border-b">
        <CardTitle>Recruiting Tasks</CardTitle>
        <CardDescription>Complete your recruiting profile step-by-step.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {missingField ? (
          <div className="grid gap-3 p-4 border rounded-sm bg-muted/25">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Add your {missingField.label}</p>
              <Badge variant="default">Incomplete</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              This field helps recruiters better understand your profile.
            </p>
            <div className="flex items-center text-sm gap-2 text-[#FF7200]">
  <CircleAlert className="h-4 w-4" />
  <span>{missingField.label} is missing from your profile</span>
</div>

            <Link
              href="/profile"
              className="text-blue-600 text-sm underline hover:text-blue-800"
            >
              Go to Profile Page →
            </Link>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            ✅ All required profile fields are completed. Great work!
          </p>
        )}
      </CardContent>
    </Card>
  );
};
