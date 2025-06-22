"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CampaignModal({
  name,
  date,
  status,
  id,
}: {
  name: string;
  date: Date;
  status: "active" | "archived" | "paused" | string;
  id: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-xs">
          {name}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            Campaign Details
            <Badge variant={status === "active" ? "outline" : "secondary"}>
              {status}
            </Badge>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p className="my-2">
              Created at <span>{date.toUTCString()}</span>
            </p>
            <div className="text-xs p-6 border font-mono bg-muted rounded-lg mt-4">
              {JSON.stringify({ name, status, id }, null, 2)}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="link" asChild>
            <Link href={`/campaigns/${id}`}>View Campaign</Link>
          </Button>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
