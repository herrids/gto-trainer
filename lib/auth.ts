import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user) {
                    return null
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    selectedModel: user.selectedModel,
                    analysisLevel: user.analysisLevel,
                    language: user.language,
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Initial sign in
            if (user) {
                token.id = user.id
                token.selectedModel = user.selectedModel
                token.analysisLevel = user.analysisLevel
                token.language = user.language
            }

            // Update session
            if (trigger === "update") {
                if (session?.user) {
                    token.selectedModel = session.user.selectedModel
                    token.analysisLevel = session.user.analysisLevel
                    token.language = session.user.language
                }
            }

            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.selectedModel = token.selectedModel as string
                session.user.analysisLevel = token.analysisLevel as string
                session.user.language = token.language as string
            }
            return session
        },
    },
}
