import { useState } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router';
import {notify} from '@/services/notificationService';

interface FetchDataResponse<T = any> {
  data: T | null;
  error: string | null; 
  status: number | null;
  success: boolean; 
  response?: Response; 
  // Agregamos campos adicionales para manejar la estructura del backend
  code?: string;
  details?: any;
}

/**
 * Custom hook for fetching data from a given URL.
 * Maneja la estructura estandarizada del backend con success, message, data, code, details.
 *
 * @returns {object} - El hook provee la función `fetchData` para hacer solicitudes HTTP.
 */
const useFetchData = () => {
  const { token: userToken, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Fetches data from the specified URL with given options.
   *
   * @param {string} url - The URL to fetch data from.
   * @param {object} [options={}] - Optional configuration for the request.
   * @param {string} [options.method='GET'] - HTTP method (GET, POST, etc.).
   * @param {boolean} [options.token=null] - If token is provided.
   * @param {boolean} [options.useToken=true] - Whether to include the authorization token in the headers.
   * @param {any} [options.body] - Body of the request (object for JSON or instance of FormData).
   * @param {object} [options.queryParams] - Query parameters to be added to the URL.
   * @param {object} [options.headers] - Additional headers to merge.
   * @param {number} [options.timeout=0] - Timeout in milliseconds (0 means no timeout).
   *
   * @returns {object} - Returns an object with `data`, `error`, `success`, `code`, `details` properties.
   */
  const fetchData = async (url, options = {}) => {
    const {
      method = 'GET',
      useToken = true,
      body,
      queryParams,
      token = null,
      headers: customHeaders,
      timeout = 0,
    } = options;
    
    const headers = new Headers();
    
    // Si el body no es FormData, asumimos JSON y configuramos Content-Type
    if (!(body instanceof FormData)) {
      headers.append('Content-Type', 'application/json');
    }

    // Merge de headers personalizados
    if (customHeaders && typeof customHeaders === 'object') {
      for (const [key, value] of Object.entries(customHeaders)) {
        headers.append(key, String(value));
      }
    }

    // Agregamos el token si es requerido y existe
    if (useToken && userToken) {
      headers.append('Authorization', `${userToken}`);
    } else if(token) {
      headers.append('Authorization', `${token}`);
    }

    // Agregamos query params a la URL si existen
    if (queryParams) {
      const queryString = new URLSearchParams(queryParams).toString();
      url += `?${queryString}`;
    }

    // Configuramos las opciones de fetch
    const fetchOptions = {
      method,
      headers,
      body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
    };

    // Implementación opcional de timeout usando AbortController
    let controller;
    if (timeout > 0) {
      controller = new AbortController();
      fetchOptions.signal = controller.signal;
      setTimeout(() => controller.abort(), timeout);
    }

    let httpStatus = null;
    let responseClone = null;

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + url, fetchOptions);
      responseClone = response.clone();
      httpStatus = response.status;
      let responseData = null;
      
      // Intentar parsear como JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          responseData = await response.json();
        } catch (jsonError) {
          console.error('FetchData: Error parsing JSON response:', jsonError);
          const textFallback = await responseClone.text().catch(() => "Could not read response text.");
          return {
            data: null,
            error: `Error al procesar la respuesta JSON del servidor. Contenido: ${textFallback.substring(0, 100)}...`,
            status: httpStatus,
            success: false,
          };
        }
      } else {
        // Si no es JSON, intentar leer como texto
        try {
          responseData = await response.text();
        } catch (textError) {
          console.error('FetchData: Error parsing text response:', textError);
          return {
            data: null,
            error: 'Error al procesar la respuesta de texto del servidor.',
            status: httpStatus,
            success: false,
          };
        }
      }

      // Aquí es donde hacemos la diferencia: procesamos la estructura del backend
      if (responseData && typeof responseData === 'object' && 'success' in responseData) {
        // El backend devolvió una estructura estandarizada
        const backendResponse = responseData;
        
        // Manejar logout para errores 401
        if (httpStatus === 401 && useToken) {
          logout();
          notify({
            message: backendResponse.message || 'Sesión expirada. Por favor, inicia sesión nuevamente.',
            type: "error"
          });
          navigate("/");
        }
        
        return {
          data: backendResponse.success ? backendResponse.data : null,
          error: backendResponse.success ? null : backendResponse.message,
          status: httpStatus,
          success: backendResponse.success,
          code: backendResponse.code || null,
          details: backendResponse.details || null,
        };
      } else {
        // Respuesta no estandarizada (texto plano u otro formato)
        if (!response.ok) {
          const errorMessage = responseData || `Error del servidor (código ${httpStatus})`;
          
          if (httpStatus === 401 && useToken) {
            logout();
            notify({
              message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
              type: "error"
            });
            navigate("/");
          }

          return {
            data: null,
            error: errorMessage,
            status: httpStatus,
            success: false,
          };
        }

        // Éxito con respuesta no estandarizada
        return {
          data: responseData,
          error: null,
          status: httpStatus,
          success: true,
        };
      }

    } catch (error) {
      // Errores de red, aborto por timeout, etc.
      console.error('FetchData: Network or operational error:', error);
      const errorMessage = error.name === 'AbortError' ? 'La solicitud ha caducado (timeout).' : error.message || 'Error de red o en la solicitud.';
      
      return {
        data: null,
        error: errorMessage,
        status: httpStatus,
        success: false,
      };
    }
  };

  return { fetchData };
};

export default useFetchData;