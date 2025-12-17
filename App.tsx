import React, { useState, useEffect } from 'react';
import { UserRole, Order, OrderStatus, VehicleType } from './types';
import { CustomerView } from './components/CustomerView';
import { DriverView } from './components/DriverView';
import { AdminView } from './components/AdminView';
import { LayoutDashboard, Truck, User, Smartphone } from 'lucide-react';

const App = () => {
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [orders, setOrders] = useState<Order[]>([]);

  // Demo Data Generator
  const generateInitialData = () => {
    const now = Date.now();
    return [
      {
        id: 'demo-1',
        createdAt: now - 1000 * 60 * 5, 
        customerName: '김철수',
        origin: '서울 강남구 테헤란로 123 (강남역)',
        destination: '경기 성남시 분당구 판교역로 456 (판교테크노밸리)',
        vehicleType: VehicleType.DAMAS,
        price: 35000,
        status: OrderStatus.PENDING,
        description: '사무용품 박스 15개',
        isInsured: true
      },
      {
        id: 'demo-2',
        createdAt: now - 1000 * 60 * 25,
        customerName: '이영희',
        origin: '서울 마포구 양화로 160 (홍대입구역)',
        destination: '서울 용산구 이태원로 1 (삼각지역)',
        vehicleType: VehicleType.MOTORCYCLE,
        price: 12000,
        status: OrderStatus.ACCEPTED,
        driverId: 'me',
        description: '급한 서류 봉투',
        isInsured: false
      },
      {
        id: 'demo-3',
        createdAt: now - 1000 * 60 * 120,
        customerName: '박민수',
        origin: '서울 성동구 성수이로 20 (성수동)',
        destination: '서울 중구 을지로 100 (을지로3가)',
        vehicleType: VehicleType.TRUCK_1TON,
        price: 55000,
        status: OrderStatus.COMPLETED,
        driverId: 'driver2',
        description: '가구 운반',
        isInsured: true
      },
      {
        id: 'demo-4',
        createdAt: now - 1000 * 60 * 45,
        customerName: '홍길동',
        origin: '서울 종로구 세종대로 175 (세종문화회관)',
        destination: '서울 서초구 남부순환로 2583 (예술의전당)',
        vehicleType: VehicleType.LABO,
        price: 40000,
        status: OrderStatus.COMPLETED,
        description: '전시 물품',
        isInsured: true
      }
    ];
  };

  useEffect(() => {
    setOrders(generateInitialData());
  }, []);

  const addOrder = (newOrderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...newOrderData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      status: OrderStatus.PENDING
    };
    setOrders(prev => [newOrder, ...prev]);
    if (role === UserRole.CUSTOMER) {
      alert('배차 요청이 등록되었습니다! 기사님이 곧 배정됩니다.');
    }
  };

  const acceptOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: OrderStatus.ACCEPTED, driverId: 'me' } : o
    ));
    alert('배차를 수락했습니다! 안전운전 하세요.');
  };

  const completeOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: OrderStatus.COMPLETED } : o
    ));
    alert('운송이 완료되었습니다. 수고하셨습니다!');
  };

  // --- Demo Presentation Functions ---
  const resetDemoData = () => {
    if (window.confirm('모든 데이터를 초기화하고 데모 상태로 되돌리겠습니까?')) {
      setOrders(generateInitialData());
    }
  };

  const simulateIncomingOrder = () => {
    const scenarios = [
      { origin: '서울 송파구 올림픽로 300 (롯데월드타워)', dest: '서울 강동구 천호대로 1005 (천호역)', item: '긴급 서류', price: 9000, type: VehicleType.MOTORCYCLE },
      { origin: '경기 안양시 동안구 시민대로 230', dest: '서울 금천구 벚꽃로 298', item: '전자부품 박스 2개', price: 22000, type: VehicleType.DAMAS },
      { origin: '인천 부평구 부평대로 1', dest: '경기 부천시 길주로 200', item: '화분 및 인테리어 소품', price: 30000, type: VehicleType.LABO },
    ];
    const random = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    addOrder({
      customerName: '시연용 고객',
      origin: random.origin,
      destination: random.dest,
      vehicleType: random.type,
      price: random.price,
      description: random.item,
      isInsured: true
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header / Nav */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setRole(UserRole.CUSTOMER)}>
            <div className="bg-slate-900 p-2 rounded-lg text-white">
              <Truck className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tighter">QuickHaul</h1>
          </div>
          
          <div className="flex bg-slate-50 rounded-lg p-1 border border-slate-100">
            <button 
              onClick={() => setRole(UserRole.CUSTOMER)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all ${role === UserRole.CUSTOMER ? 'bg-white shadow-sm text-slate-900 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <User className="w-3.5 h-3.5" /> <span className="hidden sm:inline">고객</span>
            </button>
            <button 
              onClick={() => setRole(UserRole.DRIVER)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all ${role === UserRole.DRIVER ? 'bg-white shadow-sm text-orange-600 ring-1 ring-orange-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Smartphone className="w-3.5 h-3.5" /> <span className="hidden sm:inline">기사</span>
            </button>
            <button 
              onClick={() => setRole(UserRole.ADMIN)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all ${role === UserRole.ADMIN ? 'bg-white shadow-sm text-slate-900 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> <span className="hidden sm:inline">관리</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {role === UserRole.CUSTOMER && (
          <div className="animate-in fade-in duration-500">
            <CustomerView 
              addOrder={addOrder} 
              myOrders={orders.filter(o => o.customerName === '홍길동')} 
            />
          </div>
        )}

        {role === UserRole.DRIVER && (
          <div className="bg-slate-50 min-h-[calc(100vh-64px)] animate-in slide-in-from-right duration-300">
            <DriverView 
              orders={orders} 
              acceptOrder={acceptOrder}
              completeOrder={completeOrder}
            />
          </div>
        )}

        {role === UserRole.ADMIN && (
          <div className="bg-slate-50 min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
            <AdminView 
              orders={orders} 
              onReset={resetDemoData}
              onSimulate={simulateIncomingOrder}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;