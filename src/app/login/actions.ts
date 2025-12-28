'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Usuario não encontrado.' }
    }

    // Check profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    let userRole = profile?.role

    if (!profile) {
        // Create default profile for first time user
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                role: 'motorista',
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0]
            })

        if (profileError) {
            console.error('Error creating profile:', profileError)
            // Continue anyway to avoid blocking execution, or fail? 
            // Better to fail if profile is critical.
            return { error: 'Erro ao criar perfil de usuário.' }
        }
        userRole = 'motorista'
    }

    // Role based redirect
    // Note: redirect throws an error, so do not wrap in try/catch or handle specifically
    if (userRole === 'admin') {
        redirect('/dashboard') // simplified for now, or /dashboard/listagem
    } else if (userRole === 'supervisor') {
        redirect('/dashboard')
    } else {
        redirect('/dashboard')
    }
}
