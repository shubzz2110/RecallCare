import PageHeading from "@/components/PageHeading";
import { Users } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="flex flex-col w-full h-full gap-8">
      <PageHeading
        title="Users"
        description="Manage your users and their permissions."
        icon={<Users />}
      />
    </div>
  );
}
