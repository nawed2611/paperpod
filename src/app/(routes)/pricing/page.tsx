import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import UpgradeButton from "@/components/UpgradeButton";

export default function Pricing() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  return (
    <section className="flex w-full items-center justify-center sm:h-[calc(100vh-6rem)]">
      <div className="container px-4 md:px-6">
        <div className="mt-8 grid grid-cols-1 gap-6 md:mx-32 md:grid-cols-2 md:gap-32">
          <div className="flex flex-col justify-between rounded-lg border p-6 shadow-lg">
            <div>
              <h3 className="text-center text-2xl font-bold">Basic</h3>
              <div className="mt-4 text-center text-zinc-600 dark:text-zinc-400">
                <span className="text-4xl font-bold">$0</span>/ month
              </div>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <svg
                    className=" mr-2 rounded-full bg-green-500 p-1 text-xs text-white"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  5 pages per PDF
                </li>
                <li className="flex items-center">
                  <svg
                    className=" mr-2 rounded-full bg-green-500 p-1 text-xs text-white"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  4MB file size limit
                </li>
                <li className="flex items-center">
                  <svg
                    className=" mr-2 rounded-full bg-green-500 p-1 text-xs text-white"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Higher-quality responses
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <Link
                href={user ? "/search" : "/sign-up"}
                className={buttonVariants({
                  className: "w-full",
                  variant: "secondary",
                })}
              >
                {user ? "Let's Explore" : "Sign up"}
                <ArrowRight className="ml-1.5 size-5" />
              </Link>
            </div>
          </div>
          <div className="dark:bg-zinc-850 relative flex flex-col justify-between rounded-lg border border-purple-500 p-6 shadow-lg">
            <div className="absolute left-1/2 top-0 inline-block -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-3 py-1 text-sm text-white">
              Upgrade now
            </div>
            <div>
              <h3 className="text-center text-2xl font-bold">Pro</h3>
              <div className="mt-4 text-center text-zinc-600 dark:text-zinc-400">
                <span className="text-4xl font-bold">$15</span>/ month
              </div>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <svg
                    className=" text-2xs mr-2 rounded-full bg-green-500 p-1 text-white"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  35 pages per PDF
                </li>
                <li className="flex items-center">
                  <svg
                    className=" mr-2 rounded-full bg-green-500 p-1 text-xs text-white"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  16MB file size limit
                </li>
                <li className="flex items-center">
                  <svg
                    className=" mr-2 rounded-full bg-green-500 p-1 text-xs text-white"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Premium-quality responses
                </li>
                <li className="flex items-center">
                  <svg
                    className=" mr-2 rounded-full bg-green-500 p-1 text-xs text-white"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Priority support
                </li>
              </ul>
            </div>
            <div className="mt-6">
              {user ? (
                <UpgradeButton />
              ) : (
                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    className:
                      "w-full bg-gradient-to-r from-pink-500 to-purple-500",
                  })}
                >
                  Uprade now
                  <ArrowRight className="ml-1.5 size-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
