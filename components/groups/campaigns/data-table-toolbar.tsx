"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { CircleCheck, CircleX } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

const divisionTypeFilter = [
  {
    value: "NCAA Division I",
    label: "Division I",
    icon: CircleCheck,
  },
  {
    value: "NCAA Division II",
    label: "Division II",
    icon: CircleX,
  },

   {
    value: "NCAA Division III",
    label: "Division III",
    icon: CircleX,
  },
    {
    value: "Junior College",
    label: "Junior College",
    icon: CircleX,
  },

  {
    value: "NAIA",
    label: "NAIA",
    icon: CircleX,
  },
];

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        

        {table.getColumn("school") && (
          <Input
            placeholder="Filter by school..."
            value={(table.getColumn("school")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("school")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}

       
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
