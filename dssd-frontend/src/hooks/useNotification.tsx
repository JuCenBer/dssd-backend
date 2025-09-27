import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  title?: string;
  message: string;
  type?: NotificationType;
  duration?: number | null;
}

interface NotificationContextProps {
  notify: (notification: Omit<Notification, 'id'>) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

// --- Componente para un solo Toast ---
const icons = {
  success: <CheckCircleIcon className="h-7 w-7 text-green-400" />,
  error: <XCircleIcon className="h-7 w-7 text-red-400" />,
  warning: <ExclamationTriangleIcon className="h-7 w-7 text-yellow-400" />,
  info: <InformationCircleIcon className="h-7 w-7 text-blue-400" />,
};

const NotificationToast: React.FC<{
  notification: Notification;
  onDismiss: (id: string) => void;
}> = ({ notification, onDismiss }) => {
  useEffect(() => {
    if (notification.duration !== null) {
      const timer = setTimeout(() => {
        onDismiss(notification.id);
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2, ease: "easeOut" } }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="relative flex w-full max-w-sm items-start gap-4 overflow-hidden rounded-lg bg-slate-900 p-4 shadow-lg ring-1 ring-white/10"
    >
      <div className="flex-shrink-0">{icons[notification.type || 'info']}</div>
      <div className="flex-1">
        {notification.title && <h3 className="font-semibold text-white">{notification.title}</h3>}
        <p className="text-sm text-slate-300">{notification.message}</p>
      </div>
      <button
        onClick={() => onDismiss(notification.id)}
        className="absolute top-2 right-2 p-1 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </motion.div>
  );
};

// --- Provider de Notificaciones ---
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random();
    const fullNotification: Notification = { 
      id, 
      duration: 2000,
      ...notification 
    };
    setNotifications((prev) => [...prev, fullNotification]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3">
        <AnimatePresence>
          {notifications.map((n) => (
            <NotificationToast key={n.id} notification={n} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

// --- Hook para usar las notificaciones ---
export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe usarse dentro de NotificationProvider');
  }
  return context;
};