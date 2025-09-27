import React from 'react';
import { NavLink } from 'react-router';
import { HomeIcon, BuildingStorefrontIcon, UserIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';

const BottomNavBar = () => {
    const { isAuth } = useAuth();

    const navLinks = [
        { to: '/', icon: HomeIcon, name: 'Inicio' },
        { to: '/products', icon: BuildingStorefrontIcon, name: 'Productos' },
        { to: isAuth ? '/profile' : '/login', icon: UserIcon, name: isAuth ? 'Perfil' : 'Ingresar' },
    ];

    const getLinkClass = ({ isActive }) =>
        `flex flex-col items-center justify-center text-center transition-colors duration-200 group ${
            isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
        }`;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[var(--color-background)] border-t border-[var(--color-border)] h-[var(--bottom-nav-height)] lg:hidden">
            <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
                {navLinks.map((link) => (
                    <NavLink to={link.to} key={link.name} className={getLinkClass}>
                        <div className="relative">
                            <link.icon className="w-6 h-6" />
                            {link.hasBadge && totalProducts > 0 && (
                                <span className="absolute -top-1 -right-2 bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                                    {totalProducts}
                                </span>
                            )}
                        </div>
                        <span className="text-xs mt-1">{link.name}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default BottomNavBar;