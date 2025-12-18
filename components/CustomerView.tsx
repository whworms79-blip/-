
import React, { useState, useEffect, useRef } from 'react';
import { Order, VehicleType, OrderStatus } from '../types';
import { VehicleSelector } from './VehicleSelector';
import { parseNaturalLanguageOrder, getAddressFromCoordinates, calculateFare } from '../services/geminiService';
import { MapPin, Navigation, Sparkles, Loader2, Mic, MicOff, Crosshair, RefreshCw, ChevronRight, Info, ShieldCheck, Clock, Wand2, Box, Phone, FileText, ExternalLink } from 'lucide-react';

interface CustomerViewProps {
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  myOrders: Order[];
}

export const CustomerView: React.FC<CustomerViewProps> = ({ addOrder, myOrders }) => {
  const [origin, setOrigin] = useState('');
  const [originMapUri, setOriginMapUri] = useState<string | undefined>();
  const [destination, setDestination] = useState('');
  const [vehicle, setVehicle] = useState<VehicleType>(VehicleType.MOTORCYCLE);
  const [price, setPrice] = useState(8000); 
  const [cargoWeight, setCargoWeight] = useState('');
  const [cargoType, setCargoType] = useState('');
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Setup Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setAiPrompt((prev) => prev ? `${prev} ${transcript}` : transcript);
          setIsListening(false);
        };
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    } else {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('위치 정보를 지원하지 않습니다.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const result = await getAddressFromCoordinates(latitude, longitude);
          if (result) {
            setOrigin(result.address || `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            setOriginMapUri(result.mapUri);
          } else {
            setOrigin(`GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch {
          setOrigin(`GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        setIsLocating(false);
      },
      () => {
        alert('위치 권한을 확인해주세요.');
        setIsLocating(false);
      }
    );
  };

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
      setCargoWeight(result.cargoWeight || '');
      setCargoType(result.cargoType || '');
      setOriginMapUri(undefined); // Reset map URI when AI parses new text
    }
  };

  const updateFare = async (newVehicle?: VehicleType) => {
    const targetVehicle = newVehicle || vehicle;
    if (!origin || !destination) return;
    setIsPriceLoading(true);
    const calculatedPrice = await calculateFare(origin, destination, targetVehicle);
    setIsPriceLoading(false);
    if (calculatedPrice) setPrice(calculatedPrice);
  };

  const handleVehicleChange = (v: VehicleType) => {
    setVehicle(v);
    if (origin && destination) updateFare(v);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOrder({
      customerName: '홍길동',
      origin,
      destination,
      vehicleType: vehicle,
      price,
      description: aiPrompt || '일반 호출',
      cargoDetails: { weight: cargoWeight, size: '미입력', type: cargoType },
      isInsured: true
    });
    setAiPrompt('');
  };

  const fillDemoData = () => {
    setAiPrompt('인천항 제2부두에서 시흥 공구상가까지 1톤 윙바디, 팔레트 2개');
    setOrigin('인천 중구 서해대로 366 (인천항)');
    setDestination('경기 시흥시 공구상가로 123');
    setVehicle(VehicleType.TRUCK_1TON_WING);
    setPrice(65000);
    setCargoWeight('800kg');
    setCargoType('산업용 팔레트');
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Hero / AI Header */}
      <div className="bg-slate-900 pt-12 pb-24 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-6">
            화물 운송, <span className="text-orange-500">AI로 한 번에</span>
          </h2>
          
          <div className="bg-white rounded-xl shadow-xl p-1.5 flex max-w-2xl mx-auto">
             <div className="flex-1 relative flex items-center">
                <input 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                  placeholder="예: 서울숲에서 분당까지 1톤 트럭 불러줘"
                  className="w-full h-12 pl-4 pr-10 rounded-lg text-slate-900 focus:outline-none"
                />
                <button onClick={toggleListening} className="absolute right-2 text-slate-400">
                  {isListening ? <MicOff className="animate-pulse text-red-500"/> : <Mic/>}
                </button>
             </div>
             <button onClick={handleAiSearch} className="bg-orange-600 text-white px-5 rounded-lg font-bold ml-2">
               {isAiLoading ? <Loader2 className="animate-spin"/> : '조회'}
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Order Form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-800">배차 정보 입력</h3>
                <button onClick={fillDemoData} className="text-xs bg-slate-100 px-2 py-1 rounded flex items-center gap-1">
                  <Wand2 className="w-3 h-3"/> 시연용 입력
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Locations */}
                <div className="space-y-3 relative">
                  <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-slate-100"></div>
                  <div className="relative pl-8">
                    <MapPin className="absolute left-0 top-3 w-5 h-5 text-slate-400 bg-white z-10" />
                    <label className="block text-xs font-bold text-slate-500 mb-1">출발지</label>
                    <div className="flex gap-2">
                       <input 
                        value={origin} 
                        onChange={e => { setOrigin(e.target.value); setOriginMapUri(undefined); }}
                        className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" 
                        placeholder="상차지 주소"
                       />
                       <button type="button" onClick={handleCurrentLocation} className="p-3 bg-slate-100 rounded-lg">
                         {isLocating ? <Loader2 className="animate-spin w-5 h-5"/> : <Crosshair className="w-5 h-5"/>}
                       </button>
                    </div>
                    {originMapUri && (
                      <a href={originMapUri} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 mt-1 flex items-center gap-1 hover:underline">
                        <ExternalLink className="w-2.5 h-2.5" /> Google Maps에서 보기 (Grounding 확인)
                      </a>
                    )}
                  </div>
                  <div className="relative pl-8">
                    <Navigation className="absolute left-0 top-3 w-5 h-5 text-orange-500 bg-white z-10" />
                    <label className="block text-xs font-bold text-slate-500 mb-1">도착지</label>
                    <input 
                      value={destination}
                      onChange={e => setDestination(e.target.value)}
                      onBlur={() => updateFare()}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="하차지 주소"
                    />
                  </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Cargo Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">화물 종류</label>
                    <input 
                      value={cargoType}
                      onChange={e => setCargoType(e.target.value)}
                      placeholder="예: 박스, 가구, 기계"
                      className="w-full p-3 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">화물 무게 (예상)</label>
                    <input 
                      value={cargoWeight}
                      onChange={e => setCargoWeight(e.target.value)}
                      placeholder="예: 500kg"
                      className="w-full p-3 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <VehicleSelector selected={vehicle} onSelect={handleVehicleChange} />

                {/* Price Bar */}
                <div className="bg-slate-800 rounded-xl p-5 text-white flex items-center justify-between shadow-lg">
                   <div>
                     <span className="text-slate-400 text-xs">예상 운임 (적재물 보험 포함)</span>
                     <div className="text-2xl font-bold flex items-center gap-2">
                       {price.toLocaleString()}원
                       <RefreshCw className={`w-4 h-4 text-slate-500 cursor-pointer ${isPriceLoading ? 'animate-spin':''}`} onClick={() => updateFare()}/>
                     </div>
                   </div>
                   <button type="submit" className="bg-orange-600 hover:bg-orange-500 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors">
                     배차 신청 <ChevronRight className="w-4 h-4"/>
                   </button>
                </div>
              </form>
            </div>
          </div>

          {/* Side Panel: Status & Support */}
          <div className="space-y-4">
             {/* Emergency Support Widget */}
             <div className="bg-white p-4 rounded-xl shadow-sm border border-red-100">
               <div className="flex items-center gap-3 mb-2">
                 <div className="bg-red-50 p-2 rounded-full text-red-600">
                   <Phone className="w-5 h-5" />
                 </div>
                 <h4 className="font-bold text-slate-800">긴급 관제 센터</h4>
               </div>
               <p className="text-xs text-slate-500 mb-3">배차 지연이나 사고 발생 시 즉시 연결됩니다.</p>
               <button className="w-full py-2 border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-50 text-sm">
                 1588-0000 (24시간)
               </button>
             </div>

             {/* Recent Orders List */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-700">
                  실시간 운송 현황
                </div>
                {myOrders.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm">진행 중인 주문이 없습니다.</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {myOrders.map(order => (
                      <div key={order.id} className="p-4 hover:bg-slate-50">
                        <div className="flex justify-between items-center mb-2">
                           <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                             order.status === OrderStatus.PENDING ? 'bg-slate-200 text-slate-600' : 
                             order.status === OrderStatus.ACCEPTED ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                           }`}>
                             {order.status === OrderStatus.PENDING ? '배차중' : order.status === OrderStatus.ACCEPTED ? '이동중' : '완료'}
                           </span>
                           <span className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <div className="text-sm font-bold text-slate-800">{order.origin.split(' ')[0]} → {order.destination.split(' ')[0]}</div>
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                          <span>{order.vehicleType}</span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" /> 인수증 {order.status === OrderStatus.COMPLETED ? '발급' : '대기'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
