
import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, Order, OrderStatus, VehicleType, DriverRegistration } from './types';
import { LandingView } from './components/LandingView';
import { PartnerPortal } from './components/PartnerPortal';

const App = () => {
  const [viewMode, setViewMode] = useState<'WEB' | 'APP'>('WEB');
  const [portalRole, setPortalRole] = useState<UserRole.DRIVER | UserRole.ADMIN>(UserRole.DRIVER);
  const [orders, setOrders] = useState<Order[]>([]);
  const [registrations, setRegistrations] = useState<DriverRegistration[]>([]);

  const generateInitialData = (): Order[] => {
    const now = Date.now();
    return [
      {
        id: 'demo-1',
        createdAt: now - 1000 * 60 * 5, 
        customerName: '김철수',
        origin: '서울 강남구 테헤란로 123',
        destination: '경기 성남시 판교역로 456',
        vehicleType: VehicleType.DAMAS,
        price: 35000,
        fee: 0,
        status: OrderStatus.PENDING,
        description: '사무용품 박스 15개',
        isInsured: true,
        payoutStatus: 'PENDING'
      },
      {
        id: 'demo-2',
        createdAt: now - 1000 * 60 * 25,
        customerName: '이영희',
        origin: '서울 마포구 양화로 160',
        destination: '서울 용산구 이태원로 1',
        vehicleType: VehicleType.MOTORCYCLE,
        price: 12000,
        fee: 0,
        status: OrderStatus.ACCEPTED,
        driverId: 'me',
        description: '급한 서류 봉투',
        isInsured: false,
        payoutStatus: 'PENDING'
      }
    ];
  };

  useEffect(() => {
    setOrders(generateInitialData());
    setRegistrations([
      {
        id: 'me', // 기사용 앱 데모 ID
        driverName: '홍길동',
        carNumber: '서울 12가 3456',
        vehicleType: VehicleType.TRUCK_1TON,
        phoneNumber: '010-1111-2222',
        status: 'APPROVED',
        appliedAt: Date.now() - 1000000,
        isTracking: false
      },
      {
        id: 'reg-1',
        driverName: '이강인',
        carNumber: '경기 88나 9999',
        vehicleType: VehicleType.TRUCK_1TON,
        phoneNumber: '010-1111-2222',
        status: 'PENDING',
        appliedAt: Date.now() - 100000
      }
    ]);
  }, []);

  const addOrder = (newOrderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...newOrderData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      status: OrderStatus.PENDING
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const acceptOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: OrderStatus.ACCEPTED, driverId: 'me' } : o
    ));
  };

  const completeOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: OrderStatus.COMPLETED } : o
    ));
  };

  const submitRegistration = (regData: Omit<DriverRegistration, 'id' | 'status' | 'appliedAt'>) => {
    const newReg: DriverRegistration = {
      ...regData,
      id: 'reg-' + Math.random().toString(36).substr(2, 5),
      status: 'PENDING',
      appliedAt: Date.now()
    };
    setRegistrations(prev => [newReg, ...prev]);
  };

  const approveRegistration = (regId: string) => {
    setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status: 'APPROVED' } : r));
  };

  // 위치 추적 상태 업데이트 함수
  const updateDriverLocation = useCallback((driverId: string, lat: number, lng: number, isTracking: boolean) => {
    setRegistrations(prev => prev.map(r => 
      r.id === driverId ? { ...r, latitude: lat, longitude: lng, isTracking, lastLocationUpdate: Date.now() } : r
    ));
  }, []);

  const simulateOrder = () => {
    const scenarios = [
      { origin: '서울 송파구 올림픽로', dest: '서울 강동구 천호동', item: '서류', price: 9000, type: VehicleType.MOTORCYCLE },
      { origin: '인천 부평구', dest: '경기 부천시', item: '박스 2개', price: 25000, type: VehicleType.DAMAS },
    ];
    const r = scenarios[Math.floor(Math.random() * scenarios.length)];
    addOrder({
      customerName: '신규고객',
      origin: r.origin,
      destination: r.dest,
      vehicleType: r.type,
      price: r.price,
      fee: 0,
      description: r.item,
      isInsured: true,
      payoutStatus: 'PENDING'
    });
  };

  if (viewMode === 'APP') {
    return (
      <PartnerPortal 
        role={portalRole} 
        setRole={setPortalRole} 
        orders={orders} 
        registrations={registrations}
        acceptOrder={acceptOrder}
        completeOrder={completeOrder}
        submitRegistration={submitRegistration}
        approveRegistration={approveRegistration}
        updateLocation={updateDriverLocation}
        onExit={() => setViewMode('WEB')}
        onSimulate={simulateOrder}
        onReset={() => setOrders(generateInitialData())}
      />
    );
  }

  return (
    <LandingView 
      orders={orders} 
      addOrder={addOrder} 
      onOpenPortal={(role) => {
        setPortalRole(role);
        setViewMode('APP');
      }}
    />
  );
};

export default App;
