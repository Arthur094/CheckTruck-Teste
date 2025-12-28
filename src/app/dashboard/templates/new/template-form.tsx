'use client'

import { useState } from 'react'
import { Plus, Trash2, Save, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createTemplate } from '../actions'
import { useFormStatus } from 'react-dom'

// Submit Button Component for pending state
function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-slate-900"
        >
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar Modelo
        </button>
    )
}

type Question = {
    id: string
    label: string
    type: 'text' | 'yes_no' | 'photo'
}

export function TemplateForm() {
    const [questions, setQuestions] = useState<Question[]>([
        { id: crypto.randomUUID(), label: '', type: 'text' }
    ])
    const [error, setError] = useState<string | null>(null)

    // Wrapper for server action to handle client-side validation logic if needed
    // and to capture the JSON fields
    async function actionWrapper(formData: FormData) {
        formData.append('questions', JSON.stringify(questions))
        const result = await createTemplate(null, formData)
        if (result?.error) {
            setError(result.error)
        }
    }

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { id: crypto.randomUUID(), label: '', type: 'text' }
        ])
    }

    const removeQuestion = (id: string) => {
        if (questions.length === 1) return // Prevent empty list
        setQuestions(questions.filter(q => q.id !== id))
    }

    const updateQuestion = (id: string, field: keyof Question, value: string) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, [field]: value } : q
        ))
    }

    return (
        <form action={actionWrapper} className="space-y-8">

            {/* Header / Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Link href="/dashboard" className="mb-2 inline-flex items-center text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
                        <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Novo Modelo de Checklist</h1>
                    <p className="text-slate-500 text-sm">Defina as perguntas que os motoristas irão responder.</p>
                </div>
                <div>
                    <SubmitButton />
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-900">
                    {error}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">

                {/* Left Column: meta info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="text-base font-semibold leading-7 text-slate-900 dark:text-white">Informações Básicas</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Nome do Modelo
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    required
                                    placeholder="Ex: Inspeção Diária"
                                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Descrição (Opcional)
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Questions Builder */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-semibold leading-7 text-slate-900 dark:text-white">Perguntas</h2>
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                <Plus className="mr-1 h-3.5 w-3.5" /> Adicionar
                            </button>
                        </div>

                        <div className="space-y-4">
                            {questions.map((q, index) => (
                                <div key={q.id} className="flex gap-4 items-start p-4 rounded-lg border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 group hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400 mt-2">
                                        {index + 1}
                                    </span>

                                    <div className="flex-1 space-y-3">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={q.label}
                                                onChange={(e) => updateQuestion(q.id, 'label', e.target.value)}
                                                placeholder="Digite a pergunta..."
                                                className="block w-full border-0 bg-transparent p-0 text-sm font-medium placeholder:text-slate-400 focus:ring-0 dark:text-white focus:border-blue-500 border-b border-transparent focus:border-b"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <select
                                                value={q.type}
                                                onChange={(e) => updateQuestion(q.id, 'type', e.target.value as any)}
                                                className="block w-full max-w-[150px] rounded-md border-0 py-1.5 pl-3 pr-10 text-slate-700 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-xs sm:leading-6 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
                                            >
                                                <option value="text">Texto</option>
                                                <option value="yes_no">Sim / Não</option>
                                                <option value="photo">Foto</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(q.id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        title="Remover pergunta"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </form>
    )
}
