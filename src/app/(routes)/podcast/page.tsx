import { redirect } from "next/navigation";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import PodcastPage from "@/components/podcast/PodcastPage";

const Podcast = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) redirect("/auth-callback?origin=podcast");

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) redirect("/auth-callback?origin=podcast");

  const isSubscribed = Boolean(
    dbUser.stripeSubscriptionId &&
    dbUser.stripeCurrentPeriodEnd &&
    dbUser.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  );

  return <PodcastPage user={dbUser} isSubscribed={isSubscribed} />;
};

export default Podcast;
