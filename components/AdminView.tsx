
import React from 'react';
import { Order, OrderStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { Users, Truck, DollarSign, Activity, RotateCcw, Zap, Target, Leaf, ShieldCheck, Search } from 'lucide-react';

interface AdminViewProps {
  orders: Order[];
  onReset?: () => void;
  onSimulate?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ orders, onReset, onSimulate }) => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.price, 0);
  
  const statusData = [
    { name: '대기', count: orders.filter(o => o.status === OrderStatus.PENDING).length, color: '#94a3b8' },
    { name: '운행', count: orders.filter(o => o.status === OrderStatus.ACCEPTED).length, color: '#f97316' },
    { name: '완료', count: orders.filter(o => o.status === OrderStatus.COMPLETED).length, color: '#0f172a' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto bg-slate-50 min-h-screen pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">TMS Control Center</h2>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500"/> AI 기반 배차 최적화 및 공차율 관제 중
          </p>
        </div>
        
        <div className="flex items-center gap-2">
           <button onClick={onSimulate} className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all">
             <Zap className="w-4 h-4 fill-current" /> 신규 주문 시뮬레이션
           </button>
           <button onClick={onReset} className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-slate-600">
             <RotateCcw className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
            { label: '배차 효율 (카카오T)', value: '92.4%', icon: Target, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: '누적 매출', value: (totalRevenue/10000).toFixed(1) + '만원', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
            { label: '탄소 절감액', value: '42.1kg', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: '보안 통제', value: 'ACTIVE', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' }
        ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
                <div className={`p-4 rounded-2xl ${stat.bg}`}>
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                </div>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden h-[450px] relative">
                <div className="absolute top-6 left-6 z-20 space-y-2">
                  <div className="bg-slate-900/90 backdrop-blur text-white px-4 py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2">
                    <Search className="w-3 h-3"/> 실시간 LBS 차량 추적 (화물맨 기술)
                  </div>
                  <div className="bg-white/90 backdrop-blur text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-xl border border-slate-100">
                    활성 차량: 12대 / 유휴: 2대
                  </div>
                </div>
                <div className="w-full h-full bg-slate-50 relative">
                    <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
                    {/* Simulated Vehicle Markers */}
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="absolute animate-pulse" style={{top: `${20+i*15}%`, left: `${10+i*12}%`}}>
                        <div className={`w-4 h-4 rounded-full shadow-2xl ring-4 ${i%2===0 ? 'bg-orange-500 ring-orange-100' : 'bg-blue-500 ring-blue-100'}`}></div>
                      </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-900 mb-8 flex items-center justify-between">
                  <span>운송 모니터링 현황</span>
                  <span className="text-xs text-slate-400 font-normal underline cursor-pointer">상세보기</span>
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData} barSize={60}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700}} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{borderRadius: '16px', border:'none', boxShadow:'0 20px 25px -5px rgba(0,0,0,0.1)'}} />
                        <Bar dataKey="count" radius={[12,12,0,0]}>
                            {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-black text-slate-800">통합 로그 (Dispatch King)</h3>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                </div>
                <div className="flex-1 overflow-y-auto max-h-[700px]">
                    {[...orders].map((order, idx) => (
                        <div key={order.id} className={`p-5 border-b border-slate-50 hover:bg-slate-50 transition-all ${idx === 0 ? 'bg-orange-50/30' : ''}`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-900 text-white">
                                    {order.status}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">{new Date(order.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-800 mb-1">{order.origin.split(' ')[1]} → {order.destination.split(' ')[1]}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">고객: {order.customerName}</span>
                              {order.recipientPhone && <span className="text-[9px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded">수신자 알림 완료</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
