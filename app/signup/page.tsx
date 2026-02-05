"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Brain, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const passwordsMatch = password === confirmPassword && password.length > 0
    const isPasswordLongEnough = password.length >= 8

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setIsLoading(false)
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters")
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name: name || undefined }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Failed to create account")
            } else {
                router.push("/login?registered=true")
            }
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md space-y-8">
                {/* Logo & Branding */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="bg-primary p-4 rounded-2xl shadow-xl shadow-primary/20">
                            <Brain className="w-12 h-12 text-primary-foreground" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight uppercase text-slate-900 dark:text-slate-100">
                            GTO Trainer
                        </h1>
                        <p className="text-muted-foreground font-medium italic mt-1">
                            Master Your Preflop Game
                        </p>
                    </div>
                </div>

                {/* Signup Card */}
                <Card className="border-2 shadow-2xl">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">Create account</CardTitle>
                        <CardDescription>
                            Start your journey to GTO mastery
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">Name (optional)</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        className="h-11 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                <p className={`text-xs ${isPasswordLongEnough ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                                    {isPasswordLongEnough ? (
                                        <span className="flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> At least 8 characters
                                        </span>
                                    ) : (
                                        "Must be at least 8 characters"
                                    )}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    className="h-11"
                                />
                                {confirmPassword && (
                                    <p className={`text-xs ${passwordsMatch ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                                        {passwordsMatch ? (
                                            <span className="flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> Passwords match
                                            </span>
                                        ) : (
                                            "Passwords do not match"
                                        )}
                                    </p>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4">
                            <Button
                                type="submit"
                                className="w-full h-11 font-bold text-base"
                                disabled={isLoading || !passwordsMatch || !isPasswordLongEnough}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                        Creating account...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <UserPlus className="w-4 h-4" />
                                        Create account
                                    </div>
                                )}
                            </Button>

                            <p className="text-sm text-center text-muted-foreground">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="font-semibold text-primary hover:underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
