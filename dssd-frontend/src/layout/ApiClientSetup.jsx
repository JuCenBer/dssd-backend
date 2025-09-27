import { useEffect, useState } from 'react'
import { ThemeProvider } from '@/hooks/useTheme'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { setupApiClient } from '@/services/apiClient'
import { notificationService } from '@/services/notificationService';

const ApiClientSetup = ({children}) => {

    const {logout} = useAuth();

    useEffect(() => {
        // Configurar apiClient una sola vez cuando el componente se monta
        setupApiClient(
        {
            getAuthState: () => {
                try {
                    const authData = localStorage.getItem('auth');
                    return authData ? JSON.parse(authData) : null;
                } catch (error) {
                    console.error('Error parsing auth data:', error);
                    return null;
                }
            },
            logout: (message) => {
                console.log('API Client triggered logout:', message);
                logout(); // Usa tu método de logout del contexto
                // Opcional: mostrar mensaje
                if (message) {
                    notificationService.error(message);
                }
            },
        },
        {
            error: (message) => notificationService.error(message),
            success: (message) => notificationService.success(message),
            info: (message) => notificationService.info(message),
            warning: (message) => notificationService.warning(message),
        }
        );
    }, []);

    return ( 
        <>
            
        {children}
        
        </>
     );
}
 
export default ApiClientSetup;