'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateUserRole(userId: string, currentRole: string) {
    const supabase = await createClient()

    // Authorization check: Ensure requester is an admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized')
    }

    const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (currentUserProfile?.role !== 'admin') {
        throw new Error('Unauthorized: Only admins can change roles')
    }

    // Toggle role
    const newRole = currentRole === 'admin' ? 'employee' : 'admin'

    const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

    if (error) {
        throw new Error(`Failed to update role: ${error.message}`)
    }

    revalidatePath('/admin/users')
}
