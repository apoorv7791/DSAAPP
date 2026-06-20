import { Platform, NativeModules, TurboModuleRegistry } from 'react-native';

/**
 * Interface for the storage backend.
 * Compatible with AsyncStorage's core API.
 */
export interface StorageBackend {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear?(): Promise<void>;
}

/** In-memory fallback when native AsyncStorage is not linked or available. */
class MemoryStorage implements StorageBackend {
    private data = new Map<string, string>();

    async getItem(key: string): Promise<string | null> {
        return this.data.get(key) ?? null;
    }

    async setItem(key: string, value: string): Promise<void> {
        this.data.set(key, value);
    }

    async removeItem(key: string): Promise<void> {
        this.data.delete(key);
    }

    async clear(): Promise<void> {
        this.data.clear();
    }
}

let resolvedBackend: StorageBackend | undefined;
let warnedMissingNative = false;

/** 
 * Safely checks if the native AsyncStorage module is linked and available.
 * This avoids the library's internal warnings and potential crashes.
 */
function isNativeAsyncStorageLinked(): boolean {
    if (Platform.OS === 'web') return false; // Web uses localStorage usually, but we'll use memory for now or let the user decide

    try {
        const turbo =
            TurboModuleRegistry?.get?.('RNCAsyncStorage') ??
            TurboModuleRegistry?.get?.('RNC_AsyncSQLiteDBStorage') ??
            TurboModuleRegistry?.get?.('PlatformLocalStorage');

        if (turbo) return true;

        return !!(
            NativeModules.RNCAsyncStorage ??
            NativeModules.RNC_AsyncSQLiteDBStorage ??
            NativeModules.PlatformLocalStorage
        );
    } catch (e) {
        return false;
    }
}

/**
 * Returns a safe storage backend.
 */
export function getStorage(): StorageBackend {
    if (resolvedBackend) return resolvedBackend;

    if (!isNativeAsyncStorageLinked()) {
        if (!warnedMissingNative && Platform.OS !== 'web') {
            warnedMissingNative = true;
            console.warn(
                '[Storage] AsyncStorage native module unavailable; using in-memory storage. ' +
                'To persist data across restarts, rebuild the dev client (e.g., npx expo run:ios).'
            );
        }
        resolvedBackend = new MemoryStorage();
        return resolvedBackend;
    }

    try {
        // Only require the library if we are confident the native module is linked.
        // This prevents the "NativeModule: AsyncStorage is null" warning from the library itself.
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require('@react-native-async-storage/async-storage');
        resolvedBackend = mod.default;
        return resolvedBackend!;
    } catch (e) {
        resolvedBackend = new MemoryStorage();
        return resolvedBackend;
    }
}

/**
 * Simple wrapper for common JSON operations.
 */
export const storage = {
    async get<T>(key: string, defaultValue: T): Promise<T> {
        try {
            const val = await getStorage().getItem(key);
            return val ? (JSON.parse(val) as T) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },
    async set<T>(key: string, value: T): Promise<void> {
        try {
            await getStorage().setItem(key, JSON.stringify(value));
        } catch (e) {
            // ignore
        }
    },
    async remove(key: string): Promise<void> {
        try {
            await getStorage().removeItem(key);
        } catch (e) {
            // ignore
        }
    }
};
