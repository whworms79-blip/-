
import React from 'react';
import { UserRole, Order, DriverRegistration } from '../types';
import { DriverView } from './DriverView';
import { AdminView } from './AdminView';
import { LogOut, LayoutDashboard, Truck, Smartphone, Bell, Zap } from 'lucide-react';

interface PartnerPortalProps {
  role: UserRole.DRIVER | UserRole.ADMIN;
  setRole: (role: UserRole.DRIVER | UserRole.ADMIN) => void;
  orders: Order[];
  registrations: DriverRegistration[];
  acceptOrder: (id: string) => void;
  completeOrder: (id: string) => void;
  submitRegistration: (reg: Omit<DriverRegistration, 'id' | 'status' | 'appliedAt'>) => void;
  approveRegistration: (id: string) => void;
  updateLocation?: (id: string, lat: number, lng: number, tracking: boolean) => void;
  onExit: () => void;
  onSimulate: () => void;
  onReset: () => void;
}

export const PartnerPortal: React.FC<PartnerPortalProps> = ({ 
  role, setRole, orders, registrations, acceptOrder, completeOrder, submitRegistration, approveRegistration, updateLocation, onExit, onSimulate, onReset 
}) => {
  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-0 md:p-10 font-sans overflow-hidden">
      {/* App Frame */}
      <div className="w-full h-screen md:h-[844px] md:w-[390px] bg-white md:rounded-[40px] md:shadow-[0_0_80px_rgba(0,0,0,0.2)] relative overflow-hidden flex flex-col border-[8px] border-slate-900 md:border-slate-800">
        
        {/* Notch Area */}
        <div className="h-10 w-full flex justify-center items-end pb-1 hidden md:flex shrink-0">
          <div className="w-32 h-6 bg-slate-800 rounded-b-2xl"></div>
        </div>

        {/* Global App Actions */}
        <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-slate-50 shrink-0">
          <button onClick={onExit} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <LogOut className="w-5 h-5 rotate-180" />
          </button>
          <div className="flex items-center gap-1">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black tracking-widest text-slate-800 uppercase">System Live</span>
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
              registrations={registrations}
              acceptOrder={acceptOrder} 
              completeOrder={completeOrder}
              submitRegistration={submitRegistration}
              updateLocation={updateLocation}
            />
          ) : (
            <div className="scale-[0.55] origin-top w-[700px] -ml-[155px] h-full overflow-hidden">
                <AdminView 
                    orders={orders} 
                    registrations={registrations}
                    approveRegistration={approveRegistration}
                    onReset={onReset} 
                    onSimulate={onSimulate} 
                />
            </div>
          )}
        </div>

        {/* Bottom Navigation Removed as per user request */}

        {/* Home Indicator */}
        <div className="h-8 w-full flex justify-center items-center shrink-0">
          <div className="w-32 h-1.5 bg-slate-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
