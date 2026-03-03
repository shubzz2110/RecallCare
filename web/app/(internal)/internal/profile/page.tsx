import PageHeading from "@/components/PageHeading";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col w-full h-full gap-8">
      <PageHeading
        title="Profile"
        description="Manage your profile and settings."
        icon={<User />}
      />
    </div>
  );
}
