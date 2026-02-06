export default function LoadingScreen() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-neutral-950 flex items-center justify-center">
            {/* Animated background blobs */}
            <div className="absolute top-1/4 -left-10 h-72 w-72 rounded-full bg-emerald-900/20 blur-3xl animate-float" />
            <div className="absolute bottom-1/3 -right-16 h-96 w-96 rounded-full bg-emerald-800/15 blur-3xl animate-float-delayed" />
            <div className="absolute top-2/3 left-1/3 h-56 w-56 rounded-full bg-green-900/20 blur-3xl animate-float-slow" />

            {/* Subtle grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

            {/* Loader */}
            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="relative h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-900/30" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin-slow" />
                    <div className="absolute inset-2 rounded-full bg-emerald-500/10 animate-pulse-green" />
                </div>
                <p className="text-emerald-600/70 text-sm tracking-wide">Loading...</p>
            </div>
        </div>
    );
}
