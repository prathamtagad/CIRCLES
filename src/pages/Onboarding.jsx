import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Users, Lock, Sparkles, Check } from 'lucide-react';

export default function Onboarding() {
    const { completeOnboarding, createCircle, currentUser, userProfile } = useApp();
    const [step, setStep] = useState(1);
    const [selectedCircles, setSelectedCircles] = useState([]);
    const [circleName, setCircleName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const presetCircles = [
        { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', trustLevel: 'inner', color: '#22D3EE' },
        { id: 'friends', name: 'Close Friends', icon: '👯', trustLevel: 'inner', color: '#22D3EE' },
        { id: 'work', name: 'Work / School', icon: '💼', trustLevel: 'middle', color: '#6366F1' },
    ];

    const handleSelectCircle = (circleId) => {
        setSelectedCircles(prev =>
            prev.includes(circleId)
                ? prev.filter(id => id !== circleId)
                : [...prev, circleId]
        );
    };

    const handleCreateCustom = () => {
        if (circleName.trim()) {
            setSelectedCircles(prev => [...prev, { custom: true, name: circleName.trim() }]);
            setCircleName('');
        }
    };

    const handleComplete = async () => {
        setIsCreating(true);

        // Create circles from selection
        for (const selection of selectedCircles) {
            if (typeof selection === 'object' && selection.custom) {
                // Custom circle
                await createCircle({
                    name: selection.name,
                    trustLevel: 'middle',
                    members: [],
                    parentId: null,
                    color: '#6366F1',
                });
            } else {
                // Preset circle
                const preset = presetCircles.find(p => p.id === selection);
                if (preset) {
                    await createCircle({
                        name: preset.name,
                        trustLevel: preset.trustLevel,
                        members: [],
                        parentId: null,
                        color: preset.color,
                    });
                }
            }
        }

        // Mark onboarding as complete
        await completeOnboarding();
        setIsCreating(false);
    };

    const skipToApp = async () => {
        await completeOnboarding();
    };

    const userName = userProfile?.displayName || currentUser?.displayName || 'there';
    const firstName = userName.split(' ')[0];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Progress bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-[var(--color-text-muted)] mb-2">
                        <span>Step {step} of 3</span>
                        <span>{Math.round((step / 3) * 100)}%</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${(step / 3) * 100}%` }}
                            role="progressbar"
                            aria-valuenow={step}
                            aria-valuemin="1"
                            aria-valuemax="3"
                        ></div>
                    </div>
                </div>

                {/* Step 1: Welcome */}
                {step === 1 && (
                    <div className="card p-6 animate-fadeIn">
                        {/* User greeting with photo */}
                        <div className="flex flex-col items-center mb-6">
                            {currentUser?.photoURL ? (
                                <img
                                    src={currentUser.photoURL}
                                    alt={userName}
                                    className="w-20 h-20 rounded-full mb-4 border-4 border-[var(--color-primary)]"
                                />
                            ) : (
                                <div className="avatar avatar-lg mb-4">
                                    {firstName.charAt(0)}
                                </div>
                            )}
                            <h2 className="text-xl font-semibold">Welcome, {firstName}! 👋</h2>
                            <p className="text-[var(--color-text-secondary)] text-sm text-center mt-1">
                                Let's set up your private social space
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                                    <Lock size={20} className="text-[var(--color-primary)]" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Privacy by Default</h3>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Nothing is shared until you choose. You control every audience.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                                    <Users size={20} className="text-[var(--color-accent)]" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Trust-Based Circles</h3>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Organize contacts by trust level. Family ≠ work colleagues.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-green)]/10 flex items-center justify-center flex-shrink-0">
                                    <Sparkles size={20} className="text-[var(--color-accent-green)]" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Healthy Engagement</h3>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        No infinite scroll, no manipulation. Just meaningful connections.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            className="btn btn-primary w-full"
                        >
                            Set Up My Circles
                            <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                {/* Step 2: Create First Circle */}
                {step === 2 && (
                    <div className="card p-6 animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-2">Create your first Circle</h2>
                        <p className="text-[var(--color-text-secondary)] text-sm mb-6">
                            Who do you want to share with most often?
                        </p>

                        <div className="space-y-3 mb-6">
                            {presetCircles.map(circle => (
                                <button
                                    key={circle.id}
                                    onClick={() => handleSelectCircle(circle.id)}
                                    className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${selectedCircles.includes(circle.id)
                                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                                            : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
                                        }`}
                                    aria-pressed={selectedCircles.includes(circle.id)}
                                >
                                    <span className="text-2xl">{circle.icon}</span>
                                    <div className="flex-1 text-left">
                                        <span className="font-medium">{circle.name}</span>
                                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${circle.trustLevel === 'inner'
                                                ? 'bg-[var(--color-inner)]/20 text-[var(--color-inner)]'
                                                : 'bg-[var(--color-middle)]/20 text-[var(--color-middle)]'
                                            }`}>
                                            {circle.trustLevel === 'inner' ? '🔒 Encrypted' : '🛡️ Trusted'}
                                        </span>
                                    </div>
                                    {selectedCircles.includes(circle.id) && (
                                        <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                                            <Check size={14} className="text-white" />
                                        </div>
                                    )}
                                    {!selectedCircles.includes(circle.id) && (
                                        <ArrowRight size={18} className="text-[var(--color-text-muted)]" />
                                    )}
                                </button>
                            ))}

                            {/* Show custom circles added */}
                            {selectedCircles.filter(s => typeof s === 'object').map((custom, idx) => (
                                <div
                                    key={idx}
                                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                                >
                                    <span className="text-2xl">✨</span>
                                    <span className="font-medium flex-1">{custom.name}</span>
                                    <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                                        <Check size={14} className="text-white" />
                                    </div>
                                </div>
                            ))}

                            {/* Custom circle input */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={circleName}
                                    onChange={(e) => setCircleName(e.target.value)}
                                    placeholder="✨ Custom circle name..."
                                    className="input flex-1"
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateCustom()}
                                />
                                {circleName && (
                                    <button
                                        onClick={handleCreateCustom}
                                        className="btn btn-secondary"
                                    >
                                        Add
                                    </button>
                                )}
                            </div>
                        </div>

                        <p className="text-xs text-[var(--color-text-muted)] mb-4 text-center">
                            You can always add more circles later
                        </p>

                        <button
                            onClick={() => setStep(3)}
                            className="btn btn-primary w-full"
                            disabled={selectedCircles.length === 0}
                        >
                            Continue
                            <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                {/* Step 3: Final */}
                {step === 3 && (
                    <div className="card p-6 animate-fadeIn text-center">
                        <div className="w-16 h-16 rounded-full bg-[var(--color-accent-green)]/20 flex items-center justify-center mx-auto mb-4">
                            <Check size={32} className="text-[var(--color-accent-green)]" />
                        </div>

                        <h2 className="text-xl font-semibold mb-2">You're all set, {firstName}!</h2>
                        <p className="text-[var(--color-text-secondary)] mb-6">
                            {selectedCircles.length} circle{selectedCircles.length !== 1 ? 's' : ''} ready.
                            Start sharing with the people you trust.
                        </p>

                        <div className="bg-[var(--color-surface-hover)] rounded-xl p-4 mb-6">
                            <div className="flex flex-wrap gap-2 justify-center">
                                {selectedCircles.map((selection, idx) => {
                                    const isCustom = typeof selection === 'object';
                                    const preset = !isCustom && presetCircles.find(p => p.id === selection);
                                    const name = isCustom ? selection.name : preset?.name;
                                    const icon = isCustom ? '✨' : preset?.icon;

                                    return (
                                        <span
                                            key={idx}
                                            className="trust-badge trust-inner"
                                        >
                                            {icon} {name}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            onClick={handleComplete}
                            className="btn btn-primary w-full"
                            disabled={isCreating}
                        >
                            {isCreating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating circles...
                                </>
                            ) : (
                                <>
                                    Enter Circles
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Skip option */}
                <button
                    onClick={skipToApp}
                    className="btn btn-ghost w-full mt-4 text-sm"
                    disabled={isCreating}
                >
                    Skip for now
                </button>
            </div>
        </div>
    );
}
