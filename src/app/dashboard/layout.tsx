import { Truck } from 'lucide-react'
import { LogoutButton } from '@/components/dashboard/logout-button'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-900 text-white shadow-sm">
                            <Truck className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">CheckTruck</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <LogoutButton />
                    </div>
                </div>
            </header>
            <main className="container mx-auto p-6">
                {children}
            </main>
        </div>
    )
}
