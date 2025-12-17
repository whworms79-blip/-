import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { Package, Truck, CheckCircle, Navigation, Wallet, FileText, CreditCard, ChevronRight, AlertCircle } from 'lucide-react';

interface DriverViewProps {
  orders: Order[];
  acceptOrder: (id: string) => void;
  completeOrder: (id: string) => void;
}

const SettlementView = () => (
  <div className="p-4 space-y-4">
    <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg">
      <p className="text-slate-400 text-sm mb-1">출금 가능 포인트</p>
      <h3 className="text-3xl font-bold mb-4">425,000 P</h3>
      <div className="flex gap-2">
        <button className="flex-1 bg-white text-slate-900 py-2 rounded-lg font-bold text-sm">출금 신청</button>
        <button className="flex-1 bg-slate-700 text-white py-2 rounded-lg font-bold text-sm">내역 보기</button>
      </div>
    </div>

    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-orange-500"/> 최근 정산 내역
      </h4>
      <div className="space-y-3">
        {[1,2,3].map((i) => (
          <div key={i} className="flex justify-between items-center text-sm">
            <div>
              <p className="font-bold text-slate-700">운송료 정산 (서울-부산)</p>
              <p className="text-xs text-slate-400">2024.10.1{i}</p>
            </div>
            <span className="font-bold text-blue-600">+150,000원</span>
          </div>
        ))}
      </div>
    </div>
    
    <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
       <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
       <div>
         <p className="text-sm font-bold text-blue-700">세금계산서 자동 발행</p>
         <p className="text-xs text-blue-600 mt-1">매월 10일 전월 운송료에 대한 세금계산서가 국세청으로 자동 전송됩니다.</p>
       </div>
    </div>
  </div>
);

export const DriverView: React.FC<DriverViewProps> = ({ orders, acceptOrder, completeOrder }) => {
  const [activeTab, setActiveTab] = useState<'market' | 'active' | 'wallet'>('market');

  const marketOrders = orders.filter(o => o.status === OrderStatus.PENDING);
  const myOrders = orders.filter(o => o.status === OrderStatus.ACCEPTED || o.status === OrderStatus.PICKUP);

  return (
    <div className="max-w-md mx-auto h-full flex flex-col bg-slate-50 border-x border-slate-200 min-h-screen">
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 pt-4 pb-2">
        <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
           <Truck className="w-5 h-5 text-orange-500" /> 기사님 파트너 앱
        </h2>
        <div className="flex gap-1">
          {[
            { id: 'market', label: '콜 리스트', count: marketOrders.length },
            { id: 'active', label: '내 운행', count: myOrders.length },
            { id: 'wallet', label: '정산', count: 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all relative ${
                activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-500 bg-slate-100'
              }`}
            >
              {tab.label}
              {tab.count > 0 && tab.id !== 'wallet' && (
                <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {activeTab === 'wallet' ? (
          <SettlementView />
        ) : (
          <div className="p-4 space-y-4">
            {(activeTab === 'market' ? marketOrders : myOrders).length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <Navigation className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>목록이 비어있습니다.</p>
              </div>
            ) : (
              (activeTab === 'market' ? marketOrders : myOrders).map(order => (
                <div key={order.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
                   {order.vehicleType.includes('WING') && (
                     <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                       특장/윙바디
                     </div>
                   )}
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-lg font-bold text-slate-900">{order.price.toLocaleString()}원</span>
                        <p className="text-xs text-slate-500 mt-0.5">{order.vehicleType} · {order.cargoDetails?.weight || '중량 미상'}</p>
                      </div>
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">
                        {new Date(order.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                      </span>
                   </div>
                   
                   <div className="space-y-3 mb-6">
                      <div className="flex gap-3">
                         <div className="w-12 text-xs font-bold text-slate-400 pt-1">상차</div>
                         <div className="flex-1 font-bold text-slate-800">{order.origin}</div>
                      </div>
                      <div className="flex gap-3">
                         <div className="w-12 text-xs font-bold text-slate-400 pt-1">하차</div>
                         <div className="flex-1 font-bold text-slate-800">{order.destination}</div>
                      </div>
                   </div>

                   {activeTab === 'market' ? (
                     <button onClick={() => acceptOrder(order.id)} className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">
                       배차 수락
                     </button>
                   ) : (
                     <div className="flex gap-2">
                       <button className="flex-1 bg-white border border-slate-300 text-slate-700 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-1">
                         <FileText className="w-4 h-4" /> 인수증 서명
                       </button>
                       <button onClick={() => completeOrder(order.id)} className="flex-[2] bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors">
                         운송 완료
                       </button>
                     </div>
                   )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};