import React from 'react';
import { BusinessLevelId, NavSection } from '../../types/bi';
import { SectionHeader } from '../common/SectionHeader';
import { useI18n } from '../../context/I18nContext';
import {
  ArrowRight,
  ShieldCheck,
  Database,
  CheckCircle2,
  FileCheck2,
  Cpu,
  TrendingUp,
  UserCheck,
  Sparkles,
  Layers,
  LineChart,
  Lightbulb,
  AlertTriangle,
  BookOpen,
  Info,
} from 'lucide-react';

interface MethodologyViewProps {
  selectedLevel: BusinessLevelId;
  onNavigate: (section: NavSection) => void;
  onSelectLevel?: (levelId: BusinessLevelId) => void;
}

export const MethodologyView: React.FC<MethodologyViewProps> = ({
  onNavigate,
}) => {
  const { locale } = useI18n();

  // Multi-language strings for Methodology & Research (English default + localized variants)
  const isHindi = locale === 'hi';
  const isMarathi = locale === 'mr';

  const strings = {
    title: isHindi ? 'यह कैसे काम करता है' : isMarathi ? 'हे कसे कार्य करते' : 'How It Works',
    subtitle: isHindi
      ? 'डेटा प्रवाह, एआई विधियों और मानव निर्णय शासन का संक्षिप्त विवरण।'
      : isMarathi
      ? 'डेटा प्रवाह, एआय पद्धती आणि मानवी निर्णय प्रणालीचा संक्षिप्त आढावा.'
      : 'A concise overview of data flow, AI methods, and human decision governance.',
    returnDashboard: isHindi ? 'डैशबोर्ड पर लौटें' : isMarathi ? 'डॅशबोर्डवर परत जा' : 'Return to Dashboard',
    openDecisions: isHindi ? 'निर्णय कंसोल खोलें' : isMarathi ? 'निर्णय कन्सोल उघडा' : 'Open Decision Console',
    
    // Core Principle
    coreTitle: 'AI ANALYZES. HUMANS DECIDE.',
    coreSubtitle: isHindi
      ? 'एआई केवल विश्लेषण और निर्णय तैयारी में सहायता करता है। यह स्वतः कोई व्यावसायिक निर्णय नहीं लेता और न ही लागू करता है।'
      : isMarathi
      ? 'एआय केवळ विश्लेषण आणि निर्णय तयारीत मदत करतो. तो आपोआप व्यावसायिक निर्णय घेत नाही किंवा लागू करत नाही.'
      : 'AI supports analysis and decision preparation. It does not automatically make or execute business decisions.',
    
    // Visual Flow
    flowHeader: isHindi ? 'प्रणाली कार्यप्रवाह' : isMarathi ? 'प्रणाली कार्यप्रवाह' : 'System Workflow',
    steps: [
      {
        num: '01',
        title: 'BUSINESS DATA',
        desc: isHindi
          ? 'व्यावसायिक अभिलेख या अपलोड किया गया डेटासेट इनपुट प्रदान करते हैं।'
          : isMarathi
          ? 'व्यवसाय नोंदी किंवा अपलोड केलेला डेटासेट इनपुट प्रदान करतात.'
          : 'Business records or uploaded datasets provide the input.',
        target: 'data' as NavSection,
        icon: Database,
      },
      {
        num: '02',
        title: 'DATA QUALITY',
        desc: isHindi
          ? 'प्रणाली जांचती है कि उपलब्ध डेटा उपयोग योग्य है या नहीं।'
          : isMarathi
          ? 'उपलब्ध डेटा वापरण्यायोग्य आहे की नाही हे प्रणाली तपासते.'
          : 'The system checks whether the available data is usable.',
        target: 'analyze' as NavSection,
        icon: FileCheck2,
      },
      {
        num: '03',
        title: 'BUSINESS ANALYSIS',
        desc: isHindi
          ? 'निश्चित गणनाएं मापने योग्य पैटर्न की पहचान करती हैं।'
          : isMarathi
          ? 'निश्चित गणिते मोजण्यायोग्य पॅटर्न ओळखतात.'
          : 'Deterministic calculations identify measurable patterns.',
        target: 'charts' as NavSection,
        icon: LineChart,
      },
      {
        num: '04',
        title: 'AI INTERPRETATION',
        desc: isHindi
          ? 'जेमिनी समर्थित पैटर्न को सरल व्यावसायिक भाषा में समझाता है।'
          : isMarathi
          ? 'जेमिनी समर्थित पॅटर्न सोप्या व्यावसायिक भाषेत स्पष्ट करतो.'
          : 'Gemini explains supported patterns in simple business language.',
        target: 'insights' as NavSection,
        icon: Sparkles,
      },
      {
        num: '05',
        title: 'AI/ML METHOD',
        desc: isHindi
          ? 'प्रणाली उपयुक्त व्यावसायिक समस्याओं को प्रासंगिक एआई/एमएल दृष्टिकोणों से जोड़ती है।'
          : isMarathi
          ? 'प्रणाली योग्य व्यावसायिक समस्यांना संबंधित एआय/एमएल दृष्टिकोनांशी जोडते.'
          : 'The system maps suitable business problems to relevant AI/ML approaches.',
        target: 'recommendations' as NavSection,
        icon: Cpu,
      },
      {
        num: '06',
        title: 'PRACTICAL ACTION',
        desc: isHindi
          ? 'सिफारिश को एक व्यावहारिक व्यावसायिक कार्यप्रवाह में अनुवादित किया जाता है।'
          : isMarathi
          ? 'शिफारस एका व्यावहारिक व्यावसायिक कार्यप्रवाहात रूपांतरित केली जाते.'
          : 'The recommendation is translated into a possible business workflow.',
        target: 'impact' as NavSection,
        icon: TrendingUp,
      },
      {
        num: '07',
        title: 'HUMAN DECISION',
        desc: isHindi
          ? 'व्यवसाय उपयोगकर्ता समीक्षा करता है और तय करता है कि क्या करना है।'
          : isMarathi
          ? 'व्यवसाय वापरकर्ता पुनरावलोकन करतो आणि काय करायचे ते ठरवतो.'
          : 'The business user reviews and decides what to do.',
        target: 'decision' as NavSection,
        icon: UserCheck,
      },
    ],

    // Core Framework
    frameworkHeader: 'ACCESS → INTELLIGENCE → SCALE',
    frameworkSubtitle: isHindi ? 'मुख्य मार्गदर्शक स्तंभ' : isMarathi ? 'मुख्य मार्गदर्शक स्तंभ' : 'Core Operating Pillars',
    pillars: [
      {
        id: 'access',
        title: 'ACCESS',
        desc: isHindi
          ? 'व्यवसाय को उपयोगी डिजिटल जानकारी और उपकरणों से जोड़ना।'
          : isMarathi
          ? 'व्यवसायाला उपयुक्त डिजिटल माहिती आणि साधनांशी जोडणे.'
          : 'Connect the business to useful digital information and tools.',
      },
      {
        id: 'intelligence',
        title: 'INTELLIGENCE',
        desc: isHindi
          ? 'व्यवसायिक डेटा को अंतर्दृष्टि और संभावित कार्रवाइयों में बदलना।'
          : isMarathi
          ? 'व्यवसाय डेटा अंतर्दृष्टी आणि संभाव्य कृतींमध्ये रूपांतरित करणे.'
          : 'Turn business data into insights and possible actions.',
      },
      {
        id: 'scale',
        title: 'SCALE',
        desc: isHindi
          ? 'बड़े बाजारों और संचालनों में विकास का समर्थन करने के लिए तकनीक का उपयोग करना।'
          : isMarathi
          ? 'मोठ्या बाजारपेठा आणि ऑपरेशन्समध्ये वाढीस समर्थन देण्यासाठी तंत्रज्ञानाचा वापर करणे.'
          : 'Use technology to support growth across larger markets and operations.',
      },
    ],

    // AI/ML Methods
    methodsHeader: isHindi ? 'उपयोग की गई या अनुशंसित विधियां' : isMarathi ? 'वापरलेल्या किंवा शिफारस केलेल्या पद्धती' : 'Methods Used or Recommended',
    methodsSubtitle: isHindi
      ? 'अनुशंसित दृष्टिकोणों से लागू किए गए मॉडलों का स्पष्ट पृथक्करण।'
      : isMarathi
      ? 'शिफारस केलेल्या दृष्टिकोनातून लागू केलेल्या मॉडेलचे स्पष्ट पृथक्करण.'
      : 'Clear distinction between implemented models and recommended methods.',

    // Research Basis
    researchHeader: isHindi ? 'अनुसंधान आधार' : isMarathi ? 'संशोधन आधार' : 'Research Basis',
    
    // Survey Note
    surveyNoteHeader: isHindi ? 'सर्वेक्षण डेटा नोट' : isMarathi ? 'सर्वेक्षण डेटा नोंद' : 'Survey Evidence Note',
    surveyNoteText: isHindi
      ? 'सर्वेक्षण साक्ष्य को एप्लिकेशन के व्यावसायिक डेटा विश्लेषण से अलग रखा गया है। पायलट मान केवल रिपोर्टिंग-टेम्पलेट मान हैं और इन्हें अंतिम फील्ड परिणाम के रूप में प्रस्तुत नहीं किया जाना चाहिए।'
      : isMarathi
      ? 'सर्वेक्षण पुरावे अनुप्रयोगाच्या व्यावसायिक डेटा विश्लेषणापासून वेगळे ठेवले आहेत. पायलट मूल्ये ही केवळ अहवाल-टेम्प्लेट मूल्ये आहेत आणि ती अंतिम फील्ड परिणाम म्हणून सादर केली जाऊ नयेत.'
      : "Survey evidence is maintained separately from the application's business-data analysis. Pilot values are reporting-template values and must not be presented as final field results.",

    // Limitations
    limitationsHeader: isHindi ? 'सीमाएं' : isMarathi ? 'मर्यादा' : 'Limitations',
    limitations: [
      isHindi
        ? 'परिणाम उपलब्ध व्यावसायिक डेटा की गुणवत्ता और पूर्णता पर निर्भर करते हैं।'
        : isMarathi
        ? 'परिणाम उपलब्ध व्यावसायिक डेटाच्या गुणवत्तेवर आणि पूर्णतेवर अवलंबून असतात.'
        : 'Results depend on the quality and completeness of available business data.',
      isHindi
        ? 'एआई व्याख्याओं के लिए मानवीय समीक्षा की आवश्यकता हो सकती है।'
        : isMarathi
        ? 'एआय व्याख्यांसाठी मानवी पुनरावलोकनाची आवश्यकता असू शकते.'
        : 'AI interpretations may require human review.',
      isHindi
        ? 'अनुशंसित एआई/एमएल विधियां स्वतः प्रशिक्षित मॉडल नहीं हैं।'
        : isMarathi
        ? 'शिफारस केलेल्या एआय/एमएल पद्धती आपोआप प्रशिक्षित मॉडेल नसतात.'
        : 'Recommended AI/ML methods are not automatically trained models.',
      isHindi
        ? 'व्यावसायिक प्रभाव को वास्तविक पूर्व-और-बाद के साक्ष्यों का उपयोग करके मापा जाना चाहिए।'
        : isMarathi
        ? 'व्यावसायिक परिणाम प्रत्यक्ष आधी-आणि-नंतरच्या पुराव्यांचा वापर करून मोजला पाहिजे.'
        : 'Business impact must be measured using actual before-and-after evidence.',
      isHindi
        ? 'यह एप्लिकेशन व्यावसायिक परिणामों की गारंटी नहीं देता है।'
        : isMarathi
        ? 'हे ॲप्लिकेशन व्यावसायिक निकालांची हमी देत नाही.'
        : 'The application does not guarantee business outcomes.',
    ],
  };

  // Structured list of AI/ML methods with clear distinction between recommended vs implemented
  const aiMlMethods = [
    {
      name: 'Time-Series Forecasting',
      status: 'Recommended method',
      explanation: 'Uses historical time-based data to estimate future patterns.',
      typicalUse: 'Demand planning, seasonal peaks, and inventory reorder points.',
    },
    {
      name: 'Regression',
      status: 'Recommended method',
      explanation: 'Models mathematical relationships between price, volume, and costs.',
      typicalUse: 'Price elasticity estimation, discount thresholds, and margin sensitivity.',
    },
    {
      name: 'K-Means Clustering',
      status: 'Recommended method',
      explanation: 'Groups customer accounts or catalog items based on shared numerical attributes.',
      typicalUse: 'Customer recency/frequency/spend segmentation and SKU velocity clustering.',
    },
    {
      name: 'Collaborative Filtering / Ranking',
      status: 'Recommended method',
      explanation: 'Examines co-occurrence patterns in transactions to surface item affinities.',
      typicalUse: 'Cross-selling opportunities, bundle creation, and catalog placement.',
    },
    {
      name: 'NLP / LLM',
      status: 'Implemented model',
      implementationNote: 'Gemini 2.5 Flash via client proxy & deterministic rule engine',
      explanation: 'Translates structured mathematical diagnostics into clear, human-readable explanations.',
      typicalUse: 'Generating executive operational takeaways and evidence-backed rationale.',
    },
    {
      name: 'Anomaly Detection',
      status: 'Implemented model',
      implementationNote: 'Deterministic statistical boundary screening & 3.5σ deviation checks',
      explanation: 'Identifies data outliers, sudden margin drops, or unusual transaction spikes.',
      typicalUse: 'Data-quality screening, unexpected stock-run alerts, and cost leakage flags.',
    },
  ];

  // Concise foundational source areas (no invented citations, no fake research papers)
  const researchSourceAreas = [
    {
      area: 'Supply Chain & Inventory Buffer Theory',
      scope: 'Lead-time variability, safety buffer sizing, and reorder point optimization.',
    },
    {
      area: 'SME Digital Recordkeeping & Trade Infrastructure',
      scope: 'Transition from fragmented manual records to structured operational telemetry.',
    },
    {
      area: 'Applied Managerial Economics & Price Elasticity',
      scope: 'Cost-volume-profit relationships, unit contribution margins, and elasticity curves.',
    },
    {
      area: 'Human-in-the-Loop AI & Decision Governance',
      scope: 'Algorithmic recommendation transparency, audit logging, and human operator sign-off.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <SectionHeader
        title={strings.title}
        subtitle={strings.subtitle}
        frameworkStage="METHODOLOGY & GOVERNANCE"
        badgeText="How It Works"
        actions={
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-3.5 py-1.5 bg-[#091124] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs border border-slate-700"
          >
            <span>{strings.returnDashboard}</span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
          </button>
        }
      />

      {/* 2. CORE PRINCIPLE HIGHLIGHT (Compact & Prominent) */}
      <div className="bg-[#091124] text-white p-5 rounded-xl border border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-2.5 bg-teal-950/90 border border-teal-600/50 rounded-lg text-teal-300 shrink-0">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-extrabold">
              CORE PRINCIPLE
            </div>
            <h2 className="text-base sm:text-lg font-extrabold tracking-wide text-white">
              {strings.coreTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              {strings.coreSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('decision')}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap self-start sm:self-center"
        >
          <span>{strings.openDecisions}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. VISUAL FLOW (7 Steps, Exactly 1 Sentence Each) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              EXECUTION PIPELINE
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              {strings.flowHeader}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded font-semibold">
            7 Sequential Steps
          </span>
        </div>

        {/* Responsive Grid with Step Connectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {strings.steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === strings.steps.length - 1;
            return (
              <div
                key={step.title}
                onClick={() => onNavigate(step.target)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between group ${
                  isLast
                    ? 'bg-teal-50/50 border-teal-400/80 hover:bg-teal-50 hover:border-teal-500'
                    : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-teal-500 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-extrabold text-teal-700 bg-teal-100/60 px-1.5 py-0.5 rounded">
                      {step.num}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-900 leading-tight mb-1 group-hover:text-teal-900">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-teal-700 font-semibold group-hover:text-teal-800">
                  <span>View</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. ACCESS → INTELLIGENCE → SCALE (Compact 3 Cards, No Theory Paragraphs) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="mb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            CORE FRAMEWORK
          </span>
          <h3 className="text-sm font-bold text-slate-900">
            {strings.frameworkHeader}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {strings.pillars.map((p) => (
            <div
              key={p.id}
              className="p-4 bg-slate-50/80 border border-slate-200/90 rounded-lg flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                  <h4 className="text-xs font-extrabold tracking-wider text-slate-900 font-mono">
                    {p.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  "{p.desc}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. AI/ML METHODS (Used or Recommended) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              ALGORITHMIC TAXONOMY
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              {strings.methodsHeader}
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {strings.methodsSubtitle}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {aiMlMethods.map((m) => {
            const isImplemented = m.status === 'Implemented model';
            return (
              <div
                key={m.name}
                className="p-3.5 bg-slate-50/60 border border-slate-200 rounded-lg flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-xs font-bold text-slate-900">
                      {m.name}
                    </h4>
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-extrabold shrink-0 border ${
                        isImplemented
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {m.explanation}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/70 text-[11px] text-slate-600 space-y-0.5">
                  <div className="font-semibold text-slate-800">
                    Typical Business Use:
                  </div>
                  <div className="text-slate-600 leading-snug">
                    {m.typicalUse}
                  </div>
                  {m.implementationNote && (
                    <div className="text-[10px] font-mono text-teal-800 pt-1">
                      Engine: {m.implementationNote}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. RESEARCH BASIS & 7. SURVEY NOTE (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Research Basis */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              FOUNDATIONAL DOMAINS
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              {strings.researchHeader}
            </h3>
          </div>

          <div className="space-y-2 text-xs divide-y divide-slate-100">
            {researchSourceAreas.map((res) => (
              <div key={res.area} className="pt-2 first:pt-0">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span>{res.area}</span>
                </div>
                <div className="text-slate-600 text-[11px] mt-0.5 pl-5">
                  {res.scope}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Survey Note & Limitations */}
        <div className="space-y-4">
          {/* Survey Note */}
          <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-4 shadow-xs">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-900 font-extrabold block">
                  {strings.surveyNoteHeader}
                </span>
                <p className="text-xs text-amber-950 leading-relaxed font-medium">
                  {strings.surveyNoteText}
                </p>
              </div>
            </div>
          </div>

          {/* Limitations */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-2.5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                OPERATIONAL BOUNDARIES
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                {strings.limitationsHeader}
              </h3>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
              {strings.limitations.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  <span className="text-slate-800">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
