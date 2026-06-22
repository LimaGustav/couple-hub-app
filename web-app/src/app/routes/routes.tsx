import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { RoletaPage } from "../pages/RoletaPage";
import { TokensPage } from "../pages/TokensPage";
import { TimelinePage } from "../pages/TimelinePage";
import { LoginPage } from "../pages/LoginPage";
import { useAppData } from "../contexts/AppDataContext";
import type { Memory } from "../data";

type AppRoutesProps = {
  memories: Memory[];
};

function ProtectedRoute({ element }: { element: JSX.Element }) {
  const { isAuthenticated } = useAppData();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
}

export function AppRoutes({ memories }: AppRoutesProps) {
  const { isAuthenticated } = useAppData();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />
        }
      />
      <Route path="/" element={<ProtectedRoute element={<HomePage memories={memories} />} />} />
      <Route path="/roleta" element={<ProtectedRoute element={<RoletaPage />} />} />
      <Route path="/tokens" element={<ProtectedRoute element={<TokensPage />} />} />
      <Route
        path="/timeline"
        element={<ProtectedRoute element={<TimelinePage memories={memories} />} />}
      />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
    </Routes>
  );
}
