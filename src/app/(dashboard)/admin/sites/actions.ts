'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSite(formData: FormData) {
    const supabase = await createClient()

    // Verify Admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Need to check role again ideally, or rely on RLS (RLS enforces it)

    const name = formData.get('name') as string
    const latitude = parseFloat(formData.get('latitude') as string)
    const longitude = parseFloat(formData.get('longitude') as string)
    const radius = parseInt(formData.get('radius') as string)

    const { error } = await supabase.from('job_sites').insert({
        name,
        latitude,
        longitude,
        radius_meters: radius
    })

    if (error) {
        console.error(error)
        return { error: 'Failed to create site' }
    }

    revalidatePath('/admin/sites')
    return { success: true }
}

export async function deleteSite(siteId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('job_sites').delete().eq('id', siteId)

    if (error) return { error: 'Failed' }
    revalidatePath('/admin/sites')
    return { success: true }
}
