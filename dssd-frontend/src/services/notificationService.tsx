import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

// --- DEFINICIONES DE TIPOS E INTERFACES ---

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  title?: string;
  message: string;
  type?: NotificationType;
  duration?: number | null;
  showProgress?: boolean;
}

interface NotificationOptions {
  title?: string;
  type?: NotificationType;
  message: string;
  seconds?: number;
  showProgress?: boolean;
}

// --- ICONOS ---

const icons: Record<NotificationType, React.ReactElement> = {
  success: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
  error: <XCircleIcon className="h-6 w-6 text-red-500" />,
  warning: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />,
  info: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
};

// --- COMPONENTES DE REACT ---

// Props para el componente NotificationToast
interface NotificationToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onDismiss }) => {
  React.useEffect(() => {
    if (notification.duration !== null) {
      const timer = setTimeout(() => {
        onDismiss(notification.id);
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  const type = notification.type || 'info';

  const progressVariants = {
    initial: { width: '100%' },
    animate: {
      width: '0%',
      transition: { duration: (notification.duration || 0) / 1000, ease: 'linear' },
    },
  };

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className="relative flex w-full max-w-sm items-start overflow-hidden rounded-lg bg-white/80 dark:bg-gray-900/80 shadow-2xl border border-gray-200 dark:border-gray-800 backdrop-blur-sm"
    >
      <div className="flex w-full p-4">
        <div className="flex-shrink-0 flex items-center justify-center pt-0.5">{icons[type]}</div>
        <div className="ml-3 flex-1">
          {notification.title && (
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {notification.title}
            </p>
          )}
          <p className={`text-sm text-gray-600 dark:text-gray-300 ${notification.title ? 'mt-1' : ''}`}>
            {notification.message}
          </p>
        </div>
      </div>

      <button
        onClick={() => onDismiss(notification.id)}
        className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>

      {notification.showProgress && notification.duration && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-400"
          variants={progressVariants}
          initial="initial"
          animate="animate"
        />
      )}
    </motion.div>
  );
};

// Props para el componente NotificationContainer
interface NotificationContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications, onDismiss }) => {
  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex flex-col-reverse items-end z-[100] p-4 sm:p-6 gap-4 pointer-events-none"
    >
      <AnimatePresence initial={false}>
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
             <NotificationToast notification={notification} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// --- SERVICIO DE NOTIFICACIONES ---

class NotificationService {
  private notifications: Notification[] = [];
  private container: HTMLDivElement | null = null;
  private root: Root | null = null; // Tipo Root de react-dom/client
  private static readonly MAX_NOTIFICATIONS = 5;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof document === 'undefined') return;
    const existingContainer = document.getElementById('notification-service-container');
    if (existingContainer) {
        this.container = existingContainer as HTMLDivElement;
    } else {
        this.container = document.createElement('div');
        this.container.id = 'notification-service-container';
        document.body.appendChild(this.container);
    }
    this.root = createRoot(this.container);
    this.render();
  }

  private render() {
    if (!this.root) return;
    this.root.render(
      <React.StrictMode>
        <NotificationContainer notifications={this.notifications} onDismiss={this.dismiss} />
      </React.StrictMode>
    );
  }

  private dismiss = (id: string) => {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.render();
  };

  public notify(options: NotificationOptions) {
    const { title, type = 'info', message, seconds, showProgress = false } = options;
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    
    // Si seconds es null, la notificación es persistente.
    // Si es undefined, se usa un valor por defecto (5000ms).
    const duration = seconds === null ? null : (seconds ? seconds * 1000 : 5000);
    
    const notification: Notification = { id, title, message, type, duration, showProgress };
    
    // Añade la nueva al final y recorta el array si excede el máximo.
    this.notifications = [...this.notifications, notification].slice(-NotificationService.MAX_NOTIFICATIONS);
    
    this.render();
    return id;
  }

  public success(message: string, title?: string, seconds?: number, showProgress?: boolean) {
    return this.notify({ message, title, type: 'success', seconds, showProgress });
  }

  public error(message: string, title?: string, seconds?: number, showProgress?: boolean) {
    return this.notify({ message, title, type: 'error', seconds, showProgress });
  }
  
  public warning(message: string, title?: string, seconds?: number, showProgress?: boolean) {
    return this.notify({ message, title, type: 'warning', seconds, showProgress });
  }

  public info(message: string, title?: string, seconds?: number, showProgress?: boolean) {
    return this.notify({ message, title, type: 'info', seconds, showProgress });
  }

  public dismissById(id: string) {
    this.dismiss(id);
  }

  public dismissAll() {
    this.notifications = [];
    this.render();
  }

  public destroy() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
    this.notifications = [];
  }
}

// --- EXPORTACIÓN ---

// Se crea una instancia Singleton para que sea usada en toda la aplicación.
export const notificationService = new NotificationService();

// Exporta el método principal para un uso más cómodo.
export const notify = notificationService.notify.bind(notificationService);

// Limpieza para evitar memory leaks en entornos de desarrollo con Hot Module Replacement (HMR)
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    notificationService.destroy();
  });
}