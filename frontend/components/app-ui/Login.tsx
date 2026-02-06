"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthBackground from "./AuthBackground";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { error: authError } = await authClient.signIn.email({
                email,
                password,
            });

            if (authError) {
                setError(authError.message || "Invalid email or password");
                setLoading(false);
                return;
            }

            router.push("/dashboard");
        } catch {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <AuthBackground>
            <div className="flex flex-col items-center justify-center">
                <Card className="w-full max-w-md bg-neutral-900/60 border-emerald-900/30 backdrop-blur-sm">
                    <CardHeader className="text-center">
                        <Link href="/" className="text-2xl font-bold text-white hover:text-emerald-400 transition-colors">
                            Curat
                        </Link>
                        <CardTitle className="text-white text-xl mt-2">Welcome back</CardTitle>
                        <CardDescription className="text-neutral-400">
                            Sign in to your account
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="flex flex-col gap-4">
                            {error && (
                                <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-900/30 rounded-md p-2">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email" className="text-neutral-300">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-emerald-700 focus-visible:ring-emerald-700/30"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="password" className="text-neutral-300">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-emerald-700 focus-visible:ring-emerald-700/30"
                                />
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white cursor-pointer disabled:opacity-50 mt-6"
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </Button>
                            <p className="text-neutral-400 text-sm text-center">
                                Don&apos;t have an account?{" "}
                                <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                                    Sign up
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AuthBackground>
    );
}
