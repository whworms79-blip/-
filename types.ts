
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN'
}

export enum VehicleType {
  MOTORCYCLE = 'MOTORCYCLE',
  DAMAS = 'DAMAS',
  LABO = 'LABO',
  TRUCK_1TON = 'TRUCK_1TON',
  TRUCK_1TON_WING = 'TRUCK_1TON_WING',
  TRUCK_2_5TON = 'TRUCK_2_5TON'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PICKUP = 'PICKUP',
  COMPLETED = 'COMPLETED'
}

export interface CargoDetails {
  weight: string;
  size: string;
  type: string;
}

export interface Order {
  id: string;
  createdAt: number;
  customerName: string;
  origin: string;
  destination: string;
  recipientPhone?: string;
  vehicleType: VehicleType;
  vehicleOption?: string[];
  price: number;
  fee: number;
  status: OrderStatus;
  driverId?: string;
  description?: string;
  cargoDetails?: CargoDetails;
  isInsured: boolean;
  electronicReceiptSigned?: boolean;
  payoutStatus: 'PENDING' | 'READY' | 'COMPLETED';
}

export interface DriverRegistration {
  id: string;
  driverName: string;
  carNumber: string;
  vehicleType: VehicleType;
  phoneNumber: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: number;
  // New properties for location tracking
  isTracking?: boolean;
  latitude?: number;
  longitude?: number;
  lastLocationUpdate?: number;
}

export interface OrderStats {
  totalOrders: number;
  activeDrivers: number;
  revenue: number;
  efficiencyRate: number;
}
