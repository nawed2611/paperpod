"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { trpc } from "@/app/_trpc/client";

const UpgradeButton = () => {
  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url ?? "/billing";
    },
  });

  return (
    <Button
      onClick={() => createStripeSession()}
      className="w-full bg-gradient-to-r from-pink-500 to-purple-500"
    >
      Upgrade now <ArrowRight className="ml-1.5 size-5" />
    </Button>
  );
};

export default UpgradeButton;
