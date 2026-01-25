import { NavLink } from 'react-router-dom';
import {
    Home,
    Users,
    Shield,
    Settings,
    Plus,
    Bell,
    LogOut,
    Zap,
    User,
    Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
    const { currentUser, userProfile, handleSignOut, liteMode } = useApp();
    const userName = userProfile?.displayName || currentUser?.displayName || 'User';

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/search', icon: Search, label: 'Search' },
        { path: '/circles', icon: Users, label: 'Circles' },
        { path: '/profile', icon: User, label: 'Profile' },
        { path: '/privacy', icon: Shield, label: 'Privacy' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="h-screen sticky top-0 flex flex-col p-4 border-r border-white/5 bg-[#030712]">
            {/* Logo */}
            <div className="px-4 py-8 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <div className="w-6 h-6 border-[2.5px] border-white/80 rounded-full flex items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <span className="font-bold text-2xl tracking-tight text-white">Circles</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {navItems.map(({ path, icon: Icon, label }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) => `
              flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium transition-all duration-200
              ${isActive
                                ? 'bg-white/10 text-white font-bold'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }
            `}
                    >
                        {({ isActive }) => (
                            <>
                                <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                                <span>{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}

                <div className="pt-4">
                    <NavLink
                        to="/compose"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-violet-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus size={24} strokeWidth={3} />
                        <span>Post</span>
                    </NavLink>
                </div>
            </nav>

            {/* User & Footer */}
            <div className="mt-auto pt-6 space-y-4">
                {/* Lite Mode Indicator */}
                {liteMode && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-sm font-bold">
                        <Zap size={16} fill="currentColor" />
                        <span>Lite Mode Active</span>
                    </div>
                )}

                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group relative">
                    <NavLink to="/profile" className="flex items-center gap-3 overflow-hidden flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-500 p-[2px] shrink-0">
                            {currentUser?.photoURL ? (
                                <img src={currentUser.photoURL} alt={userName} className="w-full h-full rounded-full object-cover border-2 border-[#030712]" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-[#030712] flex items-center justify-center text-white font-bold">
                                    {userName.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-white text-sm truncate">{userName}</p>
                            <p className="text-slate-500 text-xs truncate">@{userName.toLowerCase().replace(/\s/g, '')}</p>
                        </div>
                    </NavLink>
                    <button
                        onClick={handleSignOut}
                        className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
                        title="Sign Out"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
