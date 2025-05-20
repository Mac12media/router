"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";


type CoachRow = {
  id: string;
  name: string;
  college: string;
    logoUrl: string;

  sport: string;
  email: string;
  phone: string;
};

export const columns: ColumnDef<CoachRow>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const id: string = row.getValue("id");
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(id);
            toast.success("ID copied");
          }}
        >
                   <Link href={`/coaches/${id}`}>{id}</Link>

        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
  {
  accessorKey: "college",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="College" />
  ),
  cell: ({ row }) => {
    const logoUrl = row.original.logoUrl;
const college = row.getValue("college") as string;
    return (
      <div className="flex items-center gap-2">
        {logoUrl && (
          <img src={logoUrl} alt={college} className="h-10 w-10 rounded" />
        )}
        <span>{college}</span>
      </div>
    );
  },
},
  {
    accessorKey: "sport",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sport" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("sport")}</Badge>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <span>{row.getValue("email")}</span>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => <span>{row.getValue("phone")}</span>,
  },
];
