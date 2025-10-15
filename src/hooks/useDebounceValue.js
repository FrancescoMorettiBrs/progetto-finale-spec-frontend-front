import { useEffect, useState } from "react";

export default function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t); // cancella il timer quando value cambia
  }, [value, delay]);

  return debounced;
}
