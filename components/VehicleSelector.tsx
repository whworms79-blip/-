import React from 'react';
import { VehicleType } from '../types';
import { Bike, Truck, Box, Package, Container } from 'lucide-react';

interface VehicleSelectorProps {
  selected: VehicleType;
  onSelect: (type: VehicleType) => void;
}

const vehicles = [
  { type: VehicleType.MOTORCYCLE, label: '오토바이', icon: Bike, desc: '~20kg 서류/소박스' },
  { type: VehicleType.DAMAS, label: '다마스', icon: Package, desc: '~350kg 소형이사' },
  { type: VehicleType.LABO, label: '라보', icon: Box, desc: '~500kg 용달' },
  { type: VehicleType.TRUCK_1TON, label: '1톤', icon: Truck, desc: '~1.1톤 일반화물' },
  { type: VehicleType.TRUCK_1TON_WING, label: '1톤윙', icon: Container, desc: '지게차 상하차/우천' },
  { type: VehicleType.TRUCK_2_5TON, label: '2.5톤', icon: Truck, desc: '~2.5톤 대형화물' },
];

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {vehicles.map((v) => (
        <button
          key={v.type}
          onClick={() => onSelect(v.type)}
          type="button"
          className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 h-24 ${
            selected === v.type
              ? 'border-orange-500 bg-orange-50 text-slate-900 shadow-md ring-1 ring-orange-500 transform scale-105 z-10'
              : 'border-slate-200 hover:border-slate-400 text-slate-500 bg-white hover:bg-slate-50'
          }`}
        >
          <v.icon className={`w-6 h-6 mb-1 ${selected === v.type ? 'text-orange-600' : 'text-slate-400'}`} />
          <span className="font-bold text-xs tracking-tight">{v.label}</span>
          <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">{v.desc}</span>
        </button>
      ))}
    </div>
  );
};