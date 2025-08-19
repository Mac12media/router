"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import router from "next/router";
import MatchCircleChart from "@/components/parts/matchcirclechart";



export const columns: ColumnDef<BBCoachRow>[] = [

  
  {
  accessorKey: "school",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="School" />
  ),
  cell: ({ row }) => {
    const logoUrl = row.original.image;
const college = row.getValue("school") as string;
    return (
      <div className="flex items-center gap-8">
        {logoUrl && (
          <img src={logoUrl} alt={college} className="h-10 w-10 rounded" />
        )}
        <span>{college}</span>
      </div>
    );
  },
},
{
    accessorKey: "m_head_coach",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Boys Head Coach" />
    ),
    cell: ({ row }) => {
    const logoUrl = row.original.image;
const name = row.getValue("m_head_coach") as string;
    return ( <Button
  variant="outline"
  className="bg-[#FF7200] text-white"
  size="sm"
  onClick={() => {
    toast.success(row.original.m_head_coach);
        router.push(`/basketball-programs/${row.original.id}`);

  }}
>
  <Link href={`/basketball-programs/${row.original.id}`} passHref>
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
  cell: () => {
    // Generate a random string of 1 to 5 letters
    const randomLetters = Math.random().toString(36).substring(2, 7);
    const dummyEmail = `${randomLetters}@example.com`;

    return (
      <span 
        style={{ 
          filter: "blur(5px)", 
          userSelect: "none", 
          pointerEvents: "none" 
        }}
      >
        {dummyEmail}
      </span>
    );
  },
},


];
