'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const role = formData.get('role') as string || 'admin' // Default to admin as requested for first user

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    if (data.user) {
        // 1. Create a Company for the user (Auto-onboarding)
        const companyName = `${fullName} Transportes`
        const { data: company, error: companyError } = await supabase
            .from('companies')
            .insert({ name: companyName })
            .select()
            .single()

        let companyId = null
        if (!companyError && company) {
            companyId = company.id
        }

        // 2. Create profile linked to user and company
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: data.user.id,
                full_name: fullName,
                role: role,
                company_id: companyId
            })

        if (profileError) {
            console.error('Error creating profile:', profileError)
            return { error: 'Usuário criado, mas erro ao criar perfil: ' + profileError.message }
        }
    }

    redirect('/login?message=Cadastro realizado com sucesso! Faça login.')
}
