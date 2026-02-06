import { Button } from "@/components/ui/button";
import Link from "next/link";
import AuthBackground from "./AuthBackground";

export default function HeroPage() {
    return (
        <AuthBackground>
            <div className="flex flex-col items-center gap-8 text-center">
                <div className="flex flex-col items-center gap-3">
                    <span className="text-emerald-500/80 text-sm font-medium tracking-widest uppercase">
                        Welcome
                    </span>
                    <h1 className="group relative text-5xl sm:text-6xl font-bold tracking-tight cursor-default">
                        <span className="text-white transition-opacity duration-500 group-hover:opacity-0">
                            Curat
                        </span>
                        <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap">
                            Curhat Rungkad
                        </span>
                    </h1>
                    <p className="max-w-md text-lg text-neutral-400 leading-relaxed mt-4">
                        A simple place to write down your thoughts and keep them safe.
                    </p>
                </div>

                <div className="flex gap-4 mt-2">
                    <Link href="/login">
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-emerald-800/60 text-emerald-400 bg-transparent hover:bg-emerald-900/30 hover:text-emerald-300 hover:border-emerald-700/60 cursor-pointer"
                        >
                            Login
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button
                            size="lg"
                            className="bg-emerald-700 hover:bg-emerald-600 text-white cursor-pointer"
                        >
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </div>
        </AuthBackground>
    );
}
