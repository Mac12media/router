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
import { MailIcon } from "lucide-react";

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
        <Button variant="link" className="h-auto px-0 text-sm" size="sm">
          <MailIcon className="mr-2 h-4 w-4 text-orange-500" />
          <span>Email Campaign</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            Campaign Details
            <Badge
              className={status === "started" ? "bg-orange-500 text-white" : ""}
              variant={status === "active" ? "outline" : "secondary"}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p className="my-2">
                Created at <span>{new Date(date).toUTCString()}</span>
              </p>
              <div className="mt-4 rounded-lg border bg-muted p-6 font-mono text-xs">
                {JSON.stringify({ name, status, id }, null, 2)}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="link" asChild>
            <Link href={`/campaignss/${id}`}>View Campaign</Link>
          </Button>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
