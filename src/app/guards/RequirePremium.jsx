import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
export default function RequirePremium({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!user.premium) return <Navigate to="/pricing" replace />;
  return children;
}
