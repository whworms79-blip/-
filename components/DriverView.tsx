
import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { Package, Truck, CheckCircle, Navigation, Wallet, Zap, CreditCard, ChevronRight, Info } from 'lucide-react';

interface DriverViewProps {
  orders: Order[];
  acceptOrder: (id: string) => void;
  completeOrder: (id: string) => void;
}

const SettlementDashboard = () => (
  <div className="p-4 space-y-4 animate-in fade-in">
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
      <div className="relative z-10">
        <p className="text-slate-400 text-xs font-bold mb-1">인출 가능 수익</p>
        <h3 className="text-3xl font-black mb-6">425,000 <span className="text-orange-500 text-xl">원</span></h3>
        <div className="flex gap-2">
          <button className="flex-1 bg-orange-600 hover:bg-orange-500 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 fill-current"/> 즉시 출금
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-4 flex items-center gap-1">
          <Info className="w-3 h-3"/> '더운반'처럼 수수료 0원 혜택 적용 중
        </p>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-10">
        <Wallet className="w-32 h-32" />
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-orange-500"/> 이번 주 정산 리포트
      </h4>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-3">
          <span className="text-slate-500">총 운송 수입</span>
          <span className="font-bold text-slate-900">1,250,000원</span>
        </div>
        <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-3">
          <span className="text-slate-500">수수료 (0%)</span>
          <span className="font-bold text-green-600">- 0원</span>
        </div>
        <div className="flex justify-between items-center text-sm font-bold text-orange-600 bg-orange-50 p-3 rounded-lg">
          <span>최종 정산액</span>
          <span>1,250,000원</span>
        </div>
      </div>
    </div>
  </div>
);

export const DriverView: React.FC<DriverViewProps> = ({ orders, acceptOrder, completeOrder }) => {
  const [activeTab, setActiveTab] = useState<'market' | 'active' | 'wallet'>('market');
  const marketOrders = orders.filter(o => o.status === OrderStatus.PENDING);
  const myOrders = orders.filter(o => o.status === OrderStatus.ACCEPTED || o.status === OrderStatus.PICKUP);

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-slate-50 border-x border-slate-200">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-slate-900">QuickHaul <span className="text-orange-500">Partner</span></h2>
          <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> 운행중
          </div>
        </div>
        <div className="flex gap-2">
          {['market', 'active', 'wallet'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
                activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {tab === 'market' ? '콜 센터' : tab === 'active' ? '운행 관리' : '수익 정산'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'wallet' ? (
          <SettlementDashboard />
        ) : (
          <div className="p-4 space-y-4">
            {(activeTab === 'market' ? marketOrders : myOrders).map(order => (
              <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-orange-200 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-2xl font-black text-slate-900">{order.price.toLocaleString()}원</span>
                    <p className="text-[10px] text-green-600 font-bold">수수료 0원 매물</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold text-slate-500">{order.vehicleType}</span>
                    <p className="text-[10px] text-slate-400 mt-1">오늘 {new Date(order.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6 relative">
                  <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
                  <div className="flex gap-4 relative">
                    <div className="w-3 h-3 rounded-full bg-slate-300 mt-1 border-2 border-white"></div>
                    <div className="flex-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Pickup</p>
                      <p className="text-sm font-bold text-slate-800 leading-tight">{order.origin}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 relative">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mt-1 border-2 border-white"></div>
                    <div className="flex-1">
                      <p className="text-[10px] text-orange-400 font-bold uppercase">Drop-off</p>
                      <p className="text-sm font-bold text-slate-800 leading-tight">{order.destination}</p>
                    </div>
                  </div>
                </div>

                {activeTab === 'market' ? (
                  <button onClick={() => acceptOrder(order.id)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black hover:bg-black transition-all shadow-lg active:scale-95">
                    배차 수락하기
                  </button>
                ) : (
                  <button onClick={() => completeOrder(order.id)} className="w-full bg-orange-600 text-white py-4 rounded-xl font-black hover:bg-orange-700 transition-all shadow-lg">
                    운송 완료 (즉시 정산)
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
