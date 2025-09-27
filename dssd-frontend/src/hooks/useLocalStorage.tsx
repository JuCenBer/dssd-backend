"use client"
import { useState, useCallback } from "react";

/**
 * Hook para usar localStorage con soporte para SSR y tipos en TS.
 */
export function useLocalStorage<T>(keyName: string, defaultValue: T): [T, (val: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }
    try {
      const item = window.localStorage.getItem(keyName);
      return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
      console.warn(`Error al leer la key "${keyName}" en localStorage:`, err);
      return defaultValue;
    }
  });

  const setValue = useCallback((newValue: T | ((prev: T) => T)) => {
    try {
      const valueToStore =
        typeof newValue === "function"
          ? (newValue as (prev: T) => T)(storedValue)
          : newValue;
      setStoredValue(valueToStore);
      window.localStorage.setItem(keyName, JSON.stringify(valueToStore));
    } catch (err) {
      console.warn(`Error al guardar la key "${keyName}" en localStorage:`, err);
    }
  }, [keyName, storedValue]);

  const clearValue = useCallback(() => {
    try {
      window.localStorage.removeItem(keyName);
      setStoredValue(defaultValue);
    } catch (err) {
      console.warn(`Error al eliminar la key "${keyName}" de localStorage:`, err);
    }
  }, [keyName, defaultValue]);

  return [storedValue, setValue, clearValue];
}