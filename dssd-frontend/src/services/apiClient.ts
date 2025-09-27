// ============================================================================
// TYPES & INTERFACES
// ============================================================================
import { authEvents } from './authEvents';
import { notificationService } from '@/services/notificationService';

export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number | null;
  success: boolean;
  // Agregamos campos adicionales para manejar la estructura del backend
  code?: string;
  details?: any;
}

export interface ApiError {
  message: string;
  code?: string;
  fields?: string[];
  statusCode?: number;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  queryParams?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  timeout?: number;
  skipAuth?: boolean;
  skipErrorNotification?: boolean;
  retries?: number;
}

export interface AuthState {
  token: string;
  user?: any;
  // otros campos que pueda tener tu auth
}

export interface HttpClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  defaultHeaders?: Record<string, string>;
}

// ============================================================================
// HTTP CLIENT (Core - Sin dependencias externas)
// ============================================================================

class HttpClient {
  private config: Required<HttpClientConfig>;

  constructor(config: HttpClientConfig) {
    this.config = {
      baseUrl: config.baseUrl,
      timeout: config.timeout ?? 30000,
      retries: config.retries ?? 1,
      defaultHeaders: config.defaultHeaders ?? {},
    };

    if (!this.config.baseUrl) {
      console.warn('HttpClient initialized without baseUrl');
    }
  }

