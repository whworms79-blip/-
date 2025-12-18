
import React from 'react';
import { UserRole, Order } from '../types';
import { DriverView } from './DriverView';
import { AdminView } from './AdminView';
import { LogOut, LayoutDashboard, Truck, Smartphone, Bell, User } from 'lucide-react';

interface PartnerPortalProps {
  role: UserRole.DRIVER | UserRole.ADMIN;
  setRole: (role: UserRole.DRIVER | UserRole.ADMIN) => void;
  orders: Order[];
  acceptOrder: (id: string) => void;
  completeOrder: (id: string) => void;
  onExit: () => void;
  onSimulate: () => void;
  onReset: () => void;
}

export const PartnerPortal: React.FC<PartnerPortalProps> = ({ 
  role, setRole, orders, acceptOrder, completeOrder, onExit, onSimulate, onReset 
}) => {
  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-0 md:p-10 font-sans overflow-hidden">
      {/* App Frame - This gives the 'Not Responsive / Dedicated App' feel on Desktop */}
      <div className="w-full h-screen md:h-[844px] md:w-[390px] bg-white md:rounded-[40px] md:shadow-[0_0_80px_rgba(0,0,0,0.2)] relative overflow-hidden flex flex-col border-[8px] border-slate-900 md:border-slate-800">
        
        {/* Notch / Header Area */}
        <div className="h-10 w-full flex justify-center items-end pb-1 hidden md:flex">
          <div className="w-32 h-6 bg-slate-800 rounded-b-2xl"></div>
        </div>

        {/* Global App Actions (Mini Header) */}
        <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-slate-50 shrink-0">
          <button onClick={onExit} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <LogOut className="w-5 h-5 rotate-180" />
          </button>
          <div className="flex items-center gap-1">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black tracking-widest text-slate-800 uppercase">Live Connection</span>
          </div>
          <button className="p-2 text-slate-400 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-600 rounded-full border-2 border-white"></span>
          </button>
        </div>

        {/* Dynamic App Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          {role === UserRole.DRIVER ? (
            <DriverView 
              orders={orders} 
              acceptOrder={acceptOrder} 
              completeOrder={completeOrder} 
            />
          ) : (
            <div className="scale-[0.6] origin-top w-[650px] -ml-[130px] h-full overflow-hidden">
                <AdminView 
                    orders={orders} 
                    onReset={onReset} 
                    onSimulate={onSimulate} 
                />
            </div>
          )}
        </div>

        {/* App Tab Bar Navigation */}
        <div className="h-20 bg-white border-t border-slate-100 flex items-center justify-around px-4 shrink-0">
          <button 
            onClick={() => setRole(UserRole.DRIVER)}
            className={`flex flex-col items-center gap-1 transition-all ${role === UserRole.DRIVER ? 'text-orange-600' : 'text-slate-400'}`}
          >
            <Truck className="w-6 h-6" />
            <span className="text-[10px] font-black">기사앱</span>
          </button>
          
          <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center -mt-8 shadow-xl shadow-slate-300 ring-4 ring-white active:scale-90 transition-transform cursor-pointer" onClick={onSimulate}>
            <Bell className="w-5 h-5 text-white" />
          </div>

          <button 
            onClick={() => setRole(UserRole.ADMIN)}
            className={`flex flex-col items-center gap-1 transition-all ${role === UserRole.ADMIN ? 'text-slate-900' : 'text-slate-400'}`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-black">통제실</span>
          </button>
        </div>

        {/* Home Indicator (iOS style) */}
        <div className="h-6 w-full flex justify-center items-center shrink-0">
          <div className="w-32 h-1 bg-slate-200 rounded-full"></div>
        </div>
      </div>

      {/* Background Side Info for Desktop Viewers */}
      <div className="hidden lg:block absolute right-20 top-20 max-w-xs">
        <h3 className="text-2xl font-black text-slate-400 mb-4 opacity-50 uppercase tracking-tighter">Partner Workspace</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          기사님과 관리자를 위한 전용 앱 인터페이스입니다. 데스크탑에서도 일관된 조작 경험을 위해 앱 형태로 제공됩니다.
        </p>
        <div className="p-4 bg-white/50 rounded-2xl border border-white/20">
          <p className="text-xs text-slate-500 font-bold mb-2 uppercase">연동 시스템</p>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>• LBS 실시간 차량 추적기</li>
            <li>• AI 자동 배차 엔진 v2.5</li>
            <li>• 즉시 정산 핀테크 연동</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
