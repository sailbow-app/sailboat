"use client";

import { Ellipsis } from "lucide-react";
import { type Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type CrewMember } from "@/lib/common-types";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function CrewMemberActions({
  row,
}: DataTableRowActionsProps<CrewMember>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>Change Role</DropdownMenuItem>
        <DropdownMenuItem>Kick</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
