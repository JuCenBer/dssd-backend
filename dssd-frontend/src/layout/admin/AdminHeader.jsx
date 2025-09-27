import React from 'react';
import { Bars3Icon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router';

const AdminHeader = ({ toggleSidebar, className = '' }) => {
	const { logout } = useAuth();

	return (
		<header className={`
      bg-admin-header border-b border-admin-header-border
			flex items-center justify-between
			h-16 px-4 sm:px-6
			${className}
		`}>
			{/* Lado Izquierdo: Toggle en móvil y Link al sitio */}
			<div className="flex items-center gap-4">
				<button 
					onClick={toggleSidebar} 
					aria-label="Alternar menú"
					className="p-2 rounded-md text-text-secondary hover:bg-interactive-secondary-hover hover:text-text-primary transition-colors md:hidden"
				>
					<Bars3Icon className="h-6 w-6" />
				</button>
				<Link to="/" className="hidden md:block text-sm text-text-secondary hover:text-brand-primary transition-colors">
					Volver al sitio web
				</Link>
			</div>

			{/* Lado Derecho: Logout */}
			<button 
				className='flex items-center gap-2 text-sm text-error-primary hover:bg-error-soft px-3 py-1.5 rounded-md transition-colors'
				onClick={logout}	
			>
				<span className="hidden sm:inline">Cerrar Sesión</span>
				<ArrowRightStartOnRectangleIcon className='h-5 w-5' />
			</button>
		</header>
	);
};

export default AdminHeader;