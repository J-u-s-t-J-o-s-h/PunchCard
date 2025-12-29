
import { createClient } from '@/utils/supabase/server'
import { createSite, deleteSite } from './actions'

export default async function JobSitesPage() {
    const supabase = await createClient()
    const { data: sites } = await supabase.from('job_sites').select('*').order('created_at', { ascending: false })

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Manage Job Sites</h1>

            {/* Create Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 max-w-2xl">
                <h2 className="text-lg font-semibold mb-4">Add New Site</h2>
                <form action={createSite} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Site Name</label>
                        <input name="name" type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2" placeholder="HQ" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Latitude</label>
                            <input name="latitude" type="number" step="any" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2" placeholder="40.7128" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Longitude</label>
                            <input name="longitude" type="number" step="any" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2" placeholder="-74.0060" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Radius (meters)</label>
                        <input name="radius" type="number" required defaultValue={100} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2" />
                    </div>
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Create Site</button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {sites?.map((site) => (
                        <li key={site.id} className="px-6 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-md font-medium text-gray-900">{site.name}</h3>
                                <p className="text-sm text-gray-500">Lat: {site.latitude}, Lng: {site.longitude} (r: {site.radius_meters}m)</p>
                            </div>
                            {/* Delete button could perform a server action bound to id */}
                            <form action={async () => {
                                'use server'
                                await deleteSite(site.id)
                            }}>
                                <button className="text-red-600 hover:text-red-900 text-sm">Delete</button>
                            </form>
                        </li>
                    ))}
                    {sites?.length === 0 && (
                        <li className="px-6 py-4 text-gray-500 text-center">No job sites found.</li>
                    )}
                </ul>
            </div>
        </div>
    )
}
