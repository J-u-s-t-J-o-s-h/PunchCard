
import { createClient } from '@/utils/supabase/server'

export default async function TeamStatus() {
    const supabase = await createClient()

    // Get all active entries
    const { data: entries } = await supabase
        .from('time_entries')
        .select('clock_in, profiles(full_name)')
        .is('clock_out', null)
        .order('clock_in', { ascending: false })

    if (!entries || entries.length === 0) {
        return <div className="text-gray-500 italic">No one else is clocked in.</div>
    }

    return (
        <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 divide-y divide-gray-100">
            {entries.map((entry: any, i: number) => (
                <div key={i} className="px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium text-gray-900">{entry.profiles?.full_name || 'Unknown'}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                        {new Date(entry.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            ))}
        </div>
    )
}
