import { ArrowLeft, FileText, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
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
                    <FileText className="text-violet-500" size={24} />
                    <h1 className="text-xl font-bold">Terms of Service</h1>
                </div>
            </div>

            <div className="space-y-8 animate-fade-in text-slate-300">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using Circles, you agree to be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Your Circles, Your Rules</h2>
                    <p className="mb-4">
                        Circles is designed to give you control over your social experience. You are responsible for:
                    </p>
                    <ul className="list-none space-y-2">
                        <li className="flex items-start gap-2">
                            <Check className="text-violet-500 mt-1 shrink-0" size={16} />
                            <span>Managing your circle memberships and trust levels.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="text-violet-500 mt-1 shrink-0" size={16} />
                            <span>The content you post and share.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="text-violet-500 mt-1 shrink-0" size={16} />
                            <span>Maintaining the privacy of content shared within your private circles.</span>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. Content Policy</h2>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <p className="mb-4">
                            We believe in free expression within trusted circles, but we strictly prohibit:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                            <li>Illegal content or activity</li>
                            <li>Harassment or hateful conduct</li>
                            <li>Spam or automated manipulation</li>
                            <li>Impersonation</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Privacy & Data</h2>
                    <p>
                        Your data belongs to you. We store it securely to provide the service, but we do not sell your personal data to advertisers.
                        Please review our <button onClick={() => navigate('/privacy')} className="text-violet-400 hover:underline">Privacy Policy</button> for full details.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Account Termination</h2>
                    <p>
                        We reserve the right to suspend or terminate accounts that violate these terms.
                        You may also delete your account at any time from the Settings menu.
                    </p>
                </section>

                <div className="pt-8 border-t border-white/5 text-sm text-slate-500">
                    Last updated: January 2026
                </div>
            </div>
        </div>
    );
}