  async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      queryParams,
      headers: customHeaders = {},
      timeout = this.config.timeout,
      retries = this.config.retries,
    } = options;

    let lastError: any;
    
    // Retry logic
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const result = await this.executeRequest<T>(
          endpoint,
          { ...options, timeout },
          customHeaders
        );
        return result;
      } catch (error) {
        lastError = error;
        
        // Si es el último intento o es un error que no debería reintentar
        if (
          attempt === retries - 1 || 
          this.shouldNotRetry(error)
        ) {
          break;
        }
        
        // Esperar antes del siguiente intento
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    // Si llegamos aquí, falló todos los intentos
    return this.createErrorResponse(lastError);
  }

  private async executeRequest<T>(
    endpoint: string,
    options: RequestOptions,
    customHeaders: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const { method, body, queryParams, timeout } = options;

    // Construir headers
    const headers = new Headers();
    
    // Headers por defecto
    Object.entries(this.config.defaultHeaders).forEach(([key, value]) => {
      headers.append(key, value);
    });

    // Content-Type automático para JSON
    if (!(body instanceof FormData) && body != null) {
      headers.append('Content-Type', 'application/json');
    }

    // Headers personalizados
    Object.entries(customHeaders).forEach(([key, value]) => {
      headers.append(key, value);
    });

    // Construir URL
    const fullUrl = this.buildUrl(endpoint, queryParams);

    // Configurar AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(fullUrl, {
        method,
        headers,
        body: this.prepareBody(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      const responseData = await this.parseResponse(response);
      
      // Procesar respuesta con el nuevo formato
      return this.processResponse<T>(response, responseData);

    } catch (error: any) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async parseResponse(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      try {
        const text = await response.text();
        return text ? JSON.parse(text) : null;
      } catch (jsonError) {
        console.error('ApiClient: Error parsing JSON response:', jsonError);
        const responseClone = response.clone();
        const textFallback = await responseClone.text().catch(() => "Could not read response text.");
        throw new Error(`Error al procesar la respuesta JSON del servidor. Contenido: ${textFallback.substring(0, 100)}...`);
      }
    }
    
    try {
      return await response.text();
    } catch (textError) {
      console.error('ApiClient: Error parsing text response:', textError);
      throw new Error('Error al procesar la respuesta de texto del servidor.');
    }
  }

  private processResponse<T>(response: Response, responseData: any): ApiResponse<T> {
    const httpStatus = response.status;

    // Procesar estructura estandarizada del backend
    if (responseData && typeof responseData === 'object' && 'success' in responseData) {
      // El backend devolvió una estructura estandarizada
      const backendResponse = responseData;
      
      return {
        data: backendResponse.success ? backendResponse.data : null,
        error: backendResponse.success ? null : backendResponse.message,
        status: httpStatus,
        success: backendResponse.success,
        code: backendResponse.code || undefined,
        details: backendResponse.details || undefined,
      };
    } else {
      // Respuesta no estandarizada (texto plano u otro formato)
      if (!response.ok) {
        const errorMessage = responseData || `Error del servidor (código ${httpStatus})`;
        
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
  }

  private buildUrl(endpoint: string, queryParams?: Record<string, any>): string {
    const baseUrl = this.config.baseUrl.replace(/\/$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    if (!queryParams || Object.keys(queryParams).length === 0) {
      return `${baseUrl}${cleanEndpoint}`;
    }

    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value != null) {
        searchParams.append(key, String(value));
      }
    });

    return `${baseUrl}${cleanEndpoint}?${searchParams.toString()}`;
  }

  private prepareBody(body: any): string | FormData | undefined {
    if (body == null) return undefined;
    if (body instanceof FormData) return body;
    return JSON.stringify(body);
  }

  private createErrorResponse<T>(error: any): ApiResponse<T> {
    const message = error.name === 'AbortError' 
      ? 'La solicitud ha caducado (timeout).'
      : error.message || 'Error de red o en la solicitud.';

    return {
      data: null,
      error: message,
      status: null,
      success: false,
    };
  }

  private shouldNotRetry(error: any): boolean {
    // No reintentar en casos específicos
    if (error.name === 'AbortError') return true;
    if (error.status >= 400 && error.status < 500) return true; // Client errors
    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Métodos de conveniencia
  get<T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  patch<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  delete<T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// ============================================================================
// API CLIENT (Service Layer - Con dependencias y lógica de negocio)
// ============================================================================

class ApiClientService {
  private httpClient: HttpClient;

  constructor(config: HttpClientConfig) {
    this.httpClient = new HttpClient(config);
    
    // Configurar listeners de auth events
    authEvents.on('logout', (message?: string) => {
      if (message) {
        notificationService.error(message);
      }
    });
  }

  /**
   * Request principal con manejo de auth y notificaciones
   */
  async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { skipAuth = false, skipErrorNotification = false, ...requestOptions } = options;

    // Inyectar token automáticamente si no es skipAuth
    const headers = { ...requestOptions.headers };
    if (!skipAuth) {
      const authData = this.getAuthFromStorage();
      if (authData?.token) {
        headers.Authorization = `${authData.token}`;
      }
    }

    // Ejecutar request
    const response = await this.httpClient.request<T>(endpoint, {
      ...requestOptions,
      headers,
    });

    // Manejo de errores específicos
    if (!response.success && response.error) {
      // 401 - Token expirado/inválido
      if (response.status === 401 && !skipAuth) {
        // Emitir evento en lugar de llamar directamente
        authEvents.emit('logout', response.error || 'Sesión expirada. Por favor, inicia sesión nuevamente.');
        return response;
      }

      // Notificación automática de errores (si no está deshabilitada)
      if (!skipErrorNotification) {
        notificationService.error(response.error);
      }
    }

    return response;
  }

  /**
   * Obtener datos de auth desde localStorage
   */
  private getAuthFromStorage() {
    try {
      const authData = localStorage.getItem('auth');
      return authData ? JSON.parse(authData) : null;
    } catch (error) {
      console.error('Error parsing auth data:', error);
      return null;
    }
  }

  /**
   * Subir archivos con soporte para múltiples archivos y datos adicionales
   */
  async uploadFiles<T = any>(
    endpoint: string,
    files: File | File[],
    additionalData?: Record<string, string>,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    
    // Agregar archivos
    const fileList = Array.isArray(files) ? files : [files];
    fileList.forEach((file, index) => {
      formData.append(`files`, file); // Backend generalmente espera 'files'
    });

    // Agregar datos adicionales
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
    });
  }

  // Métodos de conveniencia con todas las features
  get<T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  patch<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  delete<T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // Namespace para requests públicas (sin auth)
  public = {
    get: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
      this.get<T>(endpoint, { ...options, skipAuth: true }),
    
    post: <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
      this.post<T>(endpoint, body, { ...options, skipAuth: true }),
  };
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const apiClient = new ApiClientService({
  baseUrl: import.meta.env.VITE_API_URL || '',
  timeout: 30000,
  retries: 2,
  defaultHeaders: {
    'Accept': 'application/json',
  },
});

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/*
// En cualquier componente - Uso directo (sin setup)
import { apiClient } from '../services/apiClient';

const MyComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Request normal con auth automático
      const response = await apiClient.get('/api/users');
      if (response.success) {
        setData(response.data);
        // Ahora también tienes acceso a response.code y response.details si el backend los envía
      } else {
        console.error('Error:', response.error);
        // response.code y response.details también disponibles para manejo de errores
      }
    };
    
    fetchData();
  }, []);

  const handleFileUpload = async (files: FileList) => {
    // Subir archivos con datos adicionales
    const response = await apiClient.uploadFiles(
      '/api/uploads',
      Array.from(files),
      { folder: 'documents', userId: '123' }
    );
    
    if (response.success) {
      console.log('Files uploaded:', response.data);
    } else {
      console.error('Upload error:', response.error);
    }
  };

  const handlePublicRequest = async () => {
    // Request pública sin auth
    const response = await apiClient.public.get('/api/public/stats');
    if (response.success) {
      console.log(response.data);
    }
  };

  return <div>Your component</div>;
};
*/