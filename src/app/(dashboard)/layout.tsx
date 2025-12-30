
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const isAdmin = profile?.role === 'admin'

    const signOut = async () => {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <nav className="bg-slate-900 shadow-sm border-b border-slate-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex flex-shrink-0 items-center">
                                <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
                                    CrewClock
                                </Link>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link href="/employee" className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-slate-300 hover:border-slate-400 hover:text-white">
                                    My Dashboard
                                </Link>
                                {isAdmin && (
                                    <Link href="/admin" className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-indigo-400 hover:border-indigo-300 hover:text-indigo-300">
                                        Admin Panel
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {isAdmin && (
                                <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">Admin</span>
                            )}
                            <form action={signOut}>
                                <button className="text-sm font-semibold leading-6 text-slate-300 hover:text-white transition">
                                    Sign out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
