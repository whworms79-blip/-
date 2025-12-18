
import React, { useState, useEffect, useMemo } from 'react';
import { Order, OrderStatus, DriverRegistration, VehicleType } from '../types';
import { Truck, Wallet, Zap, ChevronRight, Home, UserCircle, Settings, ClipboardList, Headset, Search, PlusSquare, Power, MapPin, LocateFixed, ToggleLeft, ToggleRight, Map, Clock } from 'lucide-react';

interface DriverViewProps {
  orders: Order[];
  registrations: DriverRegistration[];
  acceptOrder: (id: string) => void;
  completeOrder: (id: string) => void;
  submitRegistration: (reg: Omit<DriverRegistration, 'id' | 'status' | 'appliedAt'>) => void;
  updateLocation?: (id: string, lat: number, lng: number, tracking: boolean) => void;
}

const RegistrationForm = ({ onSubmit, onCancel, currentReg }: { onSubmit: any, onCancel: any, currentReg?: DriverRegistration }) => {
  const [formData, setFormData] = useState({
    driverName: '',
    carNumber: '',
    vehicleType: VehicleType.TRUCK_1TON,
    phoneNumber: ''
  });

  if (currentReg) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center animate-in zoom-in-95">
        <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ClipboardList className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-3">등록 심사 중</h3>
        <p className="text-lg text-slate-500 mb-8 leading-relaxed">
          제출하신 서류와 정보를 관리자가 검토 중입니다.<br/>보통 24시간 이내에 처리됩니다.
        </p>
        <div className="bg-slate-50 p-6 rounded-2xl text-left text-base space-y-4 mb-8">
          <div className="flex justify-between">
            <span className="text-slate-400">차량번호</span>
            <span className="font-bold">{currentReg.carNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">신청상태</span>
            <span className={`font-bold ${currentReg.status === 'PENDING' ? 'text-orange-500' : 'text-green-500'}`}>
              {currentReg.status === 'PENDING' ? '심사중' : '승인완료'}
            </span>
          </div>
        </div>
        <button onClick={onCancel} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xl">확인</button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-3xl animate-in slide-in-from-bottom-10">
      <h3 className="text-2xl font-black text-slate-900 mb-8">기사(화물) 등록</h3>
      <div className="space-y-6">
        <div>
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">이름</label>
          <input 
            type="text" 
            value={formData.driverName}
            onChange={e => setFormData({...formData, driverName: e.target.value})}
            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 text-lg" 
            placeholder="홍길동"
          />
        </div>
        <div>
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">차량번호</label>
          <input 
            type="text" 
            value={formData.carNumber}
            onChange={e => setFormData({...formData, carNumber: e.target.value})}
            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 text-lg" 
            placeholder="12가 3456"
          />
        </div>
        <div>
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">연락처</label>
          <input 
            type="tel" 
            value={formData.phoneNumber}
            onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 text-lg" 
            placeholder="010-0000-0000"
          />
        </div>
        <div className="pt-6 flex gap-3">
          <button onClick={onCancel} className="flex-1 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl text-xl">취소</button>
          <button 
            onClick={() => onSubmit(formData)} 
            className="flex-[2] py-5 bg-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-200 text-xl"
          >
            등록 신청하기
          </button>
        </div>
      </div>
    </div>
  );
};

