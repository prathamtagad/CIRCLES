import { useState, useEffect } from 'react';
import { Search, User, FileText, ArrowLeft, Filter } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAllUsers } from '../firebase/firestore'; // Reusing this, in production need dedicated search
import PostCard from '../components/PostCard';

export default function SearchPage() {
    const { posts, currentUser } = useApp();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('people'); // people | posts
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const [allUsers, setAllUsers] = useState([]);
    const [results, setResults] = useState({ people: [], posts: [] });

    // Fetch all users on mount (for this scale of app)
    useEffect(() => {
        async function fetchUsers() {
            setLoading(true);
            const res = await getAllUsers();
            if (res.success) {
                setAllUsers(res.data);
            }
            setLoading(false);
        }
        fetchUsers();
    }, []);

    // Handle Search Logic
    useEffect(() => {
        if (!query.trim()) {
            setResults({ people: [], posts: [] });
            return;
        }

        const lowerQuery = query.toLowerCase();

        // 1. Search People
        const peopleResults = allUsers.filter(user =>
            user.name.toLowerCase().includes(lowerQuery) ||
            (user.email && user.email.toLowerCase().includes(lowerQuery))
        );

        // 2. Search Posts (client-side for now)
        const postsResults = posts.filter(post =>
            post.content.toLowerCase().includes(lowerQuery)
        );

        setResults({ people: peopleResults, posts: postsResults });

    }, [query, allUsers, posts]);

    return (
        <div className="pb-20 md:pb-0 min-h-screen">
            {/* Search Header */}
            <div className="sticky top-0 z-20 bg-[#030712]/90 backdrop-blur-xl border-b border-white/5 p-4">
                <div className="relative">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 md:hidden"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="relative flex-1 md:ml-0 ml-8">
                        <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search people, circles, posts..."
                            className="w-full bg-white/5 border border-white/5 rounded-full py-3 pl-11 pr-4 outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all font-medium placeholder:text-slate-600"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mt-4 px-2">
                    <button
                        onClick={() => setActiveTab('people')}
                        className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'people'
                                ? 'border-violet-500 text-white'
                                : 'border-transparent text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <User size={16} />
                        People
                    </button>
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'posts'
                                ? 'border-violet-500 text-white'
                                : 'border-transparent text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <FileText size={16} />
                        Posts
                    </button>
                </div>
            </div>

            {/* Results Content */}
            <div className="p-4">
                {query.trim() === '' ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                        <Search size={48} className="mb-4 opacity-20" />
                        <p>Search for anyone or anything on Circles</p>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        {/* PEOPLE RESULTS */}
                        {activeTab === 'people' && (
                            <div className="space-y-4">
                                {results.people.length > 0 ? (
                                    results.people.map(user => (
                                        <Link
                                            key={user.id}
                                            to={`/profile/${user.id}`}
                                            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                                        >
                                            <div className="flex items-center gap-4">
                                                {user.photoURL ? (
                                                    <img src={user.photoURL} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-lg text-slate-400">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-white group-hover:text-violet-400 transition-colors">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-slate-500">
                                                        @{user.name.toLowerCase().replace(/\s/g, '')}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Could add quick follow button here later */}
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-slate-500">
                                        No people found matching "{query}"
                                    </div>
                                )}
                            </div>
                        )}

                        {/* POST RESULTS */}
                        {activeTab === 'posts' && (
                            <div className="space-y-6">
                                {results.posts.length > 0 ? (
                                    results.posts.map(post => (
                                        <PostCard key={post.id} post={post} />
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-slate-500">
                                        No posts found matching "{query}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
