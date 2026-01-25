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
    User,
    ArrowUpRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteUserAccount } from '../firebase/auth'; // Need to verify/create this
import { useState } from 'react';

export default function Settings() {
    const {
        currentUser,
        userProfile,
        liteMode,
        toggleLiteMode,
        darkMode,
        bytesLoaded,
        bytesSaved,
        handleSignOut,
        showToast
    } = useApp();
    const navigate = useNavigate();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true); // Persist if needed
    const [deleting, setDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        if (!window.confirm("CRITICAL WARNING: This will permanently delete your account, authentication credentials, and all data. This cannot be undone.")) return;

        const confirmText = prompt("Type 'DELETE' to confirm account deletion:");
        if (confirmText !== 'DELETE') return;

        setDeleting(true);
        try {
            // 1. Delete data (best effort)
            // 2. Delete auth
            // Use locally defined or imported, assuming it will be implemented
            const res = await deleteUserAccount();
            if (res.success) {
                showToast("Account deleted. Goodbye.", "success");
                navigate('/login');
            } else {
                showToast("Failed to delete account: " + res.error, "error");
            }
        } catch (e) {
            console.error(e);
            showToast("An error occurred during deletion", "error");
        } finally {
            setDeleting(false);
        }
    };

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
                    description: 'Push notifications',
                    action: 'toggle',
                    value: notificationsEnabled,
                    onToggle: () => {
                        setNotificationsEnabled(!notificationsEnabled);
                        showToast(`Notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`, 'success');
                    }
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
                    label: 'Privacy Dashboard',
                    description: 'Manage data and visibility',
                    action: 'navigate',
                    path: '/privacy'
                },
                {
                    icon: <User size={20} />,
                    label: 'Edit Profile',
                    description: 'Change name, bio, and avatar',
                    action: 'navigate',
                    path: '/profile?edit=true'
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
            <Link to="/profile" className="card p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group">
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
                    <h2 className="font-semibold text-lg flex items-center gap-2 group-hover:text-violet-400 transition-colors">
                        {userName}
                        <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)]">{userEmail}</p>
                </div>
            </Link>

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

                                {item.action === 'navigate' && (
                                    <Link to={item.path} className="flex items-center text-[var(--color-text-muted)] hover:text-white">
                                        <ChevronRight size={18} />
                                    </Link>
                                )}

                                {item.action === 'link' && (
                                    <ChevronRight size={18} className="text-[var(--color-text-muted)]" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Danger Zone */}
            <div className="space-y-2 pt-4">
                <h3 className="text-sm font-medium text-[var(--color-danger)] px-1">
                    Danger Zone
                </h3>
                <div className="card overflow-hidden border-red-900/20">
                    <button
                        onClick={handleDeleteAccount}
                        disabled={deleting}
                        className="w-full flex items-center gap-4 p-4 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-all text-left"
                    >
                        <div className="w-10 h-10 rounded-lg bg-[var(--color-danger)]/10 flex items-center justify-center">
                            <LogOut size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="font-medium">{deleting ? 'Deleting Account...' : 'Delete Account'}</div>
                            <p className="text-sm opacity-70">
                                Permanently delete your account and data
                            </p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Logout */}
            <button
                onClick={handleSignOut}
                className="card w-full p-4 flex items-center gap-4 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all"
            >
                <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-hover)] flex items-center justify-center">
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
