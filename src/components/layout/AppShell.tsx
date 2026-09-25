import React, { useState, useEffect, useMemo } from 'react';
import {
  NavSection,
  BusinessLevelId,
  IngestedDataset,
  BusinessProfile,
  UserSession,
  AffairRecord,
  BusinessAffairsData,
  UnifiedBusinessDataLayer,
  UnifiedBusinessAnalysisReport,
} from '../../types/bi';
import { convertAffairsToIngestedDataset } from '../../utils/affairsAnalyticsBridge';
import { buildUnifiedBusinessData } from '../../utils/unifiedDataLayer';
import { runUnifiedBusinessAnalysis } from '../../utils/unifiedAnalysisEngine';
import { TopNav } from './TopNav';
import { Sidebar } from './Sidebar';
import { LoginView } from '../auth/LoginView';
import { LanguageSelectView } from '../auth/LanguageSelectView';
import { BusinessSetupView } from '../auth/BusinessSetupView';
import { DashboardView } from '../views/DashboardView';
import { MyBusinessView } from '../views/MyBusinessView';
import { ManageAffairsView, AffairTab } from '../views/ManageAffairsView';
import { AnalyzeView } from '../views/AnalyzeView';
import { DataView } from '../views/DataView';
import { InsightsView } from '../views/InsightsView';
import { ChartsView } from '../views/ChartsView';
import { RecommendationsView } from '../views/RecommendationsView';
import { BusinessImpactView } from '../views/BusinessImpactView';
import { HumanDecisionView } from '../views/HumanDecisionView';
import { MethodologyView } from '../views/MethodologyView';
import { SettingsView } from '../views/SettingsView';
import { BUSINESS_LEVELS } from '../../data/frameworkData';
import { clearAllDecisions } from '../../utils/decisionStorage';
import { createAshaDemoDataset, ASHA_DEMO_BUSINESS_PROFILE } from '../../data/demoDataset';
import { analyzeDataQuality } from '../../utils/dataQualityAnalyzer';
import { DemoModeHeader } from '../common/DemoModeHeader';
import { SmartGuidanceChatbot } from '../assistant/SmartGuidanceChatbot';

const SESSION_STORAGE_KEY = 'great_shift_session_v2';
const PROFILE_STORAGE_KEY = 'great_shift_profile_v2';
const AFFAIRS_STORAGE_KEY = 'great_shift_affairs_v2';
const BUSINESS_AFFAIRS_STORAGE_KEY = 'great_shift_business_affairs_v3';

const INITIAL_BUSINESS_AFFAIRS: BusinessAffairsData = {
  sales: [],
  products: [],
  customers: [],
  expenses: [],
  orders: [],
  suppliers: [],
  tasks: [],
  documents: [],
};

