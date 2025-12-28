export function Badge({ children, status }: { children: React.ReactNode; status: string }) {
    let colorClass = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'

    const s = status.toLowerCase()
    if (s === 'completo' || s === 'concluido' || s === 'completed') {
        colorClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    } else if (s === 'pendente' || s === 'pending') {
        colorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    } else if (s === 'reprovado' || s === 'failed') {
        colorClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    }

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
            {children}
        </span>
    )
}
