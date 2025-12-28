import { Truck } from 'lucide-react'
import { login } from './actions'
import { LoginForm } from './login-form'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 antialiased">

            <div className="w-full max-w-sm space-y-8">
                <div className="flex flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900 text-white shadow-lg mb-4">
                        <Truck className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        CheckTruck
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Entre com suas credenciais para continuar
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <LoginForm loginAction={login} />
                </div>

                <div className="text-center text-xs text-slate-500">
                    &copy; 2025 CheckTruck Logística. Todos os direitos reservados.
                </div>
            </div>
        </div>
    )
}
