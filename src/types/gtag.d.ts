/* eslint-disable @typescript-eslint/no-explicit-any */

// Extend Window interface for Google Analytics gtag
interface Window {
  gtag: (...args: any[]) => void;
  dataLayer: any[];
}