const SettlementDashboard = ({ orders }: { orders: Order[] }) => {
  const completedOrders = orders.filter(o => o.status === OrderStatus.COMPLETED && o.driverId === 'me');
  const totalEarnings = completedOrders.reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="p-6 space-y-6 animate-in fade-in">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-slate-400 text-sm font-bold mb-2">인출 가능 수익 (실시간)</p>
          <h3 className="text-4xl font-black mb-8">
            {totalEarnings.toLocaleString()} <span className="text-orange-500 text-2xl uppercase">원</span>
          </h3>
          <button className="w-full bg-orange-600 hover:bg-orange-500 py-4 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-3">
            <Zap className="w-5 h-5 fill-current"/> 즉시 출금 신청
          </button>
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 p-6">
        <h4 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <Wallet className="w-6 h-6 text-orange-500"/> 이번 주 정산 리포트
        </h4>
        <div className="space-y-4 text-lg">
          <div className="flex justify-between">
            <span className="text-slate-500">완료 건수</span>
            <span className="font-bold">{completedOrders.length} 건</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">총 운송 수입</span>
            <span className="font-bold">{totalEarnings.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span className="text-slate-500">플랫폼 수수료</span>
            <span className="font-bold">- 0원</span>
          </div>
          <div className="pt-4 border-t-2 border-slate-100 font-black text-orange-600 flex justify-between text-xl">
            <span>최종 정산 예정액</span>
            <span>{totalEarnings.toLocaleString()}원</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DriverView: React.FC<DriverViewProps> = ({ orders, registrations, acceptOrder, completeOrder, submitRegistration, updateLocation }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'market' | 'active' | 'wallet' | 'register' | 'smart'>('home');
  const [activeSubTab, setActiveSubTab] = useState<'pending' | 'completed'>('pending');
  const [isTracking, setIsTracking] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = useMemo(() => {
    return currentTime.toLocaleTimeString('ko-KR', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }, [currentTime]);

  useEffect(() => {
    let watchId: number;
    if (isTracking && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          if (updateLocation) updateLocation('me', latitude, longitude, true);
        },
        (err) => console.error("GPS Error:", err),
        { enableHighAccuracy: true }
      );
    } else {
      if (updateLocation) updateLocation('me', 0, 0, false);
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isTracking, updateLocation]);

  const marketOrders = orders.filter(o => o.status === OrderStatus.PENDING);
  const smartOrders = isTracking ? marketOrders.filter((o, idx) => idx % 2 === 0) : [];
  const myOrders = orders.filter(o => o.driverId === 'me');
  const myAcceptedOrders = orders.filter(o => 
    (o.status === OrderStatus.ACCEPTED || o.status === OrderStatus.PICKUP) && o.driverId === 'me'
  );
  const myCompletedOrders = orders.filter(o => 
    o.status === OrderStatus.COMPLETED && o.driverId === 'me'
  );

  const displayedOrders = activeSubTab === 'pending' ? myAcceptedOrders : myCompletedOrders;
  const myRegistration = registrations.find(r => r.id === 'me');

  const groupedOrders = useMemo(() => {
    const groups: { [key: string]: Order[] } = {};
    displayedOrders.forEach(order => {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(order);
    });
    return Object.keys(groups).sort().map(key => ({
      dateLabel: key === `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}` 
        ? `오늘 ${new Date().getMonth() + 1}월 ${new Date().getDate()}일 (${['일','월','화','수','목','금','토'][new Date().getDay()]})`
        : `${new Date(key).getMonth() + 1}월 ${new Date(key).getDate()}일 (${['일','월','화','수','목','금','토'][new Date(key).getDay()]})`,
      items: groups[key]
    }));
  }, [displayedOrders]);

  const GridButton = ({ icon: Icon, label, color, onClick, badge, subtext }: any) => (
    <button 
      onClick={onClick}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center p-6 aspect-square hover:shadow-md transition-all active:scale-95 group relative"
    >
      <div className={`p-5 rounded-[2rem] ${color} mb-5 group-hover:scale-110 transition-transform`}>
        <Icon className="w-12 h-12 text-white" />
      </div>
      <span className="text-2xl font-black text-slate-800 tracking-tighter leading-none">{label}</span>
      {subtext && <span className="text-sm text-slate-400 mt-2 font-bold">{subtext}</span>}
      {badge && <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-black px-2.5 py-0.5 rounded-full shadow-md">{badge}</span>}
    </button>
  );

  return (
    <div className="max-w-md mx-auto min-h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* App Top Bar */}
      <div className="bg-red-600 px-5 pt-4 pb-5 shrink-0">
        <div className="flex justify-end items-center text-[11px] text-white font-black tracking-widest mb-3">
          <div className="flex items-center gap-3">
            {isTracking && <span className="text-green-300 animate-pulse">● LIVE TRACKING</span>}
            <span className="opacity-70">60%</span>
            <span>{formattedTime}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
              <Truck className="w-7 h-7 text-red-600"/>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">QuickHaul</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsTracking(!isTracking)} className={`${isTracking ? 'bg-green-500' : 'bg-red-500'} border-2 border-white/20 p-2.5 rounded-2xl text-white transition-all active:scale-90 shadow-md`}>
              <Power className="w-6 h-6"/>
            </button>
          </div>
        </div>
      </div>
      
      {/* Dynamic Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col bg-slate-50">
        
        {activeTab === 'home' && (
          <div className="flex-1 overflow-y-auto bg-slate-800 p-5">
            <div className="space-y-6">
              <div className="bg-slate-700/50 p-4 rounded-xl text-sm text-white/50 text-center font-bold">
                정보망 이용약관 <span className="text-orange-400">위반시 사용정지</span> 됩니다.
              </div>
              <div className="grid grid-cols-2 gap-5">
                <GridButton icon={Search} label="화물정보" color="bg-blue-500" onClick={() => setActiveTab('market')} badge={marketOrders.length} />
                <GridButton icon={ClipboardList} label="배차내역" color="bg-emerald-500" onClick={() => setActiveTab('active')} badge={myOrders.length} />
                <GridButton icon={PlusSquare} label="화물등록" color="bg-orange-500" onClick={() => setActiveTab('register')} />
                <GridButton icon={Zap} label="스마트배차" color={isTracking ? "bg-cyan-500" : "bg-slate-500"} onClick={() => setActiveTab('smart')} subtext={isTracking ? "내 주변 콜" : "위치추적 OFF"} />
                <GridButton icon={Headset} label="고객센터" color="bg-slate-500" />
                <GridButton icon={Wallet} label="수익관리" color="bg-amber-500" onClick={() => setActiveTab('wallet')} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'active' && (
          <div className="flex-1 flex flex-col bg-slate-50 animate-in slide-in-from-right-10">
            <div className="bg-white px-5 pt-8 pb-4 shrink-0 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => setActiveTab('home')} className="text-slate-900 flex items-center gap-2 text-lg font-black"><ChevronRight className="w-6 h-6 rotate-180"/> 배차 내역</button>
                    <div className="w-10"></div>
                </div>
                <div className="flex w-full border-b border-slate-100">
                    <button 
                        onClick={() => setActiveSubTab('pending')}
                        className={`flex-1 py-4 text-xl font-bold transition-all border-b-4 ${activeSubTab === 'pending' ? 'border-blue-600 text-slate-900' : 'border-transparent text-slate-300'}`}
                    >
                        하차 전
                    </button>
                    <button 
                        onClick={() => setActiveSubTab('completed')}
                        className={`flex-1 py-4 text-xl font-bold transition-all border-b-4 ${activeSubTab === 'completed' ? 'border-blue-600 text-slate-900' : 'border-transparent text-slate-300'}`}
                    >
                        하차 완료
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-10">
                {groupedOrders.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center">
                        <Clock className="w-12 h-12 text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold text-lg">내역이 없습니다.</p>
                    </div>
                ) : groupedOrders.map(group => (
                    <div key={group.dateLabel} className="space-y-4">
                        <h4 className="text-xl font-black text-slate-900 tracking-tight">{group.dateLabel}</h4>
                        <div className="space-y-4">
                            {group.items.map(order => (
                                <div key={order.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm relative overflow-hidden active:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-600 text-2xl font-black">
                                                {order.status === OrderStatus.COMPLETED ? '완료' : '하차'} 
                                            </span>
                                            <span className="text-2xl font-black text-slate-900">
                                                {new Date(order.createdAt).getHours()}:00까지
                                            </span>
                                        </div>
                                        <span className={`px-3 py-1.5 rounded-lg text-sm font-black text-white ${order.status === OrderStatus.COMPLETED ? 'bg-slate-400' : 'bg-blue-600'}`}>
                                            {order.status === OrderStatus.PICKUP ? '운송 중' : order.status === OrderStatus.ACCEPTED ? '운송 대기' : '운송 완료'}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-4 relative">
                                        <div className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 mt-2 flex items-center justify-center shrink-0">
                                                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xl font-bold text-slate-500 flex items-center gap-2">
                                                    {order.origin.split(' ')[0]} {order.origin.split(' ')[1]}
                                                    <span className="bg-slate-200 text-slate-500 text-[10px] px-1 rounded">지</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="absolute left-[9px] top-6 bottom-6 w-[2px] bg-slate-100 border-l border-dashed border-slate-200"></div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full border-2 border-slate-900 mt-2 flex items-center justify-center shrink-0">
                                                <div className="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xl font-black text-slate-900 flex items-center gap-2">
                                                    {order.destination.split(' ')[0]} {order.destination.split(' ')[1]}
                                                    <span className="bg-slate-200 text-slate-500 text-[10px] px-1 rounded">지</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {order.status !== OrderStatus.COMPLETED && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); completeOrder(order.id); }}
                                            className="w-full mt-8 py-4 bg-orange-600 text-white rounded-2xl text-xl font-black shadow-lg shadow-orange-100"
                                        >
                                            운송완료 체크
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}

        {activeTab !== 'home' && (
           <div className="h-24 bg-white border-t border-slate-100 flex items-center justify-around px-4 shrink-0 shadow-2xl">
              {[
                  { icon: Home, label: '홈', tab: 'home' },
                  { icon: Search, label: '화물정보', tab: 'market' },
                  { icon: ClipboardList, label: '배차내역', tab: 'active' },
                  { icon: UserCircle, label: '마이', tab: 'wallet' },
              ].map((item, idx) => (
                  <button 
                      key={idx} 
                      onClick={() => setActiveTab(item.tab as any)}
                      className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.tab ? 'text-blue-600' : 'text-slate-400'}`}
                  >
                      <item.icon className="w-7 h-7" />
                      <span className="text-sm font-black">{item.label}</span>
                  </button>
              ))}
           </div>
        )}

        {activeTab === 'market' && (
            <div className="flex-1 bg-slate-800 p-5 overflow-y-auto pb-24">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => setActiveTab('home')} className="text-white flex items-center gap-2 text-base font-black"><ChevronRight className="w-6 h-6 rotate-180"/> 뒤로</button>
                    <span className="text-white text-xl font-black">실시간 오더</span>
                    <div className="w-10"></div>
                </div>
                {marketOrders.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-3xl border-l-8 border-orange-500 shadow-xl mb-4">
                    <div className="flex justify-between mb-3">
                        <span className="text-2xl font-black text-slate-900">{order.price.toLocaleString()}원</span>
                        <span className="text-sm font-black text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-lg">{order.vehicleType}</span>
                    </div>
                    <p className="text-lg font-black text-slate-800 mb-4">{order.origin} → {order.destination}</p>
                    <button onClick={() => acceptOrder(order.id)} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xl font-black">배차수락</button>
                </div>
                ))}
            </div>
        )}

        {activeTab === 'wallet' && (
            <div className="flex-1 bg-slate-800 overflow-y-auto pb-24">
                <div className="p-5 flex justify-between items-center">
                    <button onClick={() => setActiveTab('home')} className="text-white flex items-center gap-2 text-base font-black"><ChevronRight className="w-6 h-6 rotate-180"/> 뒤로</button>
                    <span className="text-white text-xl font-black">수익 관리</span>
                    <div className="w-10"></div>
                </div>
                <SettlementDashboard orders={orders} />
            </div>
        )}

        {activeTab === 'register' && (
            <div className="flex-1 bg-slate-800 overflow-y-auto pb-24 p-5">
                <div className="flex justify-between items-center mb-8">
                    <button onClick={() => setActiveTab('home')} className="text-white flex items-center gap-2 text-base font-black"><ChevronRight className="w-6 h-6 rotate-180"/> 뒤로</button>
                    <span className="text-white text-xl font-black">정보 등록</span>
                    <div className="w-10"></div>
                </div>
                <RegistrationForm 
                    currentReg={myRegistration}
                    onCancel={() => setActiveTab('home')}
                    onSubmit={(data: any) => {
                        submitRegistration(data);
                        alert('신청이 완료되었습니다.');
                        setActiveTab('home');
                    }}
                />
            </div>
        )}

        {activeTab === 'smart' && (
            <div className="flex-1 bg-slate-800 p-5 overflow-y-auto pb-24">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => setActiveTab('home')} className="text-white flex items-center gap-2 text-base font-black"><ChevronRight className="w-6 h-6 rotate-180"/> 뒤로</button>
                    <div className="flex flex-col items-center">
                        <span className="text-white text-xl font-black">스마트배차 (추천)</span>
                        <span className="text-xs text-cyan-400 font-bold tracking-widest uppercase">Nearby 5km</span>
                    </div>
                    <div className="w-10"></div>
                </div>
                {!isTracking ? (
                <div className="bg-slate-700 p-10 rounded-3xl text-center">
                    <LocateFixed className="w-16 h-16 text-slate-500 mx-auto mb-6" />
                    <p className="text-white text-2xl font-black mb-3">위치 추적을 켜주세요</p>
                    <button onClick={() => setIsTracking(true)} className="w-full py-5 bg-cyan-600 text-white rounded-2xl font-black text-xl">위치 추적 활성화</button>
                </div>
                ) : smartOrders.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-3xl border-l-8 border-cyan-500 shadow-xl mb-4">
                    <div className="flex justify-between mb-3">
                    <div className="flex flex-col">
                        <span className="text-2xl font-black">{order.price.toLocaleString()}원</span>
                        <span className="text-sm text-cyan-600 font-black">약 1.2km 근처</span>
                    </div>
                    <span className="text-sm font-black text-slate-400 uppercase">{order.vehicleType}</span>
                    </div>
                    <p className="text-lg font-black text-slate-800 mb-4">{order.origin} → {order.destination}</p>
                    <button onClick={() => acceptOrder(order.id)} className="w-full py-4 bg-cyan-600 text-white rounded-2xl text-xl font-black shadow-lg shadow-cyan-200">즉시 배차</button>
                </div>
                ))}
            </div>
        )}
      </div>

      <div className="h-6 w-full flex justify-center items-center bg-white shrink-0">
        <div className="w-32 h-1.5 bg-slate-200 rounded-full"></div>
      </div>
    </div>
  );
};
