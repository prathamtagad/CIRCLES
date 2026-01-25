import { useApp } from '../context/AppContext';
import { Lock, Users, Sparkles, Shield, ArrowRight, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Login() {
    const { handleSignIn, loading, authLoading } = useApp();
    const [errorMsg, setErrorMsg] = useState(null);

    // If handleSignIn returns an error (from redirect), show it
    // But usually handleSignIn (via context) triggers the redirect immediately

    // Note: AppContext.jsx should handle the redirect result check on mount

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 bg-[#030712]">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none animate-float" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-float" style={{ animationDelay: '2s' }} />

            <div className="w-full max-w-sm relative z-10 flex flex-col items-center">
                {/* Logo & Branding */}
                <div className="flex flex-col items-center mb-10 animate-fadeIn">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-cyan-400 rounded-full blur-xl opacity-50 animate-glow"></div>
                        <div className="w-24 h-24 relative rounded-full bg-gradient-to-br from-[#6366F1] to-[#EC4899] flex items-center justify-center shadow-2xl ring-4 ring-white/10">
                            <div className="w-16 h-16 border-[3px] border-white/40 rounded-full flex items-center justify-center">
                                <div className="w-8 h-8 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-5xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent mb-3 tracking-tight">Circles</h1>
                    <p className="text-[#94A3B8] text-center text-lg font-medium max-w-[280px] leading-relaxed">
                        The social network for your <span className="text-[#A78BFA]">real life</span>.
                    </p>
                </div>

                {/* Feature Cards Carousel */}
                <div className="w-full grid gap-3 mb-10 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 flex items-center justify-center text-cyan-400">
                            <Lock size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-white">Private by Default</h3>
                            <p className="text-xs text-slate-400">Zero tracking. You own your data.</p>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400/20 to-violet-600/20 flex items-center justify-center text-violet-400">
                            <Users size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-white">Trust Circles</h3>
                            <p className="text-xs text-slate-400">Share with family, not the world.</p>
                        </div>
                    </div>
                </div>

                {/* Action Area */}
                <div className="w-full space-y-6 animate-fadeIn" style={{ animationDelay: '200ms' }}>
                    <button
                        onClick={handleSignIn}
                        disabled={loading || authLoading}
                        className="group w-full relative overflow-hidden rounded-2xl p-[1px] focus:outline-none focus:ring-4 focus:ring-violet-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-600 to-cyan-500 opacity-80 group-hover:opacity-100 transition-opacity"></span>
                        <span className="relative flex items-center justify-center gap-3 bg-[#0F172A] group-hover:bg-[#0F172A]/90 text-white p-4 rounded-2xl transition-all">
                            {loading || authLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                                    </svg>
                                    <span className="font-bold text-lg">Continue with Google</span>
                                    <ArrowRight size={18} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                </>
                            )}
                        </span>
                    </button>

                    <p className="text-center text-xs text-slate-500 font-medium">
                        By continuing, you join our <span className="text-slate-300 underline">Privacy First</span> network.
                    </p>

                    <div className="flex justify-center gap-6 opacity-60">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                            <Shield size={12} className="text-emerald-400" /> Encrypted
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                            <Sparkles size={12} className="text-amber-400" /> Ad-Free
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
