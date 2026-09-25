import React from 'react';
import { BusinessLevelId } from '../../types/bi';
import { EDITORIAL_ASSETS } from '../../assets/editorialImages';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface BusinessLevelCardsProps {
  selectedLevel: BusinessLevelId;
  onSelectLevel: (levelId: BusinessLevelId) => void;
  onNavigate: (section: string) => void;
}

export const BusinessLevelCards: React.FC<BusinessLevelCardsProps> = ({
  selectedLevel,
  onSelectLevel,
  onNavigate,
}) => {
  const cards = [
    {
      id: 'local_village' as BusinessLevelId,
      title: 'LOCAL',
      subtitle: 'Access Focus',
      description: 'Single shop, village artisan, or local retail counter managing physical stock & paper logs.',
      image: EDITORIAL_ASSETS.localCommerceArtisan,
      badge: 'Single Counter · Micro Enterprise',
      features: ['Unified Daily Sales Ledger', 'Physical Stock Thresholds', 'Simple Customer Log'],
    },
    {
      id: 'city_growing' as BusinessLevelId,
      title: 'CITY',
      subtitle: 'Intelligence Focus',
      description: 'Multi-category store, growing boutique, or urban commercial outlet seeking pattern insights.',
      image: EDITORIAL_ASSETS.cityGrowingBusiness,
      badge: 'Growing Business · Multi-Category',
      features: ['Revenue Concentration Alerts', 'Customer Repeat Segmentation', 'Stock Buffer Forecasting'],
    },
    {
      id: 'international_global' as BusinessLevelId,
      title: 'INTERNATIONAL',
      subtitle: 'Scale Focus',
      description: 'Regional exporter, multi-supplier distributor, or global commerce firm requiring governance.',
      image: EDITORIAL_ASSETS.globalCommerceTrade,
      badge: 'Cross-Border · Global Distribution',
      features: ['Multi-Currency Ledger', 'Supply Network Reliability', 'Human Decision Audit Trails'],
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-teal-800 font-bold">
            BUSINESS TIERS
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Tailored to Your Operating Scale
          </h2>
        </div>
        <p className="text-xs text-slate-500 max-w-md">
          The intelligence model adapts directly to the specific constraints and data readiness of each operating scale.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card) => {
          const isSelected = selectedLevel === card.id;
          return (
            <div
              key={card.id}
              onClick={() => onSelectLevel(card.id)}
              className={`group relative rounded-2xl overflow-hidden bg-white border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-teal-600 ring-2 ring-teal-500/30 shadow-lg -translate-y-1'
                  : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              {/* Top Image Container with gentle hover zoom */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover object-center filter brightness-[0.88] transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="px-2.5 py-1 rounded-md bg-[#091124]/90 backdrop-blur-md border border-slate-700 text-[10px] font-mono font-bold tracking-wider text-teal-300 uppercase shadow-xs">
                    {card.subtitle}
                  </span>
                </div>

                {/* Selected Status Marker */}
                {isSelected && (
                  <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500 text-white text-[10px] font-bold font-mono shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ACTIVE</span>
                  </div>
                )}

                {/* Image Overlay Title */}
                <div className="absolute bottom-3 left-4 right-4 z-10 text-white">
                  <h3 className="text-lg font-extrabold tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium">
                    {card.badge}
                  </p>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {card.description}
                </p>

                {/* Key Capabilities */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {card.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Action Trigger */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className={isSelected ? 'text-teal-700 font-bold' : 'text-slate-500'}>
                    {isSelected ? 'Currently Selected' : 'Select Level'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLevel(card.id);
                      onNavigate('analyze');
                    }}
                    className="flex items-center gap-1 text-teal-700 hover:text-teal-800 cursor-pointer"
                  >
                    <span>Analyze This Scale</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
