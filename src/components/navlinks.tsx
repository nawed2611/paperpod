import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  KindeUser,
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { MoonIcon } from "@radix-ui/react-icons";
import {
  ArrowUpRightSquare,
  Bolt,
  CreditCard,
  Gem,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mic,
  Moon,
  Search,
  Sun,
  SunMedium,
  Upload,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface NavLinksProps {
  user: KindeUser;
}

export default function NavLinks({ user }: NavLinksProps) {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  return (
    <>
      {user ? (
        <>
          <div className="space-y-2">
            <div className="flex items-center">
              <Link
                href="/search"
                className={cn(
                  "mx-3.5 flex w-48 flex-row items-center space-x-2 rounded-md px-2 py-1.5",
                  pathname.startsWith("/search")
                    ? "dark:bg-gradient-to-r dark:from-green-700 dark:to-blue-400"
                    : "hover:bg-muted"
                )}
              >
                <Search className="size-5 shrink-0" strokeWidth={1.5} />
                <span className="hidden text-sm group-hover:block">Search</span>
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                href="/upload"
                className={cn(
                  "mx-3.5 flex w-48 flex-row items-center space-x-2 rounded-md px-2 py-1.5",
                  pathname.startsWith("/upload")
                    ? "dark:bg-gradient-to-r dark:from-green-700 dark:to-blue-400"
                    : "hover:bg-muted"
                )}
              >
                <Upload className="size-5 shrink-0" strokeWidth={1.5} />
                <span className="hidden text-sm group-hover:block">Upload</span>
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                href="/ask"
                className={cn(
                  "mx-3.5 flex w-48 flex-row items-center space-x-2 rounded-md px-2 py-1.5",
                  pathname === "/ask" ? "dark:bg-gradient-to-r dark:from-green-700 dark:to-blue-400" : "hover:bg-muted"
                )}
              >
                <Bolt className="size-5 shrink-0" strokeWidth={1.5} />
                <span className="hidden text-sm group-hover:block">Ask</span>
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                href="/podcast"
                className={cn(
                  "mx-3.5 flex w-48 flex-row items-center space-x-2 rounded-md px-2 py-1.5",
                  pathname === "/podcast" ? "dark:bg-gradient-to-r dark:from-green-700 dark:to-blue-400" : "hover:bg-muted"
                )}
              >
                <Mic className="size-5 shrink-0" strokeWidth={1.5} />
                <span className="hidden text-sm group-hover:block">
                  Podcast
                </span>
              </Link>
            </div>
          </div>

          <div className="absolute bottom-4">
            <div className="flex items-center">
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className={cn(
                  "mx-3.5 flex flex-row items-center rounded-md px-2 py-1.5 group-hover:w-[11.25rem] hover:bg-muted"
                )}
              >
                <Sun
                  className="size-5 shrink-0 dark:hidden"
                  strokeWidth={1.5}
                />
                <MoonIcon
                  className="hidden size-5 shrink-0 dark:block"
                  strokeWidth={1.5}
                />

                <span className="ml-2 hidden text-sm group-hover:block">
                  Switch Theme
                </span>
              </button>
            </div>

            <Separator className="m-4 w-auto" />
            <div className="space-y-2 ">
              <div className="flex items-center">
                <Link
                  href="/dashboard"
                  className={cn(
                    "mx-3.5 flex flex-row items-center space-x-2 rounded-md px-2 py-1.5 group-hover:w-full",
                    pathname === "/dashboard"
                      ? "dark:bg-gradient-to-r dark:from-green-700 dark:to-blue-400"
                      : "hover:bg-muted"
                  )}
                >
                  <LayoutDashboard
                    className="size-5 shrink-0"
                    strokeWidth={1.5}
                  />
                  <span className="hidden text-sm group-hover:block">
                    Dashboard
                  </span>
                </Link>
              </div>

              <div className="flex items-center">
                <Link
                  href="/pricing"
                  className={cn(
                    "mx-3.5 flex flex-row items-center space-x-2 rounded-md px-2 py-1.5 group-hover:w-full",
                    pathname === "/pricing" ? "dark:bg-gradient-to-r dark:from-green-700 dark:to-blue-400" : "hover:bg-muted"
                  )}
                >
                  <Gem className="size-5 shrink-0" strokeWidth={1.5} />
                  <span className="hidden text-sm group-hover:block">
                    Pricing
                  </span>
                </Link>
              </div>

              <div className="flex items-center">
                <Link
                  href="/billing"
                  className={cn(
                    "mx-3.5 flex flex-row items-center space-x-2 rounded-md px-2 py-1.5 group-hover:w-full",
                    pathname === "/billing" ? "dark:bg-gradient-to-r dark:from-green-700 dark:to-blue-400" : "hover:bg-muted"
                  )}
                >
                  <CreditCard className="size-5 shrink-0" strokeWidth={1.5} />
                  <span className="hidden text-sm group-hover:block">
                    Subscription
                  </span>
                </Link>
              </div>
            </div>

            <Separator className="m-4 w-auto" />
            <div className="space-y-2 ">
              <div className="flex items-center">
                <div
                  className={cn(
                    "mx-3.5 flex flex-row items-center space-x-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-500 px-2 py-1.5 text-white group-hover:w-full"
                  )}
                >
                  <User className="size-5 shrink-0" strokeWidth={1.5} />
                  <span className="hidden truncate text-sm group-hover:block">
                    {user?.given_name} {user?.family_name}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <LogoutLink
                  className={cn(
                    "mx-3.5 flex flex-row items-center space-x-2 rounded-md px-2 py-1.5 group-hover:w-full hover:bg-muted"
                  )}
                >
                  <LogOut className="size-5 shrink-0" strokeWidth={1.5} />
                  <span className="hidden text-sm group-hover:block">
                    Log Out
                  </span>
                </LogoutLink>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="absolute bottom-4">
          <div className="flex items-center">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="mx-3.5 flex flex-row items-center rounded-md px-2 py-1.5 group-hover:w-[11.25rem] hover:bg-muted"
            >
              <Sun className="size-5 shrink-0 dark:hidden" strokeWidth={1.5} />
              <MoonIcon
                className="hidden size-5 shrink-0 dark:block"
                strokeWidth={1.5}
              />

              <span className="ml-2 hidden text-sm group-hover:block">
                Switch Theme
              </span>
            </button>
          </div>

          <Separator className="m-4 w-auto" />

          <div className="flex items-center">
            <Link
              href="/pricing"
              className={cn(
                "mx-3.5 flex flex-row items-center space-x-2 rounded-md px-2 py-1.5 group-hover:w-full",
                pathname === "/pricing" ? "dark:bg-gradient-to-r dark:from-green-700 dark:to-blue-400" : "hover:bg-muted"
              )}
            >
              <Gem className="size-5 shrink-0" strokeWidth={1.5} />
              <span className="hidden text-sm group-hover:block">Pricing</span>
            </Link>
          </div>

          <Separator className="m-4 w-auto" />
          <div className="space-y-2 ">
            <div className="flex items-center">
              <LoginLink
                className={cn(
                  "mx-3.5 flex flex-row items-center space-x-2 rounded-md px-2 py-1.5 group-hover:w-full hover:bg-muted"
                )}
              >
                <LogIn className="size-5 shrink-0" strokeWidth={1.5} />
                <span className="hidden text-sm group-hover:block">
                  Sign In
                </span>
              </LoginLink>
            </div>
            <div className="flex items-center">
              <RegisterLink
                className={cn(
                  "mx-3.5 flex flex-row items-center space-x-2 rounded-md px-2 py-1.5 group-hover:w-full hover:bg-muted"
                )}
              >
                <ArrowUpRightSquare
                  className="size-5 shrink-0"
                  strokeWidth={1.5}
                />
                <span className="hidden text-sm group-hover:block">
                  Sign Up
                </span>
              </RegisterLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
