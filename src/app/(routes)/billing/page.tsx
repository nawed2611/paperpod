import { redirect } from "next/navigation";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { getUserSubscriptionPlan } from "@/lib/stripe";
import BillingForm from "@/components/BillingForm";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) redirect("/auth-callback?origin=billing");

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) redirect("/auth-callback?origin=billing");

  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <div className="mx-4 md:mx-auto md:w-[70%]">
      <BillingForm subscriptionPlan={subscriptionPlan} />
    </div>
  );
};

export default Page;
