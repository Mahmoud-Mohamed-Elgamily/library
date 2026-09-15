import ProtectedRoute from "@/components/protectedRoutes";
import AdminSidebar from "@/components/AdminSidebar";
import LogoutButton from "@/components/LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRole="ADMIN">
      <div className="flex min-h-screen bg-[#f8f4ef]">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-[#e8ddd3] bg-[#fffdfb] px-8 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a624d]">
                Library Management
              </p>

              <p className="mt-1 text-sm text-stone-500">
                Admin Panel
              </p>
            </div>

            <LogoutButton />
          </header>

          <main className="flex-1 p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}