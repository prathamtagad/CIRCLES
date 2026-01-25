import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Lock, Shield, Users, Search, Check, X } from 'lucide-react';

export default function CreateCircle() {
    const navigate = useNavigate();
    const { createCircle, users, circles, currentUser } = useApp();

    const [name, setName] = useState('');
    const [trustLevel, setTrustLevel] = useState('middle');
    const [parentId, setParentId] = useState(null);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const trustLevels = [
        {
            id: 'inner',
            label: 'Inner Circle',
            icon: <Lock size={18} />,
            description: 'End-to-end encrypted. For your closest relationships.',
            color: 'var(--color-inner)'
        },
        {
            id: 'middle',
            label: 'Trusted',
            icon: <Shield size={18} />,
            description: 'Trusted friends and family.',
            color: 'var(--color-middle)'
        },
        {
            id: 'outer',
            label: 'Extended',
            icon: <Users size={18} />,
            description: 'Acquaintances and broader network.',
            color: 'var(--color-outer)'
        }
    ];

    const filteredUsers = users.filter(u =>
        u.id !== currentUser.id &&
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleMember = (userId) => {
        setSelectedMembers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleCreate = () => {
        if (!name.trim()) return;

        const colors = {
            inner: '#22D3EE',
            middle: '#6366F1',
            outer: '#94A3B8'
        };

        createCircle({
            name: name.trim(),
            trustLevel,
            members: selectedMembers,
            parentId,
            color: colors[trustLevel]
        });

        navigate('/circles');
    };

    const previewCount = selectedMembers.length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-icon btn-ghost"
                    aria-label="Go back"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold">Create New Circle</h1>
            </div>

            {/* Circle Name */}
            <div className="card p-4 space-y-4">
                <div>
                    <label htmlFor="circle-name" className="block text-sm font-medium mb-2">
                        Circle Name
                    </label>
                    <input
                        id="circle-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Close Friends, Family, Work Team"
                        className="input"
                        autoFocus
                    />
                </div>
            </div>

            {/* Trust Level */}
            <div className="card p-4 space-y-4">
                <label className="block text-sm font-medium">
                    Trust Level
                </label>
                <div className="space-y-2">
                    {trustLevels.map(level => (
                        <button
                            key={level.id}
                            onClick={() => setTrustLevel(level.id)}
                            className={`w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left ${trustLevel === level.id
                                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                                : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
                                }`}
                            role="radio"
                            aria-checked={trustLevel === level.id}
                        >
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${level.color}20`, color: level.color }}
                            >
                                {level.icon}
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">{level.label}</div>
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    {level.description}
                                </p>
                            </div>
                            {trustLevel === level.id && (
                                <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                                    <Check size={14} className="text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {trustLevel === 'inner' && (
                    <div className="flex items-start gap-2 p-3 bg-[var(--color-inner)]/10 rounded-lg text-sm">
                        <Lock size={16} className="text-[var(--color-inner)] flex-shrink-0 mt-0.5" />
                        <p className="text-[var(--color-text-secondary)]">
                            <strong className="text-[var(--color-inner)]">Inner Circles are end-to-end encrypted.</strong> Only members can see content.
                        </p>
                    </div>
                )}
            </div>

            {/* Parent Circle (optional nesting) */}
            <div className="card p-4 space-y-4">
                <label className="block text-sm font-medium">
                    Parent Circle <span className="text-[var(--color-text-muted)]">(optional)</span>
                </label>
                <select
                    value={parentId || ''}
                    onChange={(e) => setParentId(e.target.value || null)}
                    className="input"
                    aria-label="Select parent circle"
                >
                    <option value="">None (top-level circle)</option>
                    {circles.map(circle => (
                        <option key={circle.id} value={circle.id}>
                            {circle.name}
                        </option>
                    ))}
                </select>
                <p className="text-xs text-[var(--color-text-muted)]">
                    Nested circles inherit members from their parent
                </p>
            </div>

            {/* Add Members */}
            <div className="card p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium">
                        Add Members
                    </label>
                    <span className="text-sm text-[var(--color-text-muted)]">
                        {previewCount} selected
                    </span>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search contacts..."
                        className="input !pl-10"
                        aria-label="Search contacts"
                    />
                </div>

                {/* Member list */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {filteredUsers.map(user => (
                        <button
                            key={user.id}
                            onClick={() => toggleMember(user.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${selectedMembers.includes(user.id)
                                ? 'bg-violet-500/10 border border-violet-500'
                                : 'bg-white/5 border border-transparent hover:border-white/10'
                                }`}
                            aria-pressed={selectedMembers.includes(user.id)}
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-sm text-white">{user.name}</div>
                                <div className="text-xs text-slate-500">{user.email}</div>
                            </div>
                            {selectedMembers.includes(user.id) ? (
                                <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                                    <Check size={12} className="text-white" />
                                </div>
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-600"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Preview & Create */}
            <div className="bg-[#030712]/80 backdrop-blur-xl border-t border-white/10 p-4 sticky bottom-0 z-30 -mx-4 px-4 sm:rounded-t-2xl sm:mx-0">
                <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-slate-400">Preview</span>
                    <span className="font-medium text-white">
                        {name || 'Untitled'} • {previewCount} member{previewCount !== 1 ? 's' : ''}
                    </span>
                </div>

                <button
                    onClick={handleCreate}
                    className="btn btn-primary w-full"
                    disabled={!name.trim()}
                >
                    Create Circle
                </button>
            </div>
        </div>
    );
}
