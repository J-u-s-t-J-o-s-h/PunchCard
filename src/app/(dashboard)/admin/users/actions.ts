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

import { createAdminClient } from '@/utils/supabase/admin'

export async function deleteUser(userId: string) {
    const supabase = await createClient()

    // Authorization check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (currentUserProfile?.role !== 'admin') {
        throw new Error('Unauthorized: Only admins can delete users')
    }

    const adminSupabase = createAdminClient()

    // 1. Delete dependent data (Time Entries) - Profiles are usually cascaded or we delete them, 
    // but auth.users deletion cascades to profiles if using standard setup.
    // However, time_entries references profiles. If I delete user from auth, profile deletes.
    // If profile deletes, time_entries might block it if no cascade.
    // So let's delete time_entries for this user explicitly first.

    // Note: time_entries has user_id.
    const { error: timesError } = await adminSupabase
        .from('time_entries')
        .delete()
        .eq('user_id', userId)

    if (timesError) {
        throw new Error(`Failed to cleanup time entries: ${timesError.message}`)
    }

    // 2. Delete the user from Auth (this cascades to profile usually)
    const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(userId)

    if (deleteError) {
        throw new Error(`Failed to delete user: ${deleteError.message}`)
    }

    revalidatePath('/admin/users')
}
