import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Badge } from '@/components/ui/badge'
import { SearchInput } from '@/components/dashboard/search-input'
import { Eye, Calendar, User, FileText, Plus } from 'lucide-react'

// Define types for flexibility
type Submission = {
    id: string
    created_at: string
    status: string
    template: { title: string } | null
    driver: { full_name: string } | null
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const resolvedSearchParams = await searchParams
    const query = resolvedSearchParams?.q || ''
    const supabase = await createClient()

    // 1. Get User Profile for Company ID
    const { data: { user } } = await supabase.auth.getUser()

    // Default empty if auth fails (should be handled by middleware, but safe guard)
    let companyId = null
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('company_id')
            .eq('id', user.id)
            .single()
        companyId = profile?.company_id
    }

    // 2. Fetch Templates (if company linked)
    let templates: any[] = []
    if (companyId) {
        const { data: templatesData } = await supabase
            .from('checklists_templates')
            .select('*')
            .eq('company_id', companyId)
            .order('created_at', { ascending: false })
        templates = templatesData || []
    }

    // 3. Fetch Submissions
    const { data, error } = await supabase
        .from('submissions')
        .select(`
      id,
      created_at,
      status,
      template:checklists_templates ( title ),
      driver:profiles ( full_name )
    `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching submissions:', error)
        return <div className="p-6 text-red-500">Erro ao carregar dados: {error.message}</div>
    }

    // Safe cast for filter
    const submissions = (data || []) as unknown as Submission[]

    // Filter in memory for pilot robustness
    const filtered = submissions.filter((s) => {
        if (!query) return true
        const term = query.toLowerCase()
        const driverName = s.driver?.full_name?.toLowerCase() || ''
        const templateTitle = s.template?.title?.toLowerCase() || ''
        return driverName.includes(term) || templateTitle.includes(term)
    })

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">Visão geral da frota e modelos de checklist.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <div className="w-full sm:w-64">
                        <SearchInput placeholder="Buscar..." />
                    </div>
                    <Link
                        href="/dashboard/templates/new"
                        className="inline-flex items-center justify-center rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Novo Modelo
                    </Link>
                </div>
            </div>

            {/* Templates Grid Section */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" /> Modelos de Checklist
                </h2>

                {templates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((t) => (
                            <div key={t.id} className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-200 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                        {t.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                        {t.description || "Sem descrição."}
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {(t.fields as any[])?.length || 0}
                                        </span> perguntas
                                    </span>
                                    <span>Criado em {new Date(t.created_at).toLocaleDateString('pt-BR')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/50">
                        <p className="text-sm text-slate-500">Você ainda não criou nenhum modelo de checklist.</p>
                        <Link href="/dashboard/templates/new" className="mt-2 text-sm font-medium text-blue-600 hover:underline">
                            Criar o primeiro modelo agora &rarr;
                        </Link>
                    </div>
                )}
            </div>

            {/* Submissions Table Section */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        <Eye className="h-3 w-3" />
                    </div>
                    Checklists Realizados
                </h2>

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-3 font-medium flex items-center gap-2">
                                        <FileText className="h-4 w-4" /> Checklist
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        <div className="flex items-center gap-2"><User className="h-4 w-4" /> Motorista</div>
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Data Envio</div>
                                    </th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filtered.length > 0 ? (
                                    filtered.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                                {item.template?.title || <span className="text-slate-400 italic">Sem título</span>}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                {item.driver?.full_name || <span className="text-slate-400 italic">Desconhecido</span>}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                {new Date(item.created_at).toLocaleString('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge status={item.status || 'pendente'}>{item.status}</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/submissions/${item.id}`}
                                                    className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                >
                                                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                                                    Ver Detalhes
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <FileText className="h-8 w-8 text-slate-300" />
                                                <p>Nenhum checklist realizado encontrado.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
