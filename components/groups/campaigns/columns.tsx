"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/header";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MailIcon } from "lucide-react"; // or any email icon you prefer

import { InfoCircledIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";


export const columns: ColumnDef<CampaignRow>[] = [
{
  accessorKey: "name",
  header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
  cell: ({ row }) => {
    return (
      <Button asChild variant="link" className="px-0 text-sm" size="sm">
        <Link href={`/campaigns/${row.getValue("id")}`} className="flex items-center space-x-2">
          <MailIcon className="text-orange-500 w-4 h-4" />
          <span>Email Campaign</span>
        </Link>
      </Button>
    );
  },
  filterFn: (row, id, value) => {
    return value.includes(row.getValue(id));
  },
},
{
  accessorKey: "status",
  header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
  cell: ({ row }) => {
    const status: string = row.getValue("status");
    const isPending = status === "started";

    return (
      <Badge
        className={isPending ? "bg-orange-500 text-white" : ""}
        variant={isPending ? "default" : "secondary"}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  },
  filterFn: (row, id, value) => {
    return value.includes(row.getValue(id));
  },
},
  {
    accessorKey: "segments",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Segments" />,
    cell: ({ row }) => {
      const segments: string[] = row.getValue("segments");
      return (
        <div className="flex flex-wrap gap-1">
          {segments.map((segment, i) => (
            <Badge key={i} variant="secondary">
              {segment}
            </Badge>
          ))}
        </div>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const createdAt: Date = row.getValue("createdAt");
      const date = new Date(createdAt);
      return (
        <p className="text-xs">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      );
    },
  },
  
];
