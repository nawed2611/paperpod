import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import Sidebar from "@/components/sidebar";

const RoutesLayout = ({ children }: { children: React.ReactNode }) => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  return (
    <div className="fixed flex h-screen w-full flex-row border">
      <div className="w-16">
        <Sidebar user={user} />
      </div>
      <div className="w-[calc(100vw-4rem)]">{children}</div>
    </div>
  );
};

export default RoutesLayout;
