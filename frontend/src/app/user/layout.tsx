import ProtectedRoute from "@/components/protectedRoutes";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRole="USER">
      {children}
    </ProtectedRoute>
  );
}