
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);
    
    // Update matches when the media query changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add listener and cleanup
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  
  return matches;
}
