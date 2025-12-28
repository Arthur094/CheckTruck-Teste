'use client'
import { LogOut } from 'lucide-react'
import { signOut } from '@/app/actions/auth'

export function LogoutButton() {
    return (
        <button
            onClick={() => signOut()}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
        >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
        </button>
    )
}
