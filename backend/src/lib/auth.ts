import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "./prisma";
import { username } from "better-auth/plugins";


const bannedWords = ["admin", "super", "root", "fuck", "shit", "bitch", "asshole", "damn", "ass", "cum", "pussy", "cock", "dick", "sex", "porn", "condom"];

export const auth = betterAuth({
    trustedOrigins: ["http://localhost:3000"],
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    emailAndPassword: {
        enabled: true
    },

    plugins: [
        username({
            minUsernameLength:3,
            maxUsernameLength:14,
            usernameValidator: (username) => {
                if (!/^[a-zA-Z0-9]+$/.test(username)) return false;
                if (bannedWords.some(word => username.toLowerCase().includes(word))) return false;
                return true;
                }
        })
    ]
});