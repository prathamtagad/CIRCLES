import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Image, Mic, Paperclip, Eye, Clock, Check } from 'lucide-react';

export default function Compose() {
    const navigate = useNavigate();
    const { circles, createPost, currentUser, userProfile, loading } = useApp();

    const [content, setContent] = useState('');
    const [selectedCircles, setSelectedCircles] = useState([]);
    const [expiresIn, setExpiresIn] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isPosting, setIsPosting] = useState(false);

    const expiryOptions = [
        { value: null, label: 'Never' },
        { value: 1, label: '1 hour' },
        { value: 24, label: '24 hours' },
        { value: 168, label: '1 week' }
    ];

    const toggleCircle = (circleId) => {
        setSelectedCircles(prev =>
            prev.includes(circleId)
                ? prev.filter(id => id !== circleId)
                : [...prev, circleId]
        );
    };

    const getPreviewMembers = () => {
        const memberSet = new Set();
        selectedCircles.forEach(circleId => {
            const circle = circles.find(c => c.id === circleId);
            if (circle && circle.members) {
                circle.members.forEach(m => memberSet.add(m));
            }
        });
        return Array.from(memberSet);
    };

    const previewMembers = getPreviewMembers();
    const totalReach = previewMembers.length;

    const handlePost = async () => {
        if (!content.trim() || selectedCircles.length === 0) return;

        setIsPosting(true);

        const userName = userProfile?.displayName || currentUser?.displayName || 'User';

        await createPost({
            content: content.trim(),
            circleIds: selectedCircles,
            authorName: userName,
            expiresAt: expiresIn
                ? new Date(Date.now() + expiresIn * 60 * 60 * 1000)
                : null,
            image: null
        });

        setIsPosting(false);
        navigate('/');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-icon btn-ghost"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold">New Post</h1>
                </div>
                <button
                    onClick={handlePost}
                    className="btn btn-primary"
                    disabled={!content.trim() || selectedCircles.length === 0 || isPosting}
                >
                    {isPosting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Posting...
                        </>
                    ) : (
                        `Post to ${selectedCircles.length} Circle${selectedCircles.length !== 1 ? 's' : ''}`
                    )}
                </button>
            </div>

            {/* Compose Area */}
            <div className="card p-4 space-y-4">
                <div className="flex items-start gap-3">
                    {currentUser?.photoURL ? (
                        <img
                            src={currentUser.photoURL}
                            alt="You"
                            className="w-10 h-10 rounded-full"
                        />
                    ) : (
                        <div className="avatar">
                            {(userProfile?.displayName || currentUser?.displayName || 'U').charAt(0)}
                        </div>
                    )}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind?"
                        className="flex-1 min-h-[120px] bg-transparent border-0 resize-none text-lg focus:outline-none"
                        autoFocus
                        aria-label="Post content"
                    />
                </div>

                {/* Media buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-[var(--color-border)]">
                    <button
                        className="btn btn-ghost btn-icon"
                        aria-label="Add image"
                    >
                        <Image size={20} />
                    </button>
                    <button
                        className="btn btn-ghost btn-icon"
                        aria-label="Add voice message"
                    >
                        <Mic size={20} />
                    </button>
                    <button
                        className="btn btn-ghost btn-icon"
                        aria-label="Attach file"
                    >
                        <Paperclip size={20} />
                    </button>
                </div>
            </div>

            {/* Share With Circles */}
            <div className="card p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium">Share with</label>
                    {circles.length > 0 && (
                        <button
                            onClick={() => setSelectedCircles(circles.map(c => c.id))}
                            className="text-sm text-[var(--color-primary)] hover:underline"
                        >
                            Select all
                        </button>
                    )}
                </div>

                {circles.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-[var(--color-text-muted)] text-sm">
                            No circles yet. Create a circle first to start posting.
                        </p>
                        <button
                            onClick={() => navigate('/circles/create')}
                            className="btn btn-secondary mt-3"
                        >
                            Create Circle
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {circles.map(circle => {
                            const memberCount = (circle.members || []).length;
                            const isSelected = selectedCircles.includes(circle.id);

                            return (
                                <button
                                    key={circle.id}
                                    onClick={() => toggleCircle(circle.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${isSelected
                                            ? 'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]'
                                            : 'bg-[var(--color-surface-hover)] border border-transparent hover:border-[var(--color-border)]'
                                        }`}
                                    aria-pressed={isSelected}
                                >
                                    <div
                                        className={`w-5 h-5 rounded flex items-center justify-center ${isSelected ? 'bg-[var(--color-primary)]' : 'border-2 border-[var(--color-border)]'
                                            }`}
                                    >
                                        {isSelected && <Check size={12} className="text-white" />}
                                    </div>

                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                                        style={{ backgroundColor: `${circle.color}20`, color: circle.color }}
                                    >
                                        {circle.name.charAt(0)}
                                    </div>

                                    <div className="flex-1 text-left">
                                        <div className="font-medium text-sm">{circle.name}</div>
                                        <div className="text-xs text-[var(--color-text-muted)]">
                                            {memberCount} member{memberCount !== 1 ? 's' : ''}
                                        </div>
                                    </div>

                                    <span className={`trust-badge trust-${circle.trustLevel || 'middle'}`}>
                                        {circle.trustLevel === 'inner' ? '🔒' : circle.trustLevel === 'middle' ? '🛡️' : '👥'}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Expiry Settings */}
            <div className="card p-4 space-y-4">
                <label className="flex items-center gap-2 text-sm font-medium">
                    <Clock size={16} />
                    Auto-expire
                </label>

                <div className="flex flex-wrap gap-2">
                    {expiryOptions.map(option => (
                        <button
                            key={option.label}
                            onClick={() => setExpiresIn(option.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${expiresIn === option.value
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                                }`}
                            aria-pressed={expiresIn === option.value}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {expiresIn && (
                    <p className="text-xs text-[var(--color-text-muted)]">
                        This post will automatically delete after {expiryOptions.find(o => o.value === expiresIn)?.label}
                    </p>
                )}
            </div>

            {/* Preview */}
            {selectedCircles.length > 0 && (
                <div className="card p-4 space-y-4">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-2 text-sm font-medium w-full"
                        aria-expanded={showPreview}
                    >
                        <Eye size={16} />
                        <span>
                            Sharing to {selectedCircles.length} circle{selectedCircles.length !== 1 ? 's' : ''}
                            {totalReach > 0 && ` (${totalReach} member${totalReach !== 1 ? 's' : ''})`}
                        </span>
                    </button>

                    {showPreview && totalReach > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {previewMembers.slice(0, 8).map((email, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 bg-[var(--color-surface-hover)] rounded-full pl-1 pr-3 py-1"
                                >
                                    <div className="avatar avatar-sm">
                                        {email.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm truncate max-w-[120px]">{email}</span>
                                </div>
                            ))}
                            {previewMembers.length > 8 && (
                                <div className="flex items-center px-3 py-1 bg-[var(--color-surface-hover)] rounded-full text-sm text-[var(--color-text-muted)]">
                                    +{previewMembers.length - 8} more
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
