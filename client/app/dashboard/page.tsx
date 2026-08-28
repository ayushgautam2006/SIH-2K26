"use client";

import DashboardLayout from "@/app/components/dash_user/DashboardLayout";
import UserDashboardPanel from "@/app/components/dash_user/DashboardPanel";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <UserDashboardPanel />
    </DashboardLayout>
  );
}