export const AppShell: React.FC = () => {
  // Authentication & Onboarding Stage
  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState<BusinessProfile | null>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Determines current view stage: 'login' | 'language' | 'setup' | 'app'
  const [flowStage, setFlowStage] = useState<'login' | 'language' | 'setup' | 'app'>(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedSession && savedProfile) {
        return 'app';
      }
    } catch {
      // fallback
    }
    return 'login';
  });

  // Primary navigation state inside the main app
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [selectedRecommendationId, setSelectedRecommendationId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<BusinessLevelId>(
    profile?.businessLevel || 'city_growing'
  );
  const [activeDataset, setActiveDataset] = useState<IngestedDataset | null>(null);

  // Demo Mode state
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [savedLevelBeforeDemo, setSavedLevelBeforeDemo] = useState<BusinessLevelId>('city_growing');
  const [savedDatasetBeforeDemo, setSavedDatasetBeforeDemo] = useState<IngestedDataset | null>(null);

  // One-Click Demo Mode Trigger (Step 11)
  const handleStartAshaDemo = () => {
    setSavedLevelBeforeDemo(selectedLevel);
    setSavedDatasetBeforeDemo(activeDataset);
    setIsDemoMode(true);
    setSelectedLevel('local_village');

    // Create, label, and process the fictional demo dataset
    const rawAsha = createAshaDemoDataset();
    const qualityReport = analyzeDataQuality(rawAsha);
    const processedAsha: IngestedDataset = {
      ...rawAsha,
      status: 'processed',
      qualityReport,
    };

    setActiveDataset(processedAsha);
    setActiveSection('analyze');
  };

  // Exit / Reset Demo Mode
  const handleExitDemo = () => {
    setIsDemoMode(false);
    setSelectedLevel(savedLevelBeforeDemo || profile?.businessLevel || 'city_growing');
    setActiveDataset(savedDatasetBeforeDemo);
    setActiveSection('dashboard');
  };

  // Operational business affairs records (Legacy support + Step 5 comprehensive operational modules)
  const [affairRecords, setAffairRecords] = useState<AffairRecord[]>(() => {
    try {
      const saved = localStorage.getItem(AFFAIRS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Comprehensive Step 5 operational modules state
  const [businessAffairs, setBusinessAffairs] = useState<BusinessAffairsData>(() => {
    try {
      const saved = localStorage.getItem(BUSINESS_AFFAIRS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_BUSINESS_AFFAIRS;
    } catch {
      return INITIAL_BUSINESS_AFFAIRS;
    }
  });

  // Global Guidance Assistant state
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInitialQuery, setAssistantInitialQuery] = useState<string | null>(null);

  const handleOpenAssistant = (query?: string) => {
    setAssistantInitialQuery(query || null);
    setIsAssistantOpen(true);
  };

  // Keep selectedLevel in sync with profile
  useEffect(() => {
    if (profile?.businessLevel && profile.businessLevel !== selectedLevel) {
      setSelectedLevel(profile.businessLevel);
    }
  }, [profile?.businessLevel]);

  // Handle Level Selection
  const handleSelectLevel = (levelId: BusinessLevelId) => {
    setSelectedLevel(levelId);
    if (profile) {
      const updated = { ...profile, businessLevel: levelId, updatedAt: new Date().toISOString() };
      setProfile(updated);
      try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  };

  // Handle Login
  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
    } catch {
      // ignore
    }
    setFlowStage('language');
  };

  // Handle Language Step Completion
  const handleLanguageComplete = () => {
    setFlowStage('setup');
  };

  // Handle Business Profile Setup Completion
  const handleProfileComplete = (newProfile: BusinessProfile) => {
    setProfile(newProfile);
    setSelectedLevel(newProfile.businessLevel);
    if (session) {
      const updatedSession = { ...session, onboardingCompleted: true };
      setSession(updatedSession);
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedSession));
      } catch {
        // ignore
      }
    }
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
    } catch {
      // ignore
    }
    setFlowStage('app');
    setActiveSection('dashboard');
  };

  // Profile update from within MyBusiness or Settings
  const handleUpdateProfile = (updated: BusinessProfile) => {
    setProfile(updated);
    setSelectedLevel(updated.businessLevel);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Handle adding an affair record
  const handleAddAffairRecord = (record: AffairRecord) => {
    setAffairRecords((prev) => {
      const updated = [record, ...prev];
      try {
        localStorage.setItem(AFFAIRS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Handle deleting an affair record
  const handleDeleteAffairRecord = (id: string) => {
    setAffairRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem(AFFAIRS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Handle updating comprehensive Step 5 Business Affairs state
  const handleUpdateBusinessAffairs = (updated: BusinessAffairsData) => {
    setBusinessAffairs(updated);
    try {
      localStorage.setItem(BUSINESS_AFFAIRS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Active Business Profile Fallback
  const activeProfile: BusinessProfile = useMemo(() => {
    if (isDemoMode) {
      return ASHA_DEMO_BUSINESS_PROFILE;
    }
    return profile || {
      businessName: 'My Enterprise',
      businessType: 'Retail & Commercial Trade',
      businessLevel: selectedLevel,
      location: 'Regional Market',
      primaryOfferings: 'Commercial Products & Inventory',
    };
  }, [profile, selectedLevel, isDemoMode]);

  // State for enabling / disabling data sources in unified analysis
  const [enabledSources, setEnabledSources] = useState<{
    manual: boolean;
    upload: boolean;
    demo: boolean;
  }>({
    manual: true,
    upload: true,
    demo: true,
  });

  const handleToggleSource = (source: 'manual' | 'upload' | 'demo') => {
    setEnabledSources((prev) => ({
      ...prev,
      [source]: !prev[source],
    }));
  };

  // Central Application Unified Business Data Layer
  const unifiedDataLayer: UnifiedBusinessDataLayer = useMemo(() => {
    return buildUnifiedBusinessData(businessAffairs, activeDataset, {
      includeManual: enabledSources.manual,
      includeUpload: enabledSources.upload,
      includeDemo: enabledSources.demo,
    });
  }, [businessAffairs, activeDataset, enabledSources]);

  // Reusable Deterministic Business Analysis Engine
  const unifiedAnalysis: UnifiedBusinessAnalysisReport = useMemo(() => {
    return runUnifiedBusinessAnalysis(unifiedDataLayer);
  }, [unifiedDataLayer]);

  // Bridge authentic operational records directly into the business diagnostic engine
  const handleSendAffairsToDiagnostic = () => {
    const dataset = convertAffairsToIngestedDataset(
      businessAffairs,
      activeProfile.businessName || 'My Enterprise'
    );
    if (dataset) {
      setActiveDataset(dataset);
      setActiveSection('data');
    }
  };

  // Reset session
  const handleResetSession = () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      localStorage.removeItem(AFFAIRS_STORAGE_KEY);
      localStorage.removeItem(BUSINESS_AFFAIRS_STORAGE_KEY);
      clearAllDecisions();
    } catch {
      // ignore
    }
    setIsDemoMode(false);
    setSession(null);
    setProfile(null);
    setAffairRecords([]);
    setBusinessAffairs(INITIAL_BUSINESS_AFFAIRS);
    setActiveDataset(null);
    setSelectedRecommendationId(null);
    setFlowStage('login');
  };

  const handleRestartOnboarding = () => {
    setFlowStage('language');
  };

  const [activeAffairTab, setActiveAffairTab] = useState<AffairTab>('overview');

  const handleNavigate = (section: NavSection, affairTab?: AffairTab) => {
    setActiveSection(section);
    if (affairTab) {
      setActiveAffairTab(affairTab);
    }
  };

  // Render onboarding flow screens if user has not completed setup
  if (flowStage === 'login') {
    return <LoginView onSuccess={handleLoginSuccess} detectedEmail="majidasayyad5@gmail.com" />;
  }

  if (flowStage === 'language') {
    return <LanguageSelectView onContinue={handleLanguageComplete} />;
  }

  if (flowStage === 'setup') {
    return (
      <BusinessSetupView
        initialProfile={profile || undefined}
        onComplete={handleProfileComplete}
      />
    );
  }

  // Primary application view router
  const renderActiveView = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardView
            selectedLevel={selectedLevel}
            onNavigate={handleNavigate}
            onSelectLevel={handleSelectLevel}
            activeDataset={activeDataset}
            profile={activeProfile}
            businessAffairs={businessAffairs}
            unifiedDataLayer={unifiedDataLayer}
            unifiedAnalysis={unifiedAnalysis}
            onStartAshaDemo={handleStartAshaDemo}
            isDemoMode={isDemoMode}
            onOpenAssistant={handleOpenAssistant}
          />
        );
      case 'my_business':
        return (
          <MyBusinessView
            profile={activeProfile}
            onUpdateProfile={handleUpdateProfile}
            onNavigate={handleNavigate}
          />
        );
      case 'manage_affairs':
        return (
          <ManageAffairsView
            profile={activeProfile}
            selectedLevel={selectedLevel}
            onNavigate={handleNavigate}
            businessAffairs={businessAffairs}
            onUpdateAffairs={handleUpdateBusinessAffairs}
            onSendToDiagnosticEngine={handleSendAffairsToDiagnostic}
            initialTab={activeAffairTab}
          />
        );
      case 'analyze':
        return (
          <AnalyzeView
            selectedLevel={selectedLevel}
            onSelectLevel={handleSelectLevel}
            onNavigate={handleNavigate}
            activeDataset={activeDataset}
            onDatasetLoaded={setActiveDataset}
            onProcessData={(processedData) => setActiveDataset(processedData)}
            businessAffairs={businessAffairs}
            unifiedDataLayer={unifiedDataLayer}
            unifiedAnalysis={unifiedAnalysis}
            enabledSources={enabledSources}
            onToggleSource={handleToggleSource}
            onStartAshaDemo={handleStartAshaDemo}
            isDemoMode={isDemoMode}
          />
        );
      case 'data':
        return (
          <DataView
            selectedLevel={selectedLevel}
            onNavigate={handleNavigate}
            activeDataset={activeDataset}
          />
        );
      case 'insights':
        return (
          <InsightsView
            selectedLevel={selectedLevel}
            onNavigate={handleNavigate}
            activeDataset={activeDataset}
            profile={activeProfile}
            businessAffairs={businessAffairs}
            unifiedDataLayer={unifiedDataLayer}
            unifiedAnalysis={unifiedAnalysis}
          />
        );
      case 'charts':
        return (
          <ChartsView
            selectedLevel={selectedLevel}
            onNavigate={handleNavigate}
          />
        );
      case 'recommendations':
        return (
          <RecommendationsView
            selectedLevel={selectedLevel}
            onNavigate={handleNavigate}
            onSelectRecommendation={(id) => {
              setSelectedRecommendationId(id);
            }}
          />
        );
      case 'impact':
        return (
          <BusinessImpactView
            selectedLevel={selectedLevel}
            onNavigate={handleNavigate}
            onSelectRecommendation={(id) => {
              setSelectedRecommendationId(id);
            }}
            businessAffairs={businessAffairs}
            activeDataset={activeDataset}
            unifiedDataLayer={unifiedDataLayer}
            unifiedAnalysis={unifiedAnalysis}
          />
        );
      case 'decision':
        return (
          <HumanDecisionView
            selectedLevel={selectedLevel}
            onNavigate={handleNavigate}
            selectedRecommendationId={selectedRecommendationId}
            onSelectRecommendation={setSelectedRecommendationId}
          />
        );
      case 'methodology':
        return (
          <MethodologyView
            selectedLevel={selectedLevel}
            onNavigate={handleNavigate}
            onSelectLevel={handleSelectLevel}
          />
        );
      case 'settings':
        return (
          <SettingsView
            profile={activeProfile}
            session={session}
            onNavigate={handleNavigate}
            onResetSession={handleResetSession}
            onRestartOnboarding={handleRestartOnboarding}
          />
        );
      default:
        return (
          <DashboardView
            selectedLevel={selectedLevel}
            onNavigate={handleNavigate}
            onSelectLevel={handleSelectLevel}
            activeDataset={activeDataset}
            profile={activeProfile}
          />
        );
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#F1F5F9] text-slate-800 antialiased font-sans">
      {/* Dark Navy Primary Top Navigation with Language Switcher */}
      <TopNav
        activeSection={activeSection}
        onNavigate={handleNavigate}
        selectedLevel={selectedLevel}
        onSelectLevel={handleSelectLevel}
        profile={activeProfile}
        session={session}
        onOpenSearch={() => handleNavigate('dashboard')}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Dark Navy Primary Navigation Sidebar with 12 sections */}
        <Sidebar
          activeSection={activeSection}
          onNavigate={handleNavigate}
          selectedLevel={selectedLevel}
          onSelectLevel={handleSelectLevel}
          activeAffairTab={activeAffairTab}
        />

        {/* Light Neutral Content Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#F1F5F9] p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            {isDemoMode && (
              <DemoModeHeader
                activeSection={activeSection}
                onNavigate={setActiveSection}
                onExitDemo={handleExitDemo}
              />
            )}
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Guidance Assistant (Smart Guidance Chatbot) */}
      <SmartGuidanceChatbot
        activeSection={activeSection}
        selectedLevel={selectedLevel}
        profile={activeProfile}
        unifiedDataLayer={unifiedDataLayer}
        unifiedAnalysis={unifiedAnalysis}
        onNavigate={handleNavigate}
        onStartAshaDemo={handleStartAshaDemo}
        initialQuery={assistantInitialQuery}
        isOpen={isAssistantOpen}
        onToggleOpen={setIsAssistantOpen}
      />
    </div>
  );
};
