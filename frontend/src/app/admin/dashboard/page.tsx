import {
  BookOpen,
  Library,
  BookCheck,
  Users,
  RefreshCcw,
  BookMarked,
} from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Total Books",
      value: 120,
      icon: BookOpen,
    },
    {
      title: "Total Copies",
      value: 350,
      icon: Library,
    },
    {
      title: "Available Copies",
      value: 275,
      icon: BookCheck,
    },
    {
      title: "Borrowed Copies",
      value: 75,
      icon: BookMarked,
    },
    {
      title: "Registered Users",
      value: 48,
      icon: Users,
    },
    {
      title: "Active Borrowings",
      value: 31,
      icon: RefreshCcw,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-zinc-500">
          Overview of the library system.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    {stat.title}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-zinc-900">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}