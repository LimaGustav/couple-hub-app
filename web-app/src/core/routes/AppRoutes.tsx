import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { RegisterPage } from '../../features/auth/pages/RegisterPage';
import { HomePage } from '../../features/home/pages/HomePage';

/**
 * AppRoutes — Definição central de rotas da aplicação.
 *
 * Estrutura:
 * - Rotas públicas (/login, /register): sem menu de navegação.
 * - Rotas protegidas (/* restantes): aninhadas sob <ProtectedRoute />,
 *   que renderiza o <AppLayout /> contendo Sidebar (desktop) e MobileNav (mobile).
 *
 * Para adicionar novas rotas protegidas, basta inserir dentro do bloco
 * <Route element={<ProtectedRoute />}> e criar o componente da página.
 */
export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* ─── Rotas Públicas (sem layout de navegação) ─── */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
      />

      {/* ─── Rotas Protegidas (com Sidebar + MobileNav via AppLayout) ─── */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        {/* Futuras rotas protegidas — adicionar aqui: */}
        {/* <Route path="/roleta" element={<RoletaPage />} /> */}
        {/* <Route path="/tokens" element={<TokensPage />} /> */}
        {/* <Route path="/timeline" element={<TimelinePage />} /> */}
      </Route>

      {/* ─── Redirecionamento de rotas desconhecidas ─── */}
      <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
    </Routes>
  );
}
