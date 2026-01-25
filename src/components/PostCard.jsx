import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from '../utils/format';
import { Heart, MessageCircle, MoreHorizontal, Lock, CheckCircle2, Shield, Share2 } from 'lucide-react';

export default function PostCard({ post, liteMode, style }) {
    const {
        getCircleById,
        likePost,
        addComment,
        currentUser,
        userProfile,
        circles
    } = useApp();

    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);

    // Get author info
    const isOwnPost = post.authorId === currentUser?.uid;
    const authorName = isOwnPost
        ? (userProfile?.displayName || currentUser?.displayName || 'You')
        : (post.authorName || 'User');
    const authorInitial = authorName.charAt(0).toUpperCase();

    const postCircles = (post.circleIds || []).map(id => getCircleById(id)).filter(Boolean);
    const isLiked = (post.likes || []).includes(currentUser?.uid);

    const handleComment = async (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            await addComment(post.id, commentText);
            setCommentText('');
        }
    };

    const handleLike = () => {
        if (!isLiked) {
            setIsLikeAnimating(true);
            setTimeout(() => setIsLikeAnimating(false), 1000);
        }
        likePost(post.id);
    };

    const getTrustBadge = () => {
        if (postCircles.length === 0) return null;
        const trustLevel = postCircles[0].trustLevel;
        const badges = {
            inner: { class: 'trust-inner', label: 'Inner Circle', icon: <Lock size={12} /> },
            middle: { class: 'trust-middle', label: 'Trusted', icon: <Shield size={12} /> },
            outer: { class: 'trust-outer', label: 'Extended', icon: <CheckCircle2 size={12} /> }
        };
        return badges[trustLevel] || badges.middle;
    };

    const badge = getTrustBadge();
    const createdAt = post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt);

    return (
        <article
            className="card group animate-fadeIn"
            style={style}
        >
            {/* 🟢 Post Header */}
            <div className="p-5 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                        {authorInitial}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-[15px] text-white">{authorName}</span>
                            {badge && (
                                <span className={`trust-badge ${badge.class} hidden sm:inline-flex`}>
                                    {badge.icon}
                                    {badge.label}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <time className="hover:text-slate-300 transition-colors">{formatDistanceToNow(createdAt)}</time>
                            <span>•</span>
                            <span className="text-violet-400/80">{postCircles.map(c => c.name).join(', ') || 'Private'}</span>
                        </div>
                    </div>
                </div>

                <button className="text-slate-500 hover:text-white transition-colors p-2 -mr-2 rounded-full hover:bg-white/5">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* 📄 Content */}
            <div className="px-5 pb-2">
                <p className="text-[15px] leading-7 text-slate-200 whitespace-pre-wrap font-normal">
                    {post.content}
                </p>
            </div>

            {/* 🖼️ Media */}
            {post.image && !liteMode && (
                <div className="mt-3 px-2">
                    <div className="relative rounded-2xl overflow-hidden bg-black/50 aspect-video group-hover:shadow-2xl transition-all duration-500 border border-white/5">
                        <img
                            src={post.image}
                            alt="Post attachment"
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                    </div>
                </div>
            )}

            {/* Lite Mode Placeholder */}
            {post.image && liteMode && (
                <div className="mx-5 mt-3 rounded-xl border border-dashed border-white/10 bg-white/5 p-6 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <span className="text-xl">📷</span>
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wider">Image hidden (Lite Mode)</span>
                </div>
            )}

            {/* ⚡ Actions Bar */}
            <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleLike}
                        className={`group/like flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${isLiked
                                ? 'text-rose-500 bg-rose-500/10'
                                : 'text-slate-400 hover:text-rose-500 hover:bg-rose-500/10'
                            }`}
                    >
                        <div className="relative">
                            <Heart
                                size={20}
                                className={`transition-transform duration-300 ${isLiked ? 'scale-110 fill-current' : 'group-hover/like:scale-110'}`}
                            />
                            {isLikeAnimating && (
                                <div className="absolute inset-0 animate-ping">
                                    <Heart size={20} className="fill-rose-500 text-rose-500" />
                                </div>
                            )}
                        </div>
                        <span className="text-sm font-medium">{(post.likes || []).length > 0 ? (post.likes || []).length : ''}</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="group/comment flex items-center gap-2 px-3 py-1.5 rounded-full text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                    >
                        <MessageCircle size={20} className="group-hover/comment:scale-110 transition-transform" />
                        <span className="text-sm font-medium">{(post.comments || []).length > 0 ? (post.comments || []).length : ''}</span>
                    </button>
                </div>

                {/* Seen By Avatars */}
                {(post.seenBy || []).length > 0 && (
                    <div className="flex items-center -space-x-2">
                        {[...Array(Math.min(3, (post.seenBy || []).length))].map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-[#1e293b] bg-slate-700 flex items-center justify-center text-[8px] text-white">
                                <Eye size={10} />
                            </div>
                        ))}
                        {(post.seenBy || []).length > 3 && (
                            <div className="w-6 h-6 rounded-full border-2 border-[#1e293b] bg-slate-800 flex items-center justify-center text-[9px] font-bold text-slate-400">
                                +{(post.seenBy || []).length - 3}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 💬 Comments Section */}
            {showComments && (
                <div className="bg-[#0B1221]/50 border-t border-white/5 p-5 space-y-4">
                    {(post.comments || []).map(comment => {
                        const commentCreatedAt = comment.createdAt instanceof Date ? comment.createdAt : new Date(comment.createdAt);

                        return (
                            <div key={comment.id} className="flex gap-3 animate-fadeIn">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0">
                                    {(comment.authorName || 'U').charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-2 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-white">{comment.authorName || 'User'}</span>
                                            <span className="text-[10px] text-slate-500">{formatDistanceToNow(commentCreatedAt)}</span>
                                        </div>
                                        <p className="text-sm text-slate-300">{comment.content}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <form onSubmit={handleComment} className="flex gap-2 relative mt-4">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add to the conversation..."
                            className="w-full bg-black/40 border border-white/10 rounded-full py-3.5 pl-5 pr-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="absolute right-2 top-2 p-1.5 bg-violet-600 text-white rounded-full hover:bg-violet-500 disabled:opacity-0 disabled:scale-75 transition-all"
                        >
                            <ArrowUp size={16} strokeWidth={3} />
                        </button>
                    </form>
                </div>
            )}
        </article>
    );
}
