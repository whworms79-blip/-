
import React, { useState, useEffect, useRef } from 'react';
import { Order, VehicleType, OrderStatus } from '../types';
import { VehicleSelector } from './VehicleSelector';
import { parseNaturalLanguageOrder, getAddressFromCoordinates, calculateFare } from '../services/geminiService';
import { MapPin, Navigation, Sparkles, Loader2, Mic, MicOff, Crosshair, RefreshCw, ChevronRight, Share2, ShieldCheck, Clock, UserPlus, Box, Phone, CheckCircle2, Map } from 'lucide-react';

interface CustomerViewProps {
  addOrder: (order: any) => void;
  myOrders: Order[];
}

export const CustomerView: React.FC<CustomerViewProps> = ({ addOrder, myOrders }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [vehicle, setVehicle] = useState<VehicleType>(VehicleType.MOTORCYCLE);
  const [price, setPrice] = useState(8000);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleAiSearch = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    const result = await parseNaturalLanguageOrder(aiPrompt);
    setIsAiLoading(false);
    if (result) {
      setOrigin(result.origin);
      setDestination(result.destination);
      setVehicle(result.vehicleType);
      setPrice(result.estimatedPrice);
      if (result.recipientPhone) setRecipientPhone(result.recipientPhone);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOrder({
      customerName: '홍길동',
      origin,
      destination,
      recipientPhone,
      vehicleType: vehicle,
      price,
      fee: 0,
      description: aiPrompt,
      isInsured: true,
      payoutStatus: 'PENDING'
    });
    setAiPrompt('');
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Hero with AI */}
      <div className="bg-slate-900 pt-12 pb-24 px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">스마트한 화물 호출, <span className="text-orange-500">퀵홀</span></h2>
        <div className="max-w-2xl mx-auto flex bg-white rounded-xl p-1.5 shadow-2xl">
          <input 
            value={aiPrompt} 
            onChange={e => setAiPrompt(e.target.value)} 
            placeholder="예: 강남역에서 판교로 다마스, 담당자 010-1234-5678"
            className="flex-1 px-4 outline-none text-slate-800"
          />
          <button onClick={handleAiSearch} className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold">
            {isAiLoading ? <Loader2 className="animate-spin"/> : 'AI 분석'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Box className="text-orange-600 w-5 h-5"/> 배차 예약
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative pl-8">
                <MapPin className="absolute left-0 top-3 text-slate-400 w-5 h-5" />
                <label className="text-xs font-bold text-slate-500">출발지</label>
                <input value={origin} onChange={e => setOrigin(e.target.value)} className="w-full p-3 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-orange-500" placeholder="상차지 주소"/>
              </div>
              <div className="relative pl-8">
                <Navigation className="absolute left-0 top-3 text-orange-500 w-5 h-5" />
                <label className="text-xs font-bold text-slate-500">도착지</label>
                <input value={destination} onChange={e => setDestination(e.target.value)} className="w-full p-3 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-orange-500" placeholder="하차지 주소"/>
              </div>
              <div className="relative pl-8">
                <UserPlus className="absolute left-0 top-3 text-blue-500 w-5 h-5" />
                <label className="text-xs font-bold text-slate-500">도착지 담당자 (배차킹 스타일 알림)</label>
                <input value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} className="w-full p-3 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-orange-500" placeholder="010-0000-0000"/>
              </div>
            </div>
            <VehicleSelector selected={vehicle} onSelect={setVehicle} />
            <div className="bg-slate-900 rounded-xl p-5 text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Estimated Fare</p>
                <p className="text-2xl font-bold text-orange-400">{price.toLocaleString()}원</p>
                <p className="text-[10px] text-green-400">플랫폼 수수료 0원 이벤트 중!</p>
              </div>
              <button className="bg-orange-600 hover:bg-orange-500 px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105">
                지금 호출하기
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500"/> 실시간 내 화물
            </h4>
            {myOrders.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-10">주문 내역이 없습니다.</p>
            ) : (
              <div className="space-y-4">
                {myOrders.map(order => (
                  <div key={order.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-orange-100 text-orange-600">
                        {order.status === OrderStatus.PENDING ? '매칭중' : order.status === OrderStatus.ACCEPTED ? '픽업중' : '완료'}
                      </span>
                      <button className="text-slate-400 hover:text-blue-500"><Share2 className="w-4 h-4"/></button>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className={`h-1.5 flex-1 rounded-full ${order.status !== OrderStatus.PENDING ? 'bg-orange-500' : 'bg-slate-200'}`}></div>
                      <div className={`h-1.5 flex-1 rounded-full ${order.status === OrderStatus.COMPLETED ? 'bg-orange-500' : 'bg-slate-200'}`}></div>
                    </div>
                    <p className="text-sm font-bold truncate">{order.origin.split(' ')[1]} → {order.destination.split(' ')[1]}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                      <Map className="w-3 h-3"/> 실시간 위치 확인 (화물맨 기능)
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-lg">
             <h4 className="font-bold mb-1">적재물 보험 100% 가입</h4>
             <p className="text-[10px] opacity-80">QuickHaul은 모든 운송에 대해 최대 5억원 보장 보험을 자동 적용합니다.</p>
             <ShieldCheck className="w-10 h-10 mt-4 opacity-20 ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};
