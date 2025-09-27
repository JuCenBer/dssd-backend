import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Bars3Icon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import Sidebar from "./Sidebar";
import ProfileDropdown from '@/components/ProfileDropdown';

const Header = () => {
    const { isAuth, hasPermission } = useAuth();
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const desktopLinks = [
        { name: 'nav.home', link: '/' },
        { name: 'nav.products', link: '/products' },
        { name: 'nav.us', link: '/us' },
    ];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <header className="sticky top-0 z-30 h-[var(--header-height)] flex justify-between items-center px-4 sm:px-6 bg-surface-primary border-b border-border-primary shadow-sm">
                <Link to="/">
                    <img src="/logo_nav_bar.png" alt="Logo" className="h-8 lg:h-9" />
                </Link>

                {/* Navegación de escritorio */}
                <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
                    {desktopLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.link}
                            className="text-text-secondary hover:text-brand-primary transition-colors duration-200"
                        >
                            {t(link.name)}
                        </Link>
                    ))}
                    {isAuth && hasPermission('isAdmin') && (
                        <Link to="/admin" className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors duration-200">{t('nav.admin')}</Link>
                    )}
                </nav>

                {/* Iconos y menú móvil */}
                <div className="flex items-center gap-4">
                    <Link to="/cart" className="relative hidden lg:block p-2 rounded-full hover:bg-surface-secondary">
                        <ShoppingCartIcon className="w-6 h-6 text-text-secondary" />
                    </Link>
                    <div className="hidden lg:block">
                        {isAuth ? <ProfileDropdown /> : (
                            <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors duration-200">
                                {t('nav.login')}
                            </Link>
                        )}
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-text-primary" aria-label="Abrir menú">
                        <Bars3Icon className="w-7 h-7" />
                    </button>
                </div>
            </header>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
    );
};

export default Header;