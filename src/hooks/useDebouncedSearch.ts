import { useEffect, useRef, useState } from 'react';

export const useDebouncedSearch = (onCommit: () => void, delay = 400) => {
  const [input, setInput] = useState<string>('');
  const [committed, setCommitted] = useState<string>('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const committedRef = useRef<string>('');

  useEffect(() => () => clearTimeout(timer.current), []);

  const change = (value: string) => {
    setInput(value);
    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      const next = value.trim();

      if (next === committedRef.current) return;

      committedRef.current = next;
      setCommitted(next);
      onCommit();
    }, delay);
  };

  return { input, committed, change };
};
