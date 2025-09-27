import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { XMarkIcon, ArrowRightOnRectangleIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { isAuth, logout, hasPermission } = useAuth();

    const sidebarLinks = [
        { name: 'nav.home', link: '/' },
    ];


    return (
        <>
            <div
                className={`fixed inset-0 bg-overlay-backdrop z-40 transition-opacity duration-300 ease-in-out ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
                aria-hidden="true"
            />
            <aside
                className={`fixed top-0 right-0 h-full w-72 bg-background-secondary z-50 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-border-primary">
                    <img src="/logo_nav_bar.png" className="h-8" alt="Logo" />
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-surface-tertiary" aria-label="Cerrar sidebar">
                        <XMarkIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </div>

                <nav className="p-4 flex-grow">
                    <ul className="flex flex-col gap-2">
                        {sidebarLinks.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.link}
                                    onClick={onClose}
                                    className="block text-lg text-text-primary hover:text-brand-primary hover:bg-surface-primary p-3 rounded-md transition-colors"
                                >
                                    {t(item.name)}
                                </Link>
                            </li>
                        ))}
                        {isAuth && hasPermission('isAdmin') && (
                            <li>
                                <Link
                                    to="/admin"
                                    onClick={onClose}
                                    className="flex items-center gap-3 text-lg text-text-primary hover:text-brand-primary hover:bg-surface-primary p-3 rounded-md transition-colors"
                                >
                                    <LockClosedIcon className="w-5 h-5" />
                                    {t('nav.admin')}
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>

                <div className="p-4 border-t border-border-primary">
                    {isAuth ? (
                        <button
                            onClick={() => { logout(); onClose(); }}
                            className="w-full text-center text-lg font-semibold bg-error-primary text-text-inverse hover:bg-error-primary-hover p-3 rounded-md transition-colors duration-200"
                        >
                            Cerrar Sesión
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            onClick={onClose}
                            className="w-full block text-center text-lg font-semibold bg-interactive-primary text-interactive-primary-text hover:bg-interactive-primary-hover p-3 rounded-md transition-colors duration-200"
                        >
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;