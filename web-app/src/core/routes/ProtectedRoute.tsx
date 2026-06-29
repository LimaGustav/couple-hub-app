import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { AppLayout } from '../../shared/components/AppLayout';

/**
 * ProtectedRoute — Guard de autenticação.
 * Verifica se o usuário está autenticado antes de renderizar as rotas filhas.
 * Quando autenticado, renderiza o AppLayout que inclui Sidebar (desktop)
 * e MobileNav (mobile) automaticamente para todas as rotas protegidas.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Exibe um carregamento limpo enquanto verifica se há tokens nos storages locais
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#fff',
        color: '#b5174b'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>❤️ Couple Hub</div>
        <div style={{ fontSize: '14px', color: '#666' }}>Carregando sessão...</div>
      </div>
    );
  }

  // Redireciona para o login se o usuário não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Renderiza o AppLayout que contém Sidebar + MobileNav + Outlet (conteúdo da rota filha)
  return <AppLayout />;
}
