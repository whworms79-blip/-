
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
  recipientPhone?: string; // 배차킹 스타일: 도착지 알림용
  vehicleType: VehicleType;
  vehicleOption?: string[];
  price: number;
  fee: number; // 더운반 스타일: 수수료 (0원 강조용)
  status: OrderStatus;
  driverId?: string;
  description?: string;
  cargoDetails?: CargoDetails;
  isInsured: boolean;
  electronicReceiptSigned?: boolean;
  payoutStatus: 'PENDING' | 'READY' | 'COMPLETED'; // 즉시 정산 상태
}

export interface OrderStats {
  totalOrders: number;
  activeDrivers: number;
  revenue: number;
  efficiencyRate: number; // 카카오T 스타일: 공차율 최적화 지표
}
