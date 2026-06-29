import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

/**
 * AppLayout — Layout principal da aplicação autenticada.
 * Renderiza a Sidebar no desktop e o MobileNav no mobile,
 * com o conteúdo da rota atual via <Outlet />.
 */
export function AppLayout() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar — visível apenas em telas md+ */}
      <Sidebar balance={0} />

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Navegação mobile — visível apenas em telas menores que md */}
      <MobileNav />
    </div>
  );
}
