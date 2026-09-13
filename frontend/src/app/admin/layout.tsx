import ProtectedRoute from "@/components/protectedRoutes";
import AdminSidebar from "@/components/AdminSidebar";
import LogoutButton from "@/components/LogoutButton";
import AddBookModal from "@/components/AddBookModal";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRole="ADMIN">
      <div className="flex min-h-screen bg-zinc-50">
        <AdminSidebar />

        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-end border-b border-zinc-200 bg-white px-8 py-4">
            <LogoutButton />
          </header>

          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}