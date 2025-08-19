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
    value: "NCAA D1",
    label: "Division I",
    icon: CircleCheck,
  },
  {
    value: "NCAA D2",
    label: "Division II",
    icon: CircleX,
  },

   {
    value: "D3",
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

        <Input
          placeholder="Search by coach..."
          value={(table.getColumn("m_head_coach")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("m_head_coach")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
         {table.getColumn("division") && (
                  <DataTableFacetedFilter
                    column={table.getColumn("division")}
                    title="Divisions"
                    options={divisionTypeFilter}
                  />
                )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
