import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from '../utils/format';
import {
    Shield,
    Eye,
    Lock,
    Download,
    Trash2,
    AlertTriangle,
    ChevronRight,
    X
} from 'lucide-react';

export default function Privacy() {
    const {
        posts,
        circles,
        privacyStats,
        currentUser,
        userProfile,
        revokePostAccess,
        getCircleById,
        showToast
    } = useApp();

    const [showRevokeModal, setShowRevokeModal] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const userPosts = posts.filter(p => p.authorId === currentUser?.uid);

    // 1. Privacy Score Calculation
    const calculatePrivacyScore = () => {
        let score = 50; // Base score

        // Good behaviors
        if (circles.some(c => c.trustLevel === 'inner')) score += 20;
        if (userPosts.every(p => p.circleIds && p.circleIds.length > 0)) score += 20; // All posts have circles (not public)
        if (currentUser?.email) score += 10;

        // Penalties (none in this privacy-first app really, but example logic)
        // if (publicPosts > 0) score -= 10;

        return Math.min(100, score);
    };

    const privacyScore = calculatePrivacyScore();

    const handleRevoke = async (postId) => {
        await revokePostAccess(postId);
        setShowRevokeModal(null);
    };

    const handleDownloadData = () => {
        setDownloading(true);
        try {
            const data = {
                profile: userProfile,
                posts: userPosts,
                circles: circles,
                exportDate: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `circles-data-${currentUser.uid}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showToast('Data export started', 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to export data', 'error');
        } finally {
            setDownloading(false);
        }
    };

    const handleDeleteAllData = async () => {
        if (!window.confirm("ARE YOU SURE? This will delete all your posts. This action cannot be undone.")) return;

        setDeleting(true);
        try {
            // Delete all posts
            const deletePromises = userPosts.map(p => revokePostAccess(p.id));
            await Promise.all(deletePromises);

            showToast('All posts deleted permanently.', 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to delete some data', 'error');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Shield size={24} className="text-[var(--color-primary)]" />
                    Privacy Dashboard
                </h1>
                <p className="text-[var(--color-text-secondary)] text-sm mt-1">
                    Full transparency over your data and who sees it
                </p>
            </div>

            {/* User Info */}
            {currentUser && (
                <div className="card p-4 flex items-center gap-4">
                    {currentUser.photoURL ? (
                        <img
                            src={currentUser.photoURL}
                            alt={userProfile?.displayName || 'You'}
                            className="w-14 h-14 rounded-full border-2 border-[var(--color-primary)]"
                        />
                    ) : (
                        <div className="avatar avatar-lg">
                            {(userProfile?.displayName || 'U').charAt(0)}
                        </div>
                    )}
                    <div>
                        <h2 className="font-semibold text-lg">{userProfile?.displayName || currentUser.displayName}</h2>
                        <p className="text-sm text-[var(--color-text-muted)]">{currentUser.email}</p>
                    </div>
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-4">
                <div className="card p-4 text-center">
                    <div className="text-2xl font-bold text-[var(--color-primary)]">
                        {privacyStats.totalPosts}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                        Your posts
                    </div>
                </div>
                <div className="card p-4 text-center">
                    <div className="text-2xl font-bold text-[var(--color-accent)]">
                        {privacyStats.totalViews}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                        Total views
                    </div>
                </div>
                <div className="card p-4 text-center">
                    <div className="text-2xl font-bold text-[var(--color-accent-green)]">
                        {circles.length}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                        Circles
                    </div>
                </div>
            </div>

            {/* Privacy Score */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold">Privacy Score</h2>
                    <span className={`text-2xl font-bold ${privacyScore >= 80 ? 'text-[var(--color-accent-green)]' : 'text-amber-400'}`}>
                        {privacyScore}/100
                    </span>
                </div>
                <div className="progress-bar mb-4">
                    <div
                        className="progress-bar-fill transition-all duration-1000"
                        style={{ width: `${privacyScore}%`, backgroundColor: privacyScore >= 80 ? 'var(--color-accent-green)' : 'var(--color-primary)' }}
                    ></div>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-[var(--color-accent-green)]">
                        <span>✓</span>
                        <span>No third-party trackers</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--color-accent-green)]">
                        <span>✓</span>
                        <span>End-to-end encryption available</span>
                    </div>
                    <div className={`flex items-center gap-2 ${userPosts.length > 0 && userPosts.every(p => p.circleIds?.length) ? 'text-[var(--color-accent-green)]' : 'text-slate-500'}`}>
                        <span>{userPosts.length > 0 && userPosts.every(p => p.circleIds?.length) ? '✓' : '•'}</span>
                        <span>All posts have limited audiences</span>
                    </div>
                </div>
            </div>

            {/* Recent Post Visibility */}
            <div className="card p-4">
                <h2 className="font-semibold mb-4">Your Post Visibility</h2>

                <div className="space-y-4">
                    {userPosts.length === 0 ? (
                        <p className="text-[var(--color-text-muted)] text-sm text-center py-4">
                            No posts yet. Your posts will appear here with visibility details.
                        </p>
                    ) : (
                        userPosts.slice(0, 5).map(post => {
                            const postCircles = (post.circleIds || []).map(id => getCircleById(id)).filter(Boolean);
                            const isInnerCircle = postCircles.some(c => c.trustLevel === 'inner');
                            const createdAt = post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt);

                            return (
                                <div
                                    key={post.id}
                                    className="p-4 bg-[var(--color-surface-hover)] rounded-xl space-y-3"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm truncate mb-1">
                                                "{post.content.slice(0, 50)}{post.content.length > 50 ? '...' : ''}"
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                                                {isInnerCircle && (
                                                    <span className="flex items-center gap-1 text-[var(--color-inner)]">
                                                        <Lock size={10} />
                                                        Encrypted
                                                    </span>
                                                )}
                                                <span>{postCircles.map(c => c.name).join(', ') || 'No circles'}</span>
                                                <span>•</span>
                                                <span>{formatDistanceToNow(createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                                            <Eye size={14} />
                                            <span>
                                                Seen by {(post.seenBy || []).length} people
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => setShowRevokeModal(post.id)}
                                            className="btn btn-ghost text-xs text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
                                        >
                                            Revoke Access
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Data Controls */}
            <div className="card p-4 space-y-3">
                <h2 className="font-semibold">Data Controls</h2>

                <button
                    onClick={handleDownloadData}
                    disabled={downloading}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-[var(--color-surface-hover)] hover:bg-[var(--color-surface)] transition-all text-left"
                >
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                        <Download size={20} className="text-[var(--color-primary)]" />
                    </div>
                    <div className="flex-1">
                        <div className="font-medium">{downloading ? 'Preparing...' : 'Download My Data'}</div>
                        <p className="text-sm text-[var(--color-text-muted)]">
                            Get a copy of all your posts and data
                        </p>
                    </div>
                    <ChevronRight size={18} className="text-[var(--color-text-muted)]" />
                </button>

                <button
                    onClick={handleDeleteAllData}
                    disabled={deleting}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-[var(--color-surface-hover)] hover:bg-[var(--color-danger)]/10 transition-all text-left group"
                >
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-danger)]/10 flex items-center justify-center">
                        <Trash2 size={20} className="text-[var(--color-danger)]" />
                    </div>
                    <div className="flex-1">
                        <div className="font-medium text-[var(--color-danger)]">{deleting ? 'Deleting...' : 'Delete All Data'}</div>
                        <p className="text-sm text-[var(--color-text-muted)]">
                            Permanently remove all posts and account data
                        </p>
                    </div>
                    <ChevronRight size={18} className="text-[var(--color-text-muted)]" />
                </button>
            </div>

            {/* Privacy Guarantee */}
            <div className="card p-4 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 border-[var(--color-primary)]/30">
                <div className="flex items-start gap-3">
                    <Shield size={24} className="text-[var(--color-primary)] flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold mb-1">Our Privacy Guarantee</h3>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                            We never sell your data. No ads, no tracking, no algorithmic manipulation.
                            Your content is yours — you decide who sees it, and you can revoke access anytime.
                        </p>
                    </div>
                </div>
            </div>

            {/* Revoke Modal */}
            {showRevokeModal && (
                <div
                    className="modal-backdrop"
                    onClick={() => setShowRevokeModal(null)}
                >
                    <div
                        className="modal p-6"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-labelledby="revoke-title"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-[var(--color-danger)]/10 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle size={24} className="text-[var(--color-danger)]" />
                            </div>
                            <div>
                                <h2 id="revoke-title" className="text-lg font-semibold">Revoke Access?</h2>
                                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                                    This will permanently delete this post and remove it from everyone's feed.
                                    This action cannot be undone.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowRevokeModal(null)}
                                className="btn btn-icon btn-ghost"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRevokeModal(null)}
                                className="btn btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleRevoke(showRevokeModal)}
                                className="btn flex-1 bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger)]/90"
                            >
                                Revoke Access
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
