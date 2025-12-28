'use client'

import { useState } from 'react'
import { Truck, Lock, Mail, Loader2 } from 'lucide-react'

export function LoginForm({ loginAction }: { loginAction: (formData: FormData) => Promise<{ error?: string } | void> }) {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const result = await loginAction(formData)

        if (result && result.error) {
            setError(result.error)
            setLoading(false)
        }
        // If successful, the server action redirects.
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-md">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
                    Email
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="seu@email.com"
                        className="w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-400 trasition-colors"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
                    Senha
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-colors"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-md bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-slate-900"
            >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? 'Entrando...' : 'Acessar Sistema'}
            </button>

            <div className="text-center mt-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Não tem uma conta?{' '}
                    <a href="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                        Cadastre-se
                    </a>
                </p>
            </div>
        </form>
    )
}
