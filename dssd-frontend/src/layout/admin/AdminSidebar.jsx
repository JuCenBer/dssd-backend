import React, { useState } from 'react';
import { XMarkIcon, Bars3Icon, ArrowRightStartOnRectangleIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { NavLink, Link, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

const AdminSidebar = ({ isOpen, onClose, links = [], isMobile, onToggle }) => {
  const { logout, hasPermission } = useAuth();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const activeLinkClasses = "bg-[var(--admin-nav-link-active-bg)] text-[var(--admin-nav-link-active-text)]";
  const inactiveLinkClasses = "text-[var(--admin-nav-link-inactive-text)] hover:bg-[var(--admin-nav-link-hover-bg)] hover:text-[var(--admin-nav-link-hover-text)]";

  const isActiveLink = (linkPath) => {
    return location.pathname === linkPath || location.pathname.startsWith(linkPath + '/');
  };

  const hasActiveChild = (children) => {
    return children?.some(child => isActiveLink(child.link));
  };

  const toggleSubmenu = (itemName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const canRenderItem = (item) => {
    if (item.permission && !hasPermission(item.permission)) {
      return false;
    }
    if (item.children && item.children.length > 0) {
      return item.children.some(child => canRenderItem(child));
    }
    return true;
  };

  const renderMenuItem = (item, level = 0) => {
    if (!canRenderItem(item)) return null;

    const isActive = isActiveLink(item.link);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus[item.name];
    const hasActiveChildren = hasActiveChild(item.children);
    const shouldShowAsActive = isActive || hasActiveChildren;

    return (
      <li key={item.name}>
        {hasChildren ? (
          <div>
            <button
              onClick={() => toggleSubmenu(item.name)}
              className={`w-full flex items-center gap-x-4 p-3 rounded-md transition-colors group ${shouldShowAsActive ? activeLinkClasses : inactiveLinkClasses}`}
              title={isOpen ? '' : item.name}
            >
              {item.icon && React.createElement(item.icon, { className: `h-6 w-6 flex-shrink-0` })}
              {isOpen && (
                <>
                  <span className="font-medium whitespace-nowrap flex-1 text-left">{item.name}</span>
                  <ChevronRightIcon className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </>
              )}
            </button>
            {isOpen && isExpanded && (
              <ul className="pl-4 mt-1 space-y-1">
                {item.children.map(child => renderMenuItem(child, level + 1))}
              </ul>
            )}
          </div>
        ) : (
          <NavLink
            to={item.link}
            end={item.name === 'Home' || item.name === 'Dashboard'}
            onClick={isMobile ? onClose : undefined}
            className={`flex items-center gap-x-4 p-3 rounded-md transition-colors group ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
            title={isOpen ? '' : item.name}
          >
            {item.icon && React.createElement(item.icon, { className: `h-6 w-6 flex-shrink-0` })}
            {isOpen && <span className="font-medium whitespace-nowrap">{item.name}</span>}
          </NavLink>
        )}
      </li>
    );
  };

  return (
    <>
      {isMobile && (
        <div
          className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={onClose}
        ></div>
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-50 flex flex-col shadow-2xl
        bg-[var(--admin-sidebar-bg)] border-r border-[var(--admin-sidebar-border)]
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-20'}
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : ''}
      `}>
        <div className={`flex items-center h-16 flex-shrink-0 px-4 border-b border-[var(--admin-sidebar-border)] ${isOpen ? 'justify-between' : 'justify-center'}`}>
          {isOpen && (
            <Link to="/admin/dashboard" className="text-xl font-bold text-white whitespace-nowrap">
              {import.meta.env.VITE_BRAND_NAME || 'Admin Panel'}
            </Link>
          )}
          <button 
            onClick={isMobile ? onClose : onToggle} 
            aria-label={isMobile ? "Cerrar menú" : "Alternar menú"}
            className="p-2 rounded-md text-[var(--admin-nav-link-inactive-text)] hover:bg-[var(--admin-nav-link-hover-bg)] hover:text-white transition-colors"
          >
            {isMobile ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="flex flex-col gap-2 px-4">
            {links.map((item) => renderMenuItem(item))}
          </ul>
        </nav>

        <div className="mt-auto p-4 border-t border-[var(--admin-sidebar-border)] flex-shrink-0">
          <button
            onClick={logout}
            className={`
              flex items-center w-full gap-x-4 p-3 rounded-md transition-colors group
              text-[var(--admin-nav-link-inactive-text)] hover:bg-red-900/40 hover:text-red-400
            `}
            title={isOpen ? '' : 'Cerrar Sesión'}
          >
            <ArrowRightStartOnRectangleIcon className="h-6 w-6 flex-shrink-0" />
            {isOpen && (
              <span className="font-medium whitespace-nowrap">Cerrar Sesión</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
