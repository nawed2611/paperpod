"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { LinkIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { Checkbox } from "../ui/checkbox";

export type Papers = {
  id: string;
  userId: string | null;
  key: string;
  name: string;
  uploadStatus: "PENDING" | "PROCESSING" | "FAILED" | "SUCCESS";
  url: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Papers>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    // enableSorting: false,
    // enableHiding: false,
  },
  {
    accessorKey: "name",
    // header: ({ column }) => {
    //   return (
    //     <Button
    //       variant="ghost"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //     >
    //       Paper Name
    //       <ArrowUpDown className="ml-2 size-4" />
    //     </Button>
    //   );
    // },
    header: "Name",
    cell: ({ row }) => {
      const filename: string = row.getValue("name");
      const filenameWithoutExtension = filename?.replace(".pdf", "");

      return <div>{filenameWithoutExtension}</div>;
    },
  },
  {
    accessorKey: "uploadStatus",
    header: "Status",
    cell: ({ row }) => (
      <div
        className={cn(
          "inline-flex items-center text-xs capitalize",
          row.getValue("uploadStatus") === "SUCCESS" &&
            "rounded-3xl bg-green-100 py-0.5 pl-1 pr-3 text-green-600",
          row.getValue("uploadStatus") === "PENDING" &&
            "rounded-3xl bg-gray-200 py-0.5 pl-1 pr-3 text-gray-500",
          row.getValue("uploadStatus") === "FAILED" &&
            "rounded-3xl bg-red-100 py-0.5 pl-1 pr-3 text-red-500"
        )}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.875 7.5C9.875 8.81168 8.81168 9.875 7.5 9.875C6.18832 9.875 5.125 8.81168 5.125 7.5C5.125 6.18832 6.18832 5.125 7.5 5.125C8.81168 5.125 9.875 6.18832 9.875 7.5Z"
            fill="currentColor"
          ></path>
        </svg>
        {row.getValue("uploadStatus")}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div>{format(new Date(row.getValue("createdAt")), "dd MMM yyyy")}</div>
    ),
  },
  // {
  //   accessorKey: "activityGenerated",
  //   header: "Activity Generated",
  //   cell: ({ row }) => <div>{row.getValue("activityGenerated")}</div>,
  // },
  // {
  //   accessorKey: "feedbackGenerated",
  //   header: "Feedback Generated",
  //   cell: ({ row }) => <div>{row.getValue("feedbackGenerated")}</div>,
  // },
  // {
  //   accessorKey: "conceptSimplifierGenerated",
  //   header: "Concept Simplifier",
  //   cell: ({ row }) => <div>{row.getValue("conceptSimplifierGenerated")}</div>,
  // },

  {
    accessorKey: "id",
    header: "Visit",
    cell: ({ row }) => (
      <Button asChild variant="ghost" className="size-8 p-0">
        <Link href={`/upload/${row.getValue("id")}`}>
          <LinkIcon className="size-4" />
        </Link>
      </Button>
    ),
  },
];
