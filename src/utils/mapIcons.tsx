import L from 'leaflet';
import { ChefHat, School, Briefcase } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

export const createCustomIcon = (type: 'school' | 'kitchen' | 'vendor') => {
  const isSchool = type === 'school';
  const isKitchen = type === 'kitchen';
  
  let bgClass = 'bg-amber-500';
  if (isSchool) bgClass = 'bg-blue-500';
  if (isKitchen) bgClass = 'bg-brand-500';
  
  const iconMarkup = renderToStaticMarkup(
    <div className={`w-10 h-10 ${bgClass} rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white transform transition-transform hover:scale-110`}>
      {isSchool && <School size={20} />}
      {isKitchen && <ChefHat size={20} />}
      {!isSchool && !isKitchen && <Briefcase size={20} />}
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: 'custom-leaflet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

export const schoolIcon = createCustomIcon('school');
export const kitchenIcon = createCustomIcon('kitchen');
export const vendorIcon = createCustomIcon('vendor');
