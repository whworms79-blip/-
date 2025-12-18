
import React, { useState } from 'react';
import { Order, VehicleType, UserRole } from '../types';
import { CustomerView } from './CustomerView';
import { Truck, Shield, Clock, Smartphone, ChevronRight, Globe, Search, User } from 'lucide-react';

interface LandingViewProps {
  orders: Order[];
  addOrder: (order: any) => void;
  onOpenPortal: (role: UserRole.DRIVER | UserRole.ADMIN) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ orders, addOrder, onOpenPortal }) => {
  return (
    <div className="bg-white">
      {/* Global Navigation */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-2 rounded-xl text-white">
              <Truck className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">QuickHaul</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-bold text-slate-500">
            <a href="#service" className="hover:text-slate-900">서비스 소개</a>
            <a href="#price" className="hover:text-slate-900">요금 안내</a>
            <a href="#tracking" className="hover:text-slate-900">화물 추적</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onOpenPortal(UserRole.DRIVER)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4"/> 기사용 앱
            </button>
            <button 
              onClick={() => onOpenPortal(UserRole.ADMIN)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-black transition-all"
            >
              관리자 포털
            </button>
          </div>
        </div>
      </nav>

      {/* Main Booking Section (Existing CustomerView logic integrated into Landing) */}
      <CustomerView 
        addOrder={addOrder} 
        myOrders={orders.filter(o => o.customerName === '홍길동')} 
      />

      {/* Feature Section */}
      <section id="service" className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">왜 퀵홀(QuickHaul)인가요?</h2>
          <p className="text-slate-500 text-lg">기존 배차 앱들의 장점만을 모아 가장 진보된 물류 경험을 제공합니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="p-10 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-orange-200 transition-all">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 transition-transform">
              <Shield className="w-8 h-8 text-orange-600"/>
            </div>
            <h3 className="text-xl font-black mb-4">철저한 보안 및 보험</h3>
            <p className="text-slate-500 leading-relaxed">전국 화물 연합과 연계하여 모든 운송 건에 대해 최대 5억원의 현대해상 적재물 보험이 자동 가입됩니다.</p>
          </div>
          <div className="p-10 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-orange-200 transition-all">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 transition-transform">
              <Clock className="w-8 h-8 text-blue-600"/>
            </div>
            <h3 className="text-xl font-black mb-4">실시간 도착 정보 (LBS)</h3>
            <p className="text-slate-500 leading-relaxed">화물맨 기술력을 바탕으로 기사님의 현재 위치를 지도에서 실시간으로 확인하고 하차지 담당자에게 자동 전송합니다.</p>
          </div>
          <div className="p-10 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-orange-200 transition-all">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 transition-transform">
              <Globe className="w-8 h-8 text-green-600"/>
            </div>
            <h3 className="text-xl font-black mb-4">수수료 0원 프로모션</h3>
            <p className="text-slate-500 leading-relaxed">더운반의 혁신적인 정산 시스템을 벤치마킹하여, 기사님께 수수료를 받지 않고 운송 완료 즉시 포인트를 지급합니다.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 px-6 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-20 mb-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Truck className="w-8 h-8 text-orange-500" />
              <span className="text-3xl font-black tracking-tighter">QuickHaul</span>
            </div>
            <p className="text-slate-400 max-w-sm mb-8">
              대한민국 1등 지능형 배차 플랫폼. AI가 분석하고 기사가 달리는 혁신적인 물류 생태계를 구축합니다.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-slate-200 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li><a href="#" className="hover:text-white">회사소개</a></li>
              <li><a href="#" className="hover:text-white">인재채용</a></li>
              <li><a href="#" className="hover:text-white">공지사항</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-slate-200 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li><a href="#" className="hover:text-white">고객센터</a></li>
              <li><a href="#" className="hover:text-white">이용약관</a></li>
              <li><a href="#" className="hover:text-white">개인정보처리방침</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs">
          <p>© 2024 QuickHaul Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>사업자등록번호: 123-45-67890</span>
            <span>대표이사: 홍길동</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
