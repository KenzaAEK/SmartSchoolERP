
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { Icons } from '../constants';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  if (!user) return <>{children}</>;

  const menuItems = [
    { name: 'Tableau de Bord', path: '/dashboard', icon: <Icons.Dashboard />, roles: [UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN] },
    
    // Student specific
    { name: 'Emploi du temps', path: '/schedule-view', icon: <Icons.Calendar />, roles: [UserRole.STUDENT] },
    { name: 'Notes & Relevés', path: '/grades', icon: <Icons.Grades />, roles: [UserRole.STUDENT] },
    { name: 'Orientation IA', path: '/orientation', icon: <Icons.Brain />, roles: [UserRole.STUDENT] },
    
    // Teacher specific
    { name: 'Saisie des Notes', path: '/teacher/grades', icon: <Icons.Grades />, roles: [UserRole.TEACHER] },
    { name: 'Feuille d\'Appel', path: '/attendance', icon: <Icons.Dashboard />, roles: [UserRole.TEACHER] },
    
    // Admin specific
    { name: 'Statistiques IA', path: '/stats', icon: <Icons.Admin />, roles: [UserRole.ADMIN] },
    { name: 'Centre de Rapports', path: '/admin/reports', icon: <Icons.Grades />, roles: [UserRole.ADMIN] },
    { name: 'Délibérations', path: '/admin/deliberations', icon: <Icons.Grades />, roles: [UserRole.ADMIN] },
    { name: 'Emploi du Temps', path: '/schedule', icon: <Icons.Calendar />, roles: [UserRole.ADMIN] },
    { name: 'Imports de Masse', path: '/admin/import', icon: <Icons.Brain />, roles: [UserRole.ADMIN] },
    { name: 'Gestion Étudiants', path: '/admin/students', icon: <Icons.Grades />, roles: [UserRole.ADMIN] },
    { name: 'Gestion Professeurs', path: '/admin/teachers', icon: <Icons.Grades />, roles: [UserRole.ADMIN] },
  ].filter(item => item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className={`bg-white shadow-xl transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} flex flex-col`}>
        <div className="p-6 flex items-center gap-3 border-b">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">S</div>
          {!collapsed && <span className="font-bold text-xl text-primary">SGAI 2.0</span>}
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-blue-50 hover:text-primary'
                }`
              }
            >
              {item.icon}
              {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-primary"
          >
            <svg className={`transform transition-transform ${collapsed ? 'rotate-180' : ''}`} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
            {!collapsed && <span>Réduire</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <div className="text-gray-500 font-medium">ENSA Tanger • 2023 - 2024</div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">{user.name}</div>
              <div className="text-xs text-gray-500 capitalize">{user.role}</div>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-red-500"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
