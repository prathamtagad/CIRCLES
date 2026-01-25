import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import PostCard from '../components/PostCard';
import { Sparkles, RefreshCw, PlusCircle, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
    const {
        circles,
        activeCircle,
        setActiveCircle,
        getFilteredPosts,
        liteMode,
        loading
    } = useApp();

    const [showCaughtUp, setShowCaughtUp] = useState(false);
    const posts = getFilteredPosts();

    useEffect(() => {
        if (posts.length > 0 && posts.length <= 25) {
            setShowCaughtUp(true);
        }
    }, [posts.length]);

    return (
        <div className="">
            {/* 🔮 NEON TABS HEADER (Sticky) */}
            <div className="sticky top-0 z-40 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5 px-4 py-3">
                {circles.length > 0 ? (
                    <div className="flex gap-2 overflow-x-auto no-scrollbar mask-grad-r pb-1">
                        <button
                            onClick={() => setActiveCircle('all')}
                            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${activeCircle === 'all'
                                    ? 'bg-white text-black border-white'
                                    : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'
                                }`}
                        >
                            All
                        </button>
                        {circles.map(c => (
                            <button
                                key={c.id}
                                onClick={() => setActiveCircle(c.id)}
                                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border flex items-center gap-2 ${activeCircle === c.id
                                        ? 'scale-105 shadow-sm'
                                        : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'
                                    }`}
                                style={activeCircle === c.id ? {
                                    backgroundColor: `${c.color}20`,
                                    color: c.color,
                                    borderColor: c.color
                                } : {}}
                            >
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                                {c.name}
                            </button>
                        ))}
                    </div>
                ) : (
                    <h2 className="text-lg font-bold">Home Feed</h2>
                )}
            </div>

            <div className="p-4 space-y-6 min-h-[calc(100vh-120px)]">
                {/* Loading state */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-violet-500 animate-spin"></div>
                        </div>
                    </div>
                )}

                {/* Feed Content */}
                {!loading && posts.length === 0 ? (
                    <div className="flex flex-col items-center text-center py-20">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Sparkles size={24} className="text-slate-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                            {circles.length === 0 ? 'Welcome to Circles' : 'No posts yet'}
                        </h3>
                        <p className="text-slate-500 max-w-xs mx-auto mb-6 text-sm">
                            {circles.length === 0
                                ? 'Create a Circle to start your private network.'
                                : 'Share your first moment with this circle.'
                            }
                        </p>
                        <Link
                            to={circles.length === 0 ? '/circles/create' : '/compose'}
                            className="btn btn-primary btn-sm"
                        >
                            {circles.length === 0 ? 'Create Circle' : 'Share Moment'}
                        </Link>
                    </div>
                ) : (
                    posts.map((post, index) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            liteMode={liteMode}
                            style={{ animationDelay: `${index * 100}ms` }}
                        />
                    ))
                )}

                {/* ✨ CAUGHT UP CELEBRATION */}
                {showCaughtUp && posts.length > 0 && (
                    <div className="py-6 flex flex-col items-center text-center border-t border-white/5 mt-8">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                            <Sparkles size={14} className="text-emerald-400" />
                        </div>
                        <p className="text-slate-500 text-xs font-medium">
                            You're all caught up!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
