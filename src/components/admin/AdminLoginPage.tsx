import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  LogOut,
  Copy,
  Check,
} from 'lucide-react';
import { useBackend } from '../../context/BackendContext';
import { BrandMascotLogo } from '../Navbar';
import { BOOTSTRAPPED_ADMIN_EMAIL } from '../../firebase';

interface AdminLoginPageProps {
  onNavigateHome: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onNavigateHome,
  onLoginSuccess,
}) => {
  const { user, isAdmin, adminChecking, signInWithGoogle, logoutUser } = useBackend();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState<boolean>(false);
  const [copiedUid, setCopiedUid] = useState<boolean>(false);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSigningIn(true);
    try {
      const signedInUser = await signInWithGoogle();
      if (signedInUser) {
        if (
          signedInUser.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()
        ) {
          onLoginSuccess();
        }
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to sign in. Please try again.'
      );
    } finally {
      setSigningIn(false);
    }
  };

  const handleCopyUid = () => {
    if (!user?.uid) return;
    navigator.clipboard.writeText(user.uid).catch(() => {});
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 1800);
  };

  return (
    <div className="min-h-screen w-full bg-[#0F172A] text-white flex flex-col justify-between p-6 sm:p-10">
      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to ZaidBites Storefront</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Lock className="w-3.5 h-3.5 text-[#F59F00]" />
          <span>Protected Admin Portal</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-10">
        <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-7 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-center shrink-0">
              <BrandMascotLogo className="w-9 h-9 text-white" accentColor="#F59F00" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                ZaidBites Admin
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Restaurant Operations &amp; Backend Console
              </p>
            </div>
          </div>

          {adminChecking ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#F59F00] border-t-transparent animate-spin mx-auto" />
              <p className="text-sm text-slate-300">Verifying administrator credentials...</p>
            </div>
          ) : user && isAdmin ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <p className="font-semibold text-emerald-300">Authorized Administrator</p>
                  <p className="text-slate-300 mt-0.5">{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onLoginSuccess}
                className="w-full py-3 px-4 rounded-xl bg-[#F59F00] hover:bg-[#D97706] text-black font-bold text-sm transition-colors cursor-pointer"
              >
                Open Admin Dashboard
              </button>
            </div>
          ) : user && !isAdmin ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Access Restricted</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Signed in as <span className="font-semibold text-white">{user.email}</span>, which is not yet registered in the <code className="text-amber-300">/admins</code> collection.
                </p>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-[11px] text-slate-400 mb-1">Your Firebase Auth UID:</p>
                  <div className="flex items-center justify-between gap-2 bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-700">
                    <code className="text-xs font-mono text-amber-300 truncate">{user.uid}</code>
                    <button
                      type="button"
                      onClick={handleCopyUid}
                      className="text-xs text-slate-300 hover:text-white flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUid ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                  Sign in with the primary owner account (<span className="text-white font-medium">{BOOTSTRAPPED_ADMIN_EMAIL}</span>) or add the UID above to the <code className="text-white">/admins</code> collection in Firestore.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#F59F00] hover:bg-[#D97706] text-black font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Switch Google Account
                </button>
                <button
                  type="button"
                  onClick={logoutUser}
                  className="py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <p className="text-sm text-slate-300 leading-relaxed">
                Sign in with your authorized administrator Google account to manage live orders, food products, inventory stock, categories, and promo codes.
              </p>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="button"
                disabled={signingIn}
                onClick={handleGoogleSignIn}
                className="w-full py-3.5 px-5 rounded-xl bg-[#F59F00] hover:bg-[#D97706] disabled:opacity-60 text-black font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>{signingIn ? 'Signing in...' : 'Sign In with Google Admin'}</span>
              </button>

              <div className="pt-4 border-t border-slate-700/80 text-xs text-slate-400 space-y-1.5">
                <p className="font-semibold text-slate-300">Primary Bootstrapped Administrator:</p>
                <p className="font-mono text-amber-400">{BOOTSTRAPPED_ADMIN_EMAIL}</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Additional administrators can be authorized inside the Admin Dashboard under the Team &amp; Access tab or via the Firestore <code className="text-slate-300">/admins</code> collection.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer note */}
      <div className="max-w-6xl w-full mx-auto text-center text-xs text-slate-500">
        ZaidBites Cloud Firestore &amp; Firebase Authentication Security Active
      </div>
    </div>
  );
};
