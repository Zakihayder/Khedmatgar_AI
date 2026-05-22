'use client';
import { Provider } from '@/lib/db/providers';

interface MapViewProps {
  providers: Provider[];
  selectedProviderId: string | null;
  onSelectProvider: (id: string) => void;
  userLat?: number;
  userLng?: number;
}

export function MapView({ providers, selectedProviderId, userLat = 33.6508, userLng = 72.9691 }: MapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  if (!apiKey) {
    return null;
  }

  // Determine iframe source based on selection
  let src = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${userLat},${userLng}&zoom=13&maptype=roadmap`;
  
  if (selectedProviderId) {
    const selectedProvider = providers.find(p => p.id === selectedProviderId);
    if (selectedProvider) {
      // Place mode automatically puts a red pin on the target coordinate
      src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${selectedProvider.lat},${selectedProvider.lng}&zoom=15`;
    }
  }

  return (
    <div className="w-full h-full min-h-[300px] relative">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={src}
        className="absolute inset-0 grayscale contrast-125" // Optional: gives it a slightly more integrated dark-mode vibe
      />
      {/* Overlay to catch clicks if we want to add custom provider selection dots over the iframe later. 
          But for now, the iframe itself is fully interactive. */}
    </div>
  );
}

