import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            selectedModel: string
            analysisLevel: string
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        selectedModel: string
        analysisLevel: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        selectedModel: string
        analysisLevel: string
    }
}
