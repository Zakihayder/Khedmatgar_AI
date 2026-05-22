// Extend global window with Google Maps types
declare global {
  interface Window {
    google: typeof google;
    initMap?: () => void;
  }
}

export {};
