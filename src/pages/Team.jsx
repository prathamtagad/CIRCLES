import { Github, Twitter, Linkedin, Trophy, Code, Palette, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Team() {
    const team = [
        {
            name: 'Pratham Tagad',
            role: 'Lead Architect & Full Stack Engineer',
            bio: 'Visionary behind Circles. Orchestrating the entire technical architecture and product direction.',
            icon: <Trophy size={24} className="text-amber-400" />,
            color: 'from-amber-400 to-orange-500',
            glow: 'shadow-amber-500/20',
            special: true
        },
        {
            name: 'Karan Sachdev',
            role: 'Frontend Specialist & UI/UX',
            bio: 'Crafting pixel-perfect interfaces and seamless user experiences that feel alive.',
            icon: <Palette size={24} className="text-cyan-400" />,
            color: 'from-cyan-400 to-blue-500',
            glow: 'shadow-cyan-500/20',
            special: false
        },
        {
            name: 'Madhav Maheshwari',
            role: 'Backend Engineer & Security',
            bio: 'Ensuring robust data privacy, security rules, and scalable infrastructure.',
            icon: <Database size={24} className="text-emerald-400" />,
            color: 'from-emerald-400 to-green-500',
            glow: 'shadow-emerald-500/20',
            special: false
        }
    ];

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="text-center space-y-4 py-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white bg-clip-text text-transparent">
                    Meet the Minds
                </h1>
                <p className="text-slate-400 max-w-md mx-auto">
                    The passionate team building the future of privacy-first social networking for the SGSITS Hackathon 2026.
                </p>
            </div>

            {/* Team Grid */}
            <div className="space-y-6">
                {team.map((member, idx) => (
                    <div
                        key={idx}
                        className={`relative group overflow-hidden rounded-3xl border transition-all duration-300 ${member.special
                                ? 'bg-gradient-to-br from-white/10 to-black/50 border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10 scale-[1.02]'
                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:shadow-xl'
                            }`}
                    >
                        {/* Background Glow */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r ${member.color} transition-opacity duration-500`} />

                        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                            {/* Avatar / Icon */}
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br ${member.color} shadow-lg ${member.glow} shrink-0`}>
                                <div className="bg-black/20 w-full h-full absolute inset-0 rounded-2xl" />
                                <div className="relative text-white drop-shadow-md">
                                    {member.icon}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 mb-2">
                                    <h2 className={`text-2xl font-bold ${member.special ? 'text-white' : 'text-slate-200'}`}>
                                        {member.name}
                                    </h2>
                                    {member.special && (
                                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                                            TEAM LEAD
                                        </span>
                                    )}
                                </div>

                                <h3 className={`font-medium mb-3 bg-gradient-to-r ${member.color} bg-clip-text text-transparent`}>
                                    {member.role}
                                </h3>

                                <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                                    {member.bio}
                                </p>

                                {/* Social Links (Mock) */}
                                <div className="flex items-center gap-4 mt-6 justify-center sm:justify-start">
                                    <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-white text-slate-500 transition-colors">
                                        <Github size={18} />
                                    </a>
                                    <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-blue-400 text-slate-500 transition-colors">
                                        <Twitter size={18} />
                                    </a>
                                    <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-blue-600 text-slate-500 transition-colors">
                                        <Linkedin size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="text-center pt-10 border-t border-white/5">
                <p className="text-slate-500 text-sm">
                    Built with ❤️ at SGSITS Hackathon
                </p>
                <Link to="/" className="inline-block mt-4 text-violet-400 hover:text-violet-300 font-medium">
                    &larr; Back to Home
                </Link>
            </div>
        </div>
    );
}
