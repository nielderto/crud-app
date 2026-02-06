"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "./LoadingScreen";

export default function Redirect({ to }: { to: string }) {
    const router = useRouter();

    useEffect(() => {
        router.push(to);
    }, [router, to]);

    return <LoadingScreen />;
}
