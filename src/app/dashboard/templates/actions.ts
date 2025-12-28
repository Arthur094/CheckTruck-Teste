'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createTemplate(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // 1. Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Usuário não autenticado.' }
    }

    // 2. Fetch User's Company ID
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single()

    if (profileError || !profile?.company_id) {
        // NOTE: Depending on how strict the system is, we might want to allow 
        // creating templates without a company, but for a B2B SaaS, company is usually required.
        // For this pilot, if company_id is null, we return error.
        return { error: 'Usuário não vinculado a uma empresa. Contate o suporte.' }
    }

    // 3. Parse fields
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const questionsJSON = formData.get('questions') as string

    // Basic validation
    if (!title) return { error: 'O título é obrigatório.' }

    let fields = []
    try {
        fields = JSON.parse(questionsJSON)
    } catch (e) {
        return { error: 'Erro ao processar as questões.' }
    }

    if (fields.length === 0) {
        return { error: 'Adicione pelo menos uma pergunta ao checklist.' }
    }

    // 4. Save to Database
    const payload = {
        title,
        description,
        company_id: profile.company_id,
        created_by: user.id,
        fields: fields
    }

    console.log('[DEBUG] Saving Template:', JSON.stringify(payload, null, 2))

    const { error } = await supabase
        .from('checklists_templates')
        .insert(payload)

    if (error) {
        console.error('Error creating template:', error)
        return { error: 'Erro ao salvar o modelo: ' + error.message }
    }

    redirect('/dashboard')
}
