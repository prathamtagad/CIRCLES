import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from './Sidebar';
import {
    Home,
    Users,
    Plus,
    Shield,
    Settings,
    Search,
    MoreHorizontal
} from 'lucide-react';

export default function Layout() {
    const { circles } = useApp();
    const location = useLocation();

    const mobileNavItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/circles', icon: Users, label: 'Circles' },
        { path: '/compose', icon: Plus, label: 'Post', isFab: false },
        { path: '/privacy', icon: Shield, label: 'Privacy' },
        { path: '/settings', icon: Settings, label: 'Config' },
    ];

    return (
        <div className="min-h-screen bg-[#030712] text-white flex justify-center">
            {/* Background with subtle grid/noise */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            <div className="w-full max-w-[1300px] flex relative z-10">

                {/* DESKTOP SIDEBAR (Left) - Hidden on Mobile */}
                <div className="hidden md:block w-[280px] shrink-0">
                    <Sidebar />
                </div>

                {/* MAIN FEED (Center) */}
                <main className="flex-1 w-full min-w-0 md:max-w-[640px] border-x border-white/5 min-h-screen pb-20 md:pb-0">
                    {/* Top Mobile Header */}
                    <div className="md:hidden sticky top-0 z-40 glass border-b border-white/5 px-4 h-14 flex items-center justify-between">
                        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Circles</span>
                        <div className="w-8 h-8 rounded-full bg-white/10"></div>{/* Placeholder for user */}
                    </div>

                    <Outlet />
                </main>

                {/* DESKTOP WIDGETS (Right) - Hidden on Mobile/Tablet */}
                <div className="hidden lg:block w-[350px] shrink-0 p-6 space-y-6 sticky top-0 h-screen overflow-y-auto no-scrollbar">
                    {/* Search Widget */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-violet-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search Circles"
                            className="w-full bg-white/5 border border-white/5 rounded-full py-3 pl-12 pr-4 outline-none focus:border-violet-500/50 focus:bg-black/50 transition-all text-sm"
                        />
                    </div>

                    {/* Suggestions Widget */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                        <h3 className="font-bold text-lg mb-4">Your Trust Circles</h3>
                        <div className="space-y-4">
                            {circles.length > 0 ? circles.slice(0, 4).map(c => (
                                <div key={c.id} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border border-white/5 transition-transform group-hover:scale-110" style={{ backgroundColor: `${c.color}20`, color: c.color }}>
                                            {c.name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[15px] group-hover:text-violet-400 transition-colors">{c.name}</span>
                                            <span className="text-xs text-slate-500 capitalize">{c.trustLevel} Circle</span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-500">No circles yet.</p>
                            )}
                        </div>
                        {circles.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/5 text-center">
                                <NavLink to="/circles" className="text-sm text-violet-400 hover:text-violet-300 font-medium">Show more</NavLink>
                            </div>
                        )}
                    </div>

                    {/* Footer Widget */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600 px-2">
                        <a href="#" className="hover:underline">Privacy</a>
                        <a href="#" className="hover:underline">Terms</a>
                        <a href="#" className="hover:underline">Transparency</a>
                        <span>© 2026 Circles Inc.</span>
                    </div>
                </div>
            </div>

            {/* MOBILE BOTTOM NAV */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 border-t border-white/5 bg-[#030712]/90 backdrop-blur-xl z-50 pb-safe">
                <div className="flex justify-around items-center h-16">
                    {mobileNavItems.map(({ path, icon: Icon, label }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) => `
                flex flex-col items-center gap-1 p-2 rounded-lg transition-all
                ${isActive ? 'text-white' : 'text-slate-500'}
              `}
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
                                    {/* <span className="text-[10px] font-medium">{label}</span> */}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    );
}
