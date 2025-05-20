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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Coach = {
  id: string;
  name: string;
  college: string;
    logoUrl: string;

  sport: string;
  email: string;
  phone: string;
};

export default function CoachModal({ coach }: { coach: Coach }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-xs">
          {coach.name}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {coach.name}
            <Badge variant="outline">{coach.sport}</Badge>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p className="my-2">College: {coach.college}</p>
            <p className="text-sm">Email: {coach.email}</p>
            <p className="text-sm">Phone: {coach.phone}</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="link" asChild>
            <Link href={`/coaches/${coach.id}`}>View Profile</Link>
          </Button>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
