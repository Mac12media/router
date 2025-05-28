"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import router from "next/router";



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
    toast.success(row.original.head_coach);
        router.push(`/coaches/${id}`);

  }}
>
  <Link href={`/coaches/${id}`} passHref>
    {id}
  </Link>
</Button>
      );
    },
  },
  
  {
  accessorKey: "school",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="School" />
  ),
  cell: ({ row }) => {
    const logoUrl = row.original.photo_url;
const college = row.getValue("school") as string;
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
    accessorKey: "head_coach",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Head Coach" />
    ),
    cell: ({ row }) => {
    const logoUrl = row.original.photo_url;
const name = row.getValue("head_coach") as string;
    return ( <Button
  variant="outline"
  size="sm"
  onClick={() => {
    toast.success(row.original.head_coach);
        router.push(`/coaches/${row.original.id}`);

  }}
>
  <Link href={`/coaches/${row.original.id}`} passHref>
    {name}
  </Link>
</Button> );
    }
  },
  {
    accessorKey: "division",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Division" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("division")}</Badge>
    ),
  },
  {
  accessorKey: "email",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Email" />
  ),
  cell: ({ row }) => (
    <span style={{ filter: "blur(5px)" }}>{row.getValue("email")}</span>
  ),
},
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => <span>{row.getValue("phone")}</span>,
  },
];
