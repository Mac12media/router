"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import router from "next/router";
import MatchCircleChart from "@/components/parts/matchcirclechart";



export const columns: ColumnDef<CoachRow>[] = [

  
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
  accessorKey: "match",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Match" />
  ),
  cell: ({ row }) => {
    // Generate a random value between 1 and 100
    const randomValue = Math.floor(Math.random() * 100) + 1;
    const randomLabel = `${randomValue}%`; // Display the random value as a percentage
    
    return <MatchCircleChart label={randomLabel} value={randomValue} max={100} />;
  },
},

];
