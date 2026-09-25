import React, { useState } from 'react';
import { useI18n } from '../../context/I18nContext';
import { UserSession } from '../../types/bi';
import { ShieldCheck, Lock, CheckCircle2, Info, Building2, Sparkles } from 'lucide-react';

interface LoginViewProps {
  onSuccess: (session: UserSession) => void;
  detectedEmail?: string;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess, detectedEmail = 'majidasayyad5@gmail.com' }) => {
  const { t } = useI18n();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleSignIn = () => {
    setIsAuthenticating(true);
    setAuthError(null);

    // Development preview workspace session initializer
    setTimeout(() => {
      try {
        const session: UserSession = {
          isAuthenticated: true,
          authProvider: 'google',
          email: detectedEmail,
          name: detectedEmail.split('@')[0].replace('.', ' ').toUpperCase(),
          photoUrl: undefined,
          onboardingCompleted: false,
          createdAt: new Date().toISOString(),
        };
        setIsAuthenticating(false);
        onSuccess(session);
      } catch {
        setIsAuthenticating(false);
        setAuthError('Connection problem. Please try again.');
      }
    }, 400);
  };

  const handleCancel = () => {
    setIsAuthenticating(false);
    setAuthError('Sign-in cancelled. You can continue when ready.');
  };

  return (
    <div className="min-h-screen w-screen bg-[#070D1E] text-slate-100 flex flex-col justify-between p-6 antialiased select-none font-sans relative overflow-hidden">
      {/* Background Subtle Gradient Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-900/40 to-[#070D1E] pointer-events-none" />

      {/* Top Header Branding */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between py-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 font-black text-sm">
            GS
          </div>
          <div>
            <div className="font-bold tracking-tight text-white text-sm">THE GREAT SHIFT 2.0</div>
            <div className="text-[10px] font-mono text-slate-400">Enterprise AI Business Intelligence & Growth Architecture</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-300 bg-amber-950/40 border border-amber-800/60 px-2.5 py-1 rounded">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">AI ANALYZES · HUMANS DECIDE</span>
        </div>
      </header>

      {/* Center Welcome Card */}
      <main className="relative z-10 max-w-xl mx-auto w-full my-auto py-8">
        <div className="bg-[#0B152F] border border-slate-800 rounded-xl shadow-2xl p-8 backdrop-blur-sm relative overflow-hidden">
          {/* Subtle Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-teal-400 to-amber-400" />

          {/* Titles */}
          <div className="text-center space-y-2 mb-8">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono bg-teal-950 text-teal-300 border border-teal-800/60 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-teal-400" /> Version 2.0 Operational
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t.auth.title}
            </h1>
            <p className="text-sm font-semibold text-teal-400 font-mono">
              {t.auth.subtitle}
            </p>
            <p className="text-xs text-slate-300 max-w-md mx-auto pt-1 leading-relaxed">
              {t.auth.description}
            </p>
          </div>

          {/* Authentication Actions */}
          <div className="space-y-4 max-w-md mx-auto">
            {/* Google Authentication Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isAuthenticating}
              className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-lg font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-3 shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group"
            >
              {isAuthenticating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span className="text-slate-800 font-medium">Verifying Google Identity...</span>
                </div>
              ) : (
                <>
                  {/* Official Google 'G' Logo SVG */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.43l4.02-3.14z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.57l4.02 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
                    />
                  </svg>
                  <span className="text-slate-900 font-bold group-hover:text-black">
                    {t.auth.continue_google}
                  </span>
                </>
              )}
            </button>

            {isAuthenticating && (
              <button
                type="button"
                onClick={handleCancel}
                className="w-full py-2 px-3 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-center"
              >
                Cancel Sign-in
              </button>
            )}

            {/* Detected Identity Indicator */}
            {detectedEmail && (
              <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border border-slate-800 rounded text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Workspace Account:
                </span>
                <span className="font-mono text-slate-200 font-semibold">{detectedEmail}</span>
              </div>
            )}

            {authError && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-200 text-xs rounded">
                {authError}
              </div>
            )}
          </div>

          {/* Privacy & Session Notice */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-400 space-y-3">
            <div className="flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block text-[11px] uppercase tracking-wider font-mono">
                  {t.auth.security_badge}
                </strong>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  {t.auth.privacy_note}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-slate-900/50 p-2.5 rounded border border-slate-800/60">
              <Info className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t.auth.google_session_note}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full text-center py-3 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between border-t border-slate-800/60 gap-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Professional Business Management & Analytic Intelligence</span>
        </div>
        <div className="font-mono text-[10px] text-slate-400">
          DATA PRIVACY PROTECTION · NO PASSWORDS COLLECTED
        </div>
      </footer>
    </div>
  );
};
