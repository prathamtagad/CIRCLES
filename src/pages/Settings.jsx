import { useApp } from '../context/AppContext';
import {
    Moon,
    Sun,
    Zap,
    Bell,
    Globe,
    Shield,
    HelpCircle,
    ChevronRight,
    LogOut,
    User
} from 'lucide-react';

export default function Settings() {
    const {
        currentUser,
        userProfile,
        liteMode,
        toggleLiteMode,
        darkMode,
        bytesLoaded,
        bytesSaved,
        handleSignOut
    } = useApp();

    const userName = userProfile?.displayName || currentUser?.displayName || 'User';
    const userEmail = currentUser?.email || '';

    const settingsGroups = [
        {
            title: 'Preferences',
            items: [
                {
                    icon: <Zap size={20} />,
                    label: 'Lite Mode',
                    description: 'Reduce bandwidth usage by hiding images',
                    action: 'toggle',
                    value: liteMode,
                    onToggle: toggleLiteMode,
                    highlight: true
                },
                {
                    icon: darkMode ? <Moon size={20} /> : <Sun size={20} />,
                    label: 'Dark Mode',
                    description: 'Always on (designed for dark mode)',
                    action: 'toggle',
                    value: darkMode,
                    disabled: true
                },
                {
                    icon: <Bell size={20} />,
                    label: 'Notifications',
                    description: 'Manage notification preferences',
                    action: 'link'
                },
                {
                    icon: <Globe size={20} />,
                    label: 'Language',
                    description: 'English (US)',
                    action: 'link'
                }
            ]
        },
        {
            title: 'Privacy & Security',
            items: [
                {
                    icon: <Shield size={20} />,
                    label: 'Privacy Settings',
                    description: 'Manage your data and visibility',
                    action: 'link'
                }
            ]
        },
        {
            title: 'Support',
            items: [
                {
                    icon: <HelpCircle size={20} />,
                    label: 'Help Center',
                    description: 'FAQs and support resources',
                    action: 'link'
                }
            ]
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <h1 className="text-2xl font-bold">Settings</h1>

            {/* User Profile Card */}
            <div className="card p-4 flex items-center gap-4">
                {currentUser?.photoURL ? (
                    <img
                        src={currentUser.photoURL}
                        alt={userName}
                        className="w-14 h-14 rounded-full border-2 border-[var(--color-primary)]"
                    />
                ) : (
                    <div className="avatar avatar-lg">
                        {userName.charAt(0)}
                    </div>
                )}
                <div className="flex-1">
                    <h2 className="font-semibold text-lg">{userName}</h2>
                    <p className="text-sm text-[var(--color-text-muted)]">{userEmail}</p>
                </div>
                <button className="btn btn-secondary btn-icon">
                    <User size={18} />
                </button>
            </div>

            {/* Bandwidth Stats (for demo) */}
            {(liteMode || bytesSaved > 0) && (
                <div className="card p-4 bg-gradient-to-r from-[var(--color-accent)]/10 to-[var(--color-primary)]/10 border-[var(--color-accent)]/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/20 flex items-center justify-center">
                                <Zap size={20} className="text-[var(--color-accent)]" />
                            </div>
                            <div>
                                <h3 className="font-medium">Bandwidth Savings</h3>
                                <p className="text-sm text-[var(--color-text-muted)]">
                                    Lite Mode is {liteMode ? 'active' : 'inactive'}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-bold text-[var(--color-accent)]">
                                {bytesLoaded}KB
                            </div>
                            <div className="text-xs text-[var(--color-accent-green)]">
                                {bytesSaved}KB saved
                            </div>
                        </div>
                    </div>

                    {/* Visual demo - show before/after */}
                    <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                        <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-2">
                            <span>Without Lite Mode</span>
                            <span>450KB</span>
                        </div>
                        <div className="h-2 bg-[var(--color-surface-hover)] rounded-full overflow-hidden mb-3">
                            <div className="h-full bg-[var(--color-text-muted)] rounded-full" style={{ width: '100%' }}></div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-2">
                            <span>With Lite Mode</span>
                            <span>45KB</span>
                        </div>
                        <div className="h-2 bg-[var(--color-surface-hover)] rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--color-accent)] rounded-full" style={{ width: '10%' }}></div>
                        </div>

                        <p className="text-xs text-[var(--color-accent-green)] mt-2 text-center">
                            ↓ 90% bandwidth reduction
                        </p>
                    </div>
                </div>
            )}

            {/* Settings Groups */}
            {settingsGroups.map((group, idx) => (
                <div key={idx} className="space-y-2">
                    <h3 className="text-sm font-medium text-[var(--color-text-muted)] px-1">
                        {group.title}
                    </h3>
                    <div className="card overflow-hidden">
                        {group.items.map((item, itemIdx) => (
                            <div
                                key={itemIdx}
                                className={`flex items-center gap-4 p-4 ${itemIdx !== group.items.length - 1 ? 'border-b border-[var(--color-border)]' : ''
                                    } ${item.highlight ? 'bg-[var(--color-accent)]/5' : ''}`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.highlight
                                        ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
                                        : 'bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]'
                                    }`}>
                                    {item.icon}
                                </div>

                                <div className="flex-1">
                                    <div className="font-medium">{item.label}</div>
                                    <p className="text-sm text-[var(--color-text-muted)]">
                                        {item.description}
                                    </p>
                                </div>

                                {item.action === 'toggle' && (
                                    <button
                                        onClick={item.onToggle}
                                        disabled={item.disabled}
                                        className={`toggle ${item.value ? 'active' : ''} ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        role="switch"
                                        aria-checked={item.value}
                                        aria-label={`Toggle ${item.label}`}
                                    />
                                )}

                                {item.action === 'link' && (
                                    <ChevronRight size={18} className="text-[var(--color-text-muted)]" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Logout */}
            <button
                onClick={handleSignOut}
                className="card w-full p-4 flex items-center gap-4 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-all"
            >
                <div className="w-10 h-10 rounded-lg bg-[var(--color-danger)]/10 flex items-center justify-center">
                    <LogOut size={20} />
                </div>
                <span className="font-medium">Log Out</span>
            </button>

            {/* Version info */}
            <div className="text-center text-xs text-[var(--color-text-muted)] py-4">
                <p>Circles v1.0.0 — Privacy-First Social Networking</p>
                <p className="mt-1">Made for SGSITS Hackathon 2026</p>
                {currentUser && (
                    <p className="mt-2 text-[var(--color-primary)]">
                        Signed in as {userEmail}
                    </p>
                )}
            </div>
        </div>
    );
}
