import { redirect } from "next/navigation";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { getUserSubscriptionPlan } from "@/lib/stripe";
import UploadPage from "@/components/upload/UploadPage";

const Upload = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) redirect("/auth-callback?origin=upload");

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) redirect("/auth-callback?origin=upload");

  const plan = await getUserSubscriptionPlan();

  return <UploadPage isSubscribed={plan.isSubscribed} />;
};

export default Upload;
