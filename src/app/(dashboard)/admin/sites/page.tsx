
import { createClient } from '@/utils/supabase/server'
import { createSite, deleteSite } from './actions'

import JobSiteForm from './JobSiteForm'

export default async function JobSitesPage() {
    const supabase = await createClient()
    const { data: sites } = await supabase.from('job_sites').select('*').order('created_at', { ascending: false })

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Manage Job Sites</h1>

            <JobSiteForm />

            {/* List */}
            <h2 className="text-xl font-bold mb-4 text-gray-900">Existing Sites</h2>
            <div className="bg-white shadow-sm overflow-hidden sm:rounded-lg border border-gray-200">
                <ul role="list" className="divide-y divide-gray-200">
                    {sites?.map((site) => (
                        <li key={site.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">{site.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-xs mr-2">Lat: {site.latitude}</span>
                                    <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-xs mr-2">Lng: {site.longitude}</span>
                                    <span className="text-indigo-600 font-medium">{site.radius_meters}m Radius</span>
                                </p>
                            </div>
                            {/* Delete button could perform a server action bound to id */}
                            <form action={async () => {
                                'use server'
                                await deleteSite(site.id)
                            }}>
                                <button className="text-red-600 hover:text-red-900 text-sm font-semibold border border-transparent hover:border-red-200 px-3 py-1 rounded">Delete</button>
                            </form>
                        </li>
                    ))}
                    {sites?.length === 0 && (
                        <li className="px-6 py-12 text-gray-500 text-center">No job sites found. Creating one above to get started.</li>
                    )}
                </ul>
            </div>
        </div>
    )
}
