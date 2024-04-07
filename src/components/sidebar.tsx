"use client";

import Link from "next/link";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";
import { PilcrowIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";

import NavLinks from "./navlinks";
import { Separator } from "./ui/separator";

export default function Sidebar({ user }: { user: KindeUser }) {
  return (
    <div
      className={cn(
        "group fixed inset-y-0 left-0 z-[100] h-full w-16 overflow-hidden border border-r-2 border-border bg-background drop-shadow-lg transition-all duration-200 ease-in-out hover:w-52 dark:shadow-md dark:shadow-muted"
      )}
    >
      <div className="flex items-center pt-4">
        <Link
          href="/"
          className="mx-[1.125rem] flex cursor-pointer flex-row
            items-center space-x-1"
        >
          {/* <PilcrowIcon className="size-7 shrink-0" strokeWidth={2.5} /> */}
          <span className="hidden bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text font-sans text-2xl font-semibold leading-6 tracking-tighter text-transparent group-hover:block">
            PaperPod
          </span>
        </Link>
      </div>
      <Separator className="m-4 w-auto" />

      <NavLinks user={user} />
    </div>
  );
}
