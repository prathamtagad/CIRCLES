export default function LoadingScreen() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <div className="flex flex-col items-center animate-pulse">
                {/* Logo */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center mb-6 shadow-lg">
                    <div className="w-12 h-12 border-3 border-white/60 rounded-full flex items-center justify-center">
                        <div className="w-5 h-5 bg-white rounded-full opacity-90"></div>
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-2">Circles</h1>
                <p className="text-[var(--color-text-secondary)]">Loading...</p>

                {/* Loading spinner */}
                <div className="mt-6">
                    <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        </div>
    );
}
