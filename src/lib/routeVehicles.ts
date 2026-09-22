import { RoutePricing } from '../types';

export type RouteVehicleType = 'Sedan' | 'SUV' | 'Van';

export interface RouteVehicleOption {
  type: RouteVehicleType;
  label: string;
  shortLabel: string;
  price: number;
  passengers: string;
}

/** Returns only the vehicle prices the administrator enabled for this route. */
export const visibleRouteVehicles = (route: RoutePricing): RouteVehicleOption[] => {
  const vehicles: RouteVehicleOption[] = [
    { type: 'Sedan', label: 'Sedan', shortLabel: 'Sedan', price: route.sedan_price, passengers: '1–3 Pax' },
    { type: 'SUV', label: 'SUV', shortLabel: 'SUV', price: route.suv_price, passengers: '1–4 Pax' },
    { type: 'Van', label: 'Executive Van', shortLabel: 'Van', price: route.van_price, passengers: '5–10 Pax' },
  ];
  return vehicles.filter((vehicle) => (
  vehicle.type === 'Sedan' ? route.show_sedan !== false
    : vehicle.type === 'SUV' ? route.show_suv !== false
      : route.show_van !== false
  ));
};

export const defaultRouteVehicle = (route: RoutePricing): RouteVehicleType =>
  visibleRouteVehicles(route)[0]?.type || 'Sedan';
