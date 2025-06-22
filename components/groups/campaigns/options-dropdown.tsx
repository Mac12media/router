"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import { useAction } from "next-safe-action/hooks";
import { parseActionError } from "@/lib/data/safe-action";
import { toast } from "sonner";

export default function OptionsDropdown({ id }: { id: string }) {
 

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-md p-2">
          <MoreHorizontal />
          <span className="sr-only">Open options</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="sr-only">Options</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setShowDeleteAlert(true)}>
            Delete Campaign
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              campaign from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
           
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
