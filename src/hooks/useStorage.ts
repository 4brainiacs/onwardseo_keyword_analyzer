import { useState, useCallback } from 'react';
import { storage } from '../services/storage';
import { logger } from '../utils/logger';

export function useStorage<T>(key: string, initialValue?: T) {
  const [state, setState] = useState<T | null>(() => {
    try {
      return storage.get<T>(key) ?? initialValue ?? null;
    } catch (error) {
      logger.error('Failed to initialize storage value:', { key, error });
      return initialValue ?? null;
    }
  });

  const setValue = useCallback((value: T | ((prev: T | null) => T)) => {
    try {
      const newValue = value instanceof Function ? value(state) : value;
      setState(newValue);
      storage.set(key, newValue);
    } catch (error) {
      logger.error('Failed to set storage value:', { key, error });
    }
  }, [key, state]);

  const removeValue = useCallback(() => {
    try {
      setState(null);
      storage.remove(key);
    } catch (error) {
      logger.error('Failed to remove storage value:', { key, error });
    }
  }, [key]);

  return [state, setValue, removeValue] as const;
}