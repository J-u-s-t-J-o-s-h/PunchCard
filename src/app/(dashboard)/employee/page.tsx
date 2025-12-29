
import { createClient } from '@/utils/supabase/server'
import ClockWidget from './ClockWidget'
import TeamStatus from './components/TeamStatus'
import { redirect } from 'next/navigation'

export default async function EmployeePage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch active time entry
    const { data: activeEntry, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('user_id', user.id)
        .is('clock_out', null)
        .maybeSingle()

    // Fetch Profile Name
    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Hello, {profile?.full_name || 'Crew Member'}</h1>
            <p className="text-gray-500 mb-6">Ready to work?</p>

            <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <ClockWidget
                    isClockedIn={!!activeEntry}
                    lastEntryTime={activeEntry?.clock_in}
                />
            </div>

            {/* Recent Activity */}
            <div className="mt-8 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Who is Working?</h3>
                <TeamStatus />
            </div>
        </div>
    )
}
