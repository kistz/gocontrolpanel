import DashboardCards from "@/components/dashboard/dashboard-cards";
import DashboardChart from "@/components/dashboard/dashboard-chart";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <DashboardCards />
          <DashboardChart />
        </div>
      </div>
    </div>
  );
}
