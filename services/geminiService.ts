import React from 'react';
import { Order, OrderStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Truck, DollarSign, Activity, RotateCcw, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AdminViewProps {
  orders: Order[];
  onReset?: () => void;
  onSimulate?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ orders, onReset, onSimulate }) => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.price, 0);
  
  const data = [
    { name: '대기', count: orders.filter(o => o.status === OrderStatus.PENDING).length, color: '#94a3b8' },
    { name: '운행', count: orders.filter(o => o.status === OrderStatus.ACCEPTED).length, color: '#f97316' },
    { name: '완료', count: orders.filter(o => o.status === OrderStatus.COMPLETED).length, color: '#0f172a' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">통합 관제 시스템 (TMS)</h2>
          <p className="text-slate-500 text-sm mt-1">실시간 배차 모니터링 및 안전 규제 준수 현황</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
           <span className="text-xs font-bold text-slate-400 px-2">데모 컨트롤</span>
           <button onClick={onSimulate} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded transition-colors">
             <Zap className="w-3.5 h-3.5" /> 주문 시뮬레이션
           </button>
           <button onClick={onReset} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded transition-colors">
             <RotateCcw className="w-3.5 h-3.5" /> 리셋
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {[
            { label: '총 주문', value: orders.length + '건', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: '예상 매출', value: (totalRevenue/10000).toFixed(1) + '만원', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
            { label: '가동 차량', value: '12대', icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: '안전 점수', value: '98점', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' }
        ].map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">{stat.label}</p>
                    <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
                </div>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            {/* LBS Map Placeholder */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-96 relative group">
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-md text-xs font-bold shadow-sm">
                    실시간 차량 위치 관제 (LBS)
                </div>
                {/* Mock Map Background */}
                <div className="w-full h-full bg-slate-100 relative">
                    <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                    {/* Simulated Markers */}
                    <div className="absolute top-1/3 left-1/4 animate-bounce">
                        <div className="bg-orange-500 w-3 h-3 rounded-full shadow-lg ring-4 ring-orange-200"></div>
                        <div className="mt-1 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">1톤/김기사</div>
                    </div>
                    <div className="absolute bottom-1/3 right-1/3 animate-bounce" style={{animationDelay: '1s'}}>
                        <div className="bg-blue-500 w-3 h-3 rounded-full shadow-lg ring-4 ring-blue-200"></div>
                        <div className="mt-1 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">다마스/이기사</div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">주문 처리 현황</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barSize={50}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{borderRadius: '8px', border:'none', boxShadow:'0 4px 6px rgba(0,0,0,0.1)'}} />
                        <Bar dataKey="count" radius={[4,4,0,0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            {/* Compliance Feed */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">실시간 로그</h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">LIVE</span>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                    {[...orders].reverse().map(order => (
                        <div key={order.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-sm text-slate-800">
                                    {order.vehicleType === 'MOTORCYCLE' ? '🏍️' : '🚛'} {order.driverId ? '배차완료' : '배차대기'}
                                </span>
                                <span className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <div className="text-xs text-slate-600 mb-1">
                                {order.origin.split(' ')[0]} → {order.destination.split(' ')[0]}
                            </div>
                            {order.cargoDetails && (
                                <div className="text-[10px] text-slate-400 bg-slate-100 inline-block px-1.5 py-0.5 rounded">
                                    {order.cargoDetails.type} / {order.cargoDetails.weight}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-yellow-200 bg-yellow-50">
                <h4 className="font-bold text-yellow-800 flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4" /> 안전 규제 알림
                </h4>
                <ul className="text-xs text-yellow-700 space-y-1">
                    <li>• 기상 악화 지역(강원) 진입 차량 주의</li>
                    <li>• 화물 운송 종사 자격증 갱신 필요: 2명</li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};
