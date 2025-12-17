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
  TRUCK_1TON_WING = 'TRUCK_1TON_WING', // 윙바디
  TRUCK_2_5TON = 'TRUCK_2_5TON'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PICKUP = 'PICKUP',
  COMPLETED = 'COMPLETED'
}

export interface CargoDetails {
  weight: string; // e.g., "500kg"
  size: string;   // e.g., "100x100x100"
  type: string;   // e.g., "박스", "팔레트", "가구"
}

export interface Order {
  id: string;
  createdAt: number;
  customerName: string;
  origin: string;
  destination: string;
  vehicleType: VehicleType;
  vehicleOption?: string[]; // 리프트, 냉동 등
  price: number;
  status: OrderStatus;
  driverId?: string;
  description?: string;
  cargoDetails?: CargoDetails;
  isInsured: boolean; // 적재물 보험 가입 여부
  electronicReceiptSigned?: boolean; // 전자 인수증 서명 여부
}

export interface OrderStats {
  totalOrders: number;
  activeDrivers: number;
  revenue: number;
}