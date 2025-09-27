import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import AdminHeader from './AdminHeader';
import Sidebar from './AdminSidebar'; 
import { Bars3Icon, ChartPieIcon, ListBulletIcon, UsersIcon, TagIcon, AdjustmentsVerticalIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import useIsMobile from '@/hooks/useIsMobile';
import { Cog8ToothIcon, RectangleStackIcon } from '@heroicons/react/24/solid';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const isMobile = useIsMobile();
  // Si es escritorio (no móvil), iniciamos abierto; si es móvil, cerrado.
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  // Cada vez que se detecte un cambio de dispositivo, actualizar el estado
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const sidebarLinks = [
    { name: 'Dashboard', link: '/admin', icon: ChartPieIcon },
    { name: 'Pedidos', link: '/admin/orders', icon: ArchiveBoxIcon },
    { name: 'Facturar', link: '/admin/facturacion', icon: ArchiveBoxIcon },
    { name: 'Productos', link: '/admin/products', icon: ListBulletIcon },
    { name: 'Categorias', link: '/admin/categories', icon: TagIcon },
    { name: 'Usuarios', link: '/admin/usuarios', icon: UsersIcon },
    { name: 'Configuracion', link: '/admin/config', icon: Cog8ToothIcon },
  ];

  return (
    // Aplicamos 'dark' y 'admin-layout' para activar nuestros temas
    <div className="dark admin-layout h-screen overflow-hidden flex bg-background-primary">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        links={sidebarLinks}
        isMobile={isMobile}
        onToggle={toggleSidebar}
      />
      
      {/* Transición de margen suave basada en el estado del sidebar */}
      <div className={`w-full flex flex-col flex-1 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'md:ml-64' : 'md:ml-20'
      }`}>
        <AdminHeader 
          toggleSidebar={toggleSidebar} 
          className="flex-shrink-0"
        />
        
        <main className="flex-1 bg-background-primary overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;