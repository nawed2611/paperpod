import Link from "next/link";
import {
  LoginLink,
  RegisterLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { PilcrowIcon } from "@radix-ui/react-icons";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export default function IndexPage() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  return (
    <section className="w-full py-12 md:py-24 lg:py-28 xl:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* <div className="space-y-8"> */}
          <h1 className="inline-flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-5xl font-bold tracking-tighter text-transparent sm:text-5xl xl:text-6xl/none">
            Welcome to PaperPod
            <PilcrowIcon className="ml-3 size-12 text-primary" />
          </h1>
          <div className="text-center text-2xl font-medium text-primary/80">
            Explore research papers like never before!
          </div>

          {user ? (
            <Link href="/search" className={buttonVariants()}>
              Continue <ArrowRight className="ml-1.5 size-5" />
            </Link>
          ) : (
            <div className="flex flex-row space-x-3">
              <LoginLink className={buttonVariants()}>
                Sign In <ArrowRight className="ml-1.5 size-5" />
              </LoginLink>
              <RegisterLink className={buttonVariants()}>
                Get started <ArrowRight className="ml-1.5 size-5" />
              </RegisterLink>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
