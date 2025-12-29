'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getDistance } from 'geolib'

export async function clockIn(lat: number, lng: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // 1. Check if already clocked in
    const { data: lastEntry } = await supabase
        .from('time_entries')
        .select('*')
        .eq('user_id', user.id)
        .is('clock_out', null)
        .single()

    if (lastEntry) {
        return { error: 'Already clocked in' }
    }

    // 2. Find nearest job site
    const { data: sites } = await supabase.from('job_sites').select('*').eq('is_active', true)

    let matchedSiteId = null
    let isVerified = false

    if (sites && sites.length > 0) {
        // simple check: find first site that contains the point
        // or find closest.
        // We want the closest one within radius.

        let minDistance = Infinity
        let closestSite = null

        for (const site of sites) {
            const distance = getDistance(
                { latitude: lat, longitude: lng },
                { latitude: site.latitude, longitude: site.longitude }
            )

            if (distance <= site.radius_meters) {
                if (distance < minDistance) {
                    minDistance = distance
                    closestSite = site
                }
            }
        }

        if (closestSite) {
            matchedSiteId = closestSite.id
            isVerified = true
        }
    }

    // 3. Insert Time Entry
    const { error } = await supabase.from('time_entries').insert({
        user_id: user.id,
        site_id: matchedSiteId,
        clock_in: new Date().toISOString(),
        clock_in_lat: lat,
        clock_in_lng: lng,
        location_verified: isVerified
    })

    if (error) {
        console.error(error)
        return { error: 'Failed to clock in' }
    }

    revalidatePath('/employee')
    return { success: true }
}

export async function clockOut(lat: number, lng: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Get active entry
    const { data: lastEntry } = await supabase
        .from('time_entries')
        .select('*')
        .eq('user_id', user.id)
        .is('clock_out', null)
        .single()

    if (!lastEntry) {
        return { error: 'Not clocked in' }
    }

    const { error } = await supabase
        .from('time_entries')
        .update({
            clock_out: new Date().toISOString(),
            clock_out_lat: lat,
            clock_out_lng: lng
        })
        .eq('id', lastEntry.id)

    if (error) {
        return { error: 'Failed to clock out' }
    }

    revalidatePath('/employee')
    return { success: true }
}
