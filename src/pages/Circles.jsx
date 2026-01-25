import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, Users, Lock, Shield, ChevronRight, User } from 'lucide-react';

export default function Circles() {
    const { circles, users, setActiveCircle } = useApp();
    const navigate = useNavigate();

    const handleCircleClick = (circleId) => {
        setActiveCircle(circleId);
        navigate('/');
    };

    const getTrustConfig = (level) => {
        const configs = {
            inner: {
                label: 'Inner Circle',
                class: 'trust-inner',
                icon: <Lock size={12} />,
                description: 'Encrypted • Closest friends'
            },
            middle: {
                label: 'Trusted',
                class: 'trust-middle',
                icon: <Shield size={12} />,
                description: 'Friends & Family'
            },
            outer: {
                label: 'Extended',
                class: 'trust-outer',
                icon: <Users size={12} />,
                description: 'Acquaintances'
            }
        };
        return configs[level] || configs.middle;
    };

    const groupedCircles = {
        inner: circles.filter(c => c.trustLevel === 'inner'),
        middle: circles.filter(c => c.trustLevel === 'middle'),
        outer: circles.filter(c => c.trustLevel === 'outer'),
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Your Circles</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Visualizing your trust network
                    </p>
                </div>
                <Link
                    to="/circles/create"
                    className="btn btn-primary shadow-lg shadow-violet-500/20"
                >
                    <Plus size={18} />
                    <span className="hidden sm:inline">New Circle</span>
                </Link>
            </div>

            {/* 🪐 ORBITAL VISUALIZER */}
            <div className="card aspect-square sm:aspect-video relative overflow-hidden group flex items-center justify-center p-8 bg-gradient-to-b from-[#0F172A] to-[#020617]">
                {/* CSS Grid Pattern */}
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020617]"></div>

                {/* Orbital Rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Outer Orbit */}
                    <div className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full border border-dashed border-slate-700/50 animate-[spin_60s_linear_infinite]" />
                    <div className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full border border-slate-800 animate-pulse opacity-20" />

                    {/* Middle Orbit */}
                    <div className="absolute w-[200px] h-[200px] sm:w-[320px] sm:h-[320px] rounded-full border border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.1)] animate-[spin_40s_linear_infinite_reverse]" />

                    {/* Inner Orbit */}
                    <div className="absolute w-[100px] h-[100px] sm:w-[160px] sm:h-[160px] rounded-full border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.2)] animate-[spin_20s_linear_infinite]" />
                </div>

                {/* Nucleus (User) */}
                <div className="relative z-10 w-16 h-16 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)]">
                    <User size={24} className="text-white" />
                    <div className="absolute -bottom-6 text-[10px] font-bold tracking-widest uppercase text-slate-500">You</div>
                </div>

                {/* Labels */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> Inner
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 opacity-70"></span> Trusted
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-slate-500 opacity-50"></span> Extended
                    </div>
                </div>
            </div>

            {/* 📋 Modern List View */}
            <div className="space-y-6">
                {Object.entries(groupedCircles).map(([level, levelCircles]) => {
                    if (levelCircles.length === 0) return null;
                    const config = getTrustConfig(level);

                    return (
                        <div key={level} className="space-y-3">
                            <div className="flex items-center gap-3 px-1">
                                <div className={`p-1.5 rounded-lg bg-white/5 border border-white/5 text-${level === 'inner' ? 'cyan' : level === 'middle' ? 'indigo' : 'slate'}-400`}>
                                    {config.icon}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">{config.label}</h3>
                                    <p className="text-[10px] text-slate-500 font-medium">{config.description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {levelCircles.map(circle => {
                                    const memberCount = (circle.members || []).length;
                                    return (
                                        <div
                                            key={circle.id}
                                            onClick={() => handleCircleClick(circle.id)}
                                            className="group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                                        >
                                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ChevronRight size={16} className="text-slate-400" />
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg border border-white/10 group-hover:rotate-12 transition-transform duration-500"
                                                    style={{ backgroundColor: `${circle.color}15`, color: circle.color }}
                                                >
                                                    {circle.name.charAt(0)}
                                                </div>

                                                <div>
                                                    <h4 className="font-bold text-white group-hover:text-violet-300 transition-colors">{circle.name}</h4>
                                                    <span className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-md bg-black/20 text-xs font-medium text-slate-400">
                                                        <Users size={10} />
                                                        {memberCount} member{memberCount !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty state */}
            {circles.length === 0 && (
                <div className="text-center py-12 opacity-50">
                    <p className="text-slate-400">Your universe is empty. Start creating circles to populate it.</p>
                </div>
            )}
        </div>
    );
}
