import { ArrowLeft, Eye, Heart, Server } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Transparency() {
    const navigate = useNavigate();

    return (
        <div className="pb-20 max-w-3xl mx-auto px-4">
            {/* Header */}
            <div className="sticky top-0 bg-[#030712]/90 backdrop-blur-xl z-10 py-4 border-b border-white/5 mb-6 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-white/5 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <Eye className="text-cyan-500" size={24} />
                    <h1 className="text-xl font-bold">Transparency Report</h1>
                </div>
            </div>

            <div className="space-y-8 animate-fade-in text-slate-300">
                {/* Intro */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/20">
                    <p className="text-lg text-white">
                        At Circles, we believe in radical transparency. You deserve to know how our systems work, what we optimize for, and how we handle data requests.
                    </p>
                </div>

                {/* Algorithm Info */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Server size={24} />
                        How the Feed Works
                    </h2>
                    <p className="mb-4">
                        Unlike traditional social media, we do not use "engagement baiting" algorithms.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="card p-4">
                            <h3 className="font-bold text-white mb-2">Chronological First</h3>
                            <p className="text-sm">Your feed is primarily chronological. We don't reorder posts to maximize addiction.</p>
                        </div>
                        <div className="card p-4">
                            <h3 className="font-bold text-white mb-2">Trust-Based</h3>
                            <p className="text-sm">Posts from your "Inner Circle" are prioritized only to ensure you don't miss important updates from close friends, not to keep you scrolling.</p>
                        </div>
                    </div>
                </section>

                {/* Business Model */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Heart size={24} />
                        Our Business Model
                    </h2>
                    <p className="mb-4">
                        We are a user-supported platform.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                            <span>Selling User Data</span>
                            <span className="font-bold text-red-400">Never</span>
                        </li>
                        <li className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                            <span>Targeted Advertising</span>
                            <span className="font-bold text-red-400">No</span>
                        </li>
                        <li className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                            <span>Premium Features</span>
                            <span className="font-bold text-green-400">Yes</span>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Government Data Requests</h2>
                    <p className="mb-4">
                        As of <strong>January 2026</strong>, we have received:
                    </p>
                    <div className="flex gap-4">
                        <div className="flex-1 p-4 bg-white/5 rounded-xl text-center border border-white/5">
                            <div className="text-3xl font-bold text-white">53</div>
                            <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Requests</div>
                        </div>
                        <div className="flex-1 p-4 bg-white/5 rounded-xl text-center border border-white/5">
                            <div className="text-3xl font-bold text-white">20</div>
                            <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Disclosures</div>
                        </div>
                    </div>
                </section>

                <div className="pt-8 border-t border-white/5 text-sm text-slate-500">
                    Live Updated: January 25, 2026
                </div>
            </div>
        </div>
    );
}
