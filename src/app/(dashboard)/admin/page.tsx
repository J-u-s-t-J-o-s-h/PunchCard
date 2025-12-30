
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Verify Role
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') redirect('/employee')

    // Fetch Stats
    const { count: activeCount } = await supabase.from('time_entries').select('*', { count: 'exact', head: true }).is('clock_out', null)
    const { count: sitesCount } = await supabase.from('job_sites').select('*', { count: 'exact', head: true }).eq('is_active', true)

    return (
        <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link href="/admin/users" className="bg-[var(--card)] p-6 rounded-xl shadow-sm border border-[var(--border)] hover:shadow-md transition">
                    <h3 className="text-lg font-medium text-[var(--muted-foreground)]">Active Workers</h3>
                    <p className="text-3xl font-bold text-indigo-600">{activeCount || 0}</p>
                </Link>
                <Link href="/admin/sites" className="bg-[var(--card)] p-6 rounded-xl shadow-sm border border-[var(--border)] hover:shadow-md transition">
                    <h3 className="text-lg font-medium text-[var(--muted-foreground)]">Active Job Sites</h3>
                    <p className="text-3xl font-bold text-indigo-600">{sitesCount || 0}</p>
                </Link>
                <div className="bg-[var(--card)] p-6 rounded-xl shadow-sm border border-[var(--border)]">
                    <h3 className="text-lg font-medium text-[var(--muted-foreground)]">System Status</h3>
                    <p className="text-3xl font-bold text-green-600">Operational</p>
                </div>
            </div>

            <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border)] flex justify-between items-center">
                    <h2 className="text-lg font-bold text-[var(--foreground)]">Quick Actions</h2>
                </div>
                <div className="p-6 grid gap-4">
                    <Link href="/admin/sites" className="text-indigo-600 hover:underline">Manage Job Sites &rarr;</Link>
                    <Link href="#" className="text-indigo-600 hover:underline text-[var(--muted-foreground)] cursor-not-allowed">Manage Teams (Coming Soon) &rarr;</Link>
                    <Link href="#" className="text-indigo-600 hover:underline text-[var(--muted-foreground)] cursor-not-allowed">View All Logs (Coming Soon) &rarr;</Link>
                </div>
            </div>
        </div>
    )
}
