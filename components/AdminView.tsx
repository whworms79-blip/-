
import React from 'react';
import { Order, OrderStatus, DriverRegistration } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Truck, DollarSign, Activity, RotateCcw, Zap, Target, Leaf, ShieldCheck, Search, CheckCircle, XCircle, Clock, MapPin, LocateFixed, SignalHigh } from 'lucide-react';

interface AdminViewProps {
  orders: Order[];
  registrations: DriverRegistration[];
  approveRegistration: (id: string) => void;
  onReset?: () => void;
  onSimulate?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ orders, registrations, approveRegistration, onReset, onSimulate }) => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.price, 0);
  const pendingRegs = registrations.filter(r => r.status === 'PENDING');
  const activeDrivers = registrations.filter(r => r.isTracking);
  
  const statusData = [
    { name: '대기', count: orders.filter(o => o.status === OrderStatus.PENDING).length, color: '#94a3b8' },
    { name: '운행', count: orders.filter(o => o.status === OrderStatus.ACCEPTED).length, color: '#f97316' },
    { name: '완료', count: orders.filter(o => o.status === OrderStatus.COMPLETED).length, color: '#0f172a' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto bg-slate-50 min-h-screen pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">QuickHaul Control</h2>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2 font-bold">
            <Activity className="w-4 h-4 text-green-500"/> 실시간 기사 위치 및 배차 최적화 관제 중
          </p>
        </div>
        
        <div className="flex items-center gap-2">
           <button onClick={onSimulate} className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all">
             <Zap className="w-4 h-4 fill-current" /> 신규 주문 생성
           </button>
           <button onClick={onReset} className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-slate-600">
             <RotateCcw className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
            { label: '배차 효율', value: '92.4%', icon: Target, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: '활성 기사', value: activeDrivers.length + '명', icon: LocateFixed, color: 'text-cyan-600', bg: 'bg-cyan-50' },
            { label: '승인 대기', value: pendingRegs.length + '건', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: '보안 통제', value: 'NORMAL', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' }
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Live Fleet Section */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
              <LocateFixed className="w-5 h-5 text-cyan-600"/> 실시간 기사 관제
            </h3>
            <div className="flex-1 overflow-y-auto max-h-[400px] space-y-4">
                {activeDrivers.length === 0 ? (
                    <div className="py-20 text-center text-slate-300 text-xs font-bold">현재 추적 중인 기사가 없습니다.</div>
                ) : activeDrivers.map(drv => (
                    <div key={drv.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2">
                            <SignalHigh className="w-3 h-3 text-green-500 animate-pulse" />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
                                <Truck className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900">{drv.driverName}</h4>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">{drv.carNumber}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold">
                            <MapPin className="w-3 h-3 text-orange-500" />
                            <span>{drv.latitude?.toFixed(4)}, {drv.longitude?.toFixed(4)}</span>
                            <span className="text-slate-300 ml-auto">업데이트: {new Date(drv.lastLocationUpdate || 0).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'})}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-900 mb-8 flex items-center justify-between">
              <span>운송 통계 분석</span>
              <span className="text-xs text-slate-400 font-normal">전체 네트워크 상태</span>
            </h3>
            <div className="h-72">
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
      
      {/* Registration Approval Section */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600"/> 기사 승인 대기 목록
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pendingRegs.map(reg => (
                <div key={reg.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900">{reg.driverName}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">{reg.carNumber} | {reg.vehicleType}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => approveRegistration(reg.id)}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      승인
                    </button>
                    <button className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-bold rounded-lg transition-colors">
                      반려
                    </button>
                  </div>
                </div>
              ))}
              {pendingRegs.length === 0 && <p className="col-span-3 text-center py-10 text-slate-400 text-sm font-bold">승인 대기 중인 기사가 없습니다.</p>}
          </div>
      </div>
    </div>
  );
};
