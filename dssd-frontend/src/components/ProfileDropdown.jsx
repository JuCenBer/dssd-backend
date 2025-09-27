import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout, user } = useAuth();
    const dropdownRef = useRef(null);

    // Cierra el dropdown si se hace clic afuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2">
                <UserCircleIcon className="w-8 h-8 text-foreground" />
                <span className="text-sm font-medium text-foreground hidden sm:block">{user?.name || 'Mi Cuenta'}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border border-border z-10">
                    <div className="py-1">
                        <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-card-foreground hover:bg-muted"
                            onClick={() => setIsOpen(false)}
                        >
                            Mi Perfil
                        </Link>
                        {/* <Link to="/settings" className="block px-4 py-2 text-sm text-card-foreground hover:bg-muted" onClick={() => setIsOpen(false)}>
                            Configuración
                        </Link> */}
                        <button
                            onClick={() => { logout(); setIsOpen(false); }}
                            className="w-full text-left block px-4 py-2 text-sm text-destructive"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;