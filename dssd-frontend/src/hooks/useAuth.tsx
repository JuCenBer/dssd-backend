import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { authEvents } from '../services/authEvents';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [storedAuth, setStoredAuth] = useLocalStorage('auth', { user: null, token: null, permissions: [] });

    const isAuth = Boolean(storedAuth.token);

    const setAuth = useCallback(({ user, token, permissions }) => {
        setStoredAuth({ user, token, permissions });
    }, [setStoredAuth]);

    const setUserInfo = useCallback((user) => {
        setStoredAuth(prev => ({ ...prev, user }));
    }, [setStoredAuth]);

    const logout = useCallback(() => {
        setStoredAuth({ user: null, token: null, permissions: [] });
    }, [setStoredAuth]);

    const hasPermission = useCallback((permission) => {
        if (!storedAuth.permissions || !Array.isArray(storedAuth.permissions)) return false;
        return storedAuth.permissions.includes(permission);
    }, [storedAuth.permissions]);

    const clearPermissions = useCallback(() => {
        setStoredAuth(prev => ({ ...prev, permissions: [] }));
    }, [setStoredAuth]);

    // Escuchar eventos de logout desde el API client
    useEffect(() => {
        const handleLogout = (message?: string) => {
            logout();
            // Opcional: mostrar mensaje adicional o redirigir
        };

        authEvents.on('logout', handleLogout);
        
        return () => {
            authEvents.off('logout', handleLogout);
        };
    }, [logout]);

    return (
        <AuthContext.Provider
            value={{
                user: storedAuth.user,
                token: storedAuth.token,
                isAuth,
                setAuth,
                setUserInfo,
                logout,
                hasPermission,
                clearPermissions,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);