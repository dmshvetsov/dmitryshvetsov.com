import * as React from 'react';

const IS_BROWSER = typeof window !== 'undefined'

type LocalStorageHook<T> = [T, (newValue: T) => void]

// Inspired by https://usehooks.com/useLocalStorage/
function useLocalStorage<TValue = string>(
  key: string,
  initialValue: TValue
): LocalStorageHook<TValue> {
  if (!IS_BROWSER) {
    return React.useState(initialValue)
  }
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.error(err);
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.error(err);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
