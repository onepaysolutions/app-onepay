import { useActiveAccount } from "thirdweb/react";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface AuthWrapperProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function AuthWrapper({ children, requireAuth = true }: AuthWrapperProps) {
  const account = useActiveAccount();

  if (requireAuth && !account) {
    return <Navigate to="/connect" replace />;
  }

  return <>{children}</>;
} 