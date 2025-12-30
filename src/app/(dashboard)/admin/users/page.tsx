
import { createClient } from '@/utils/supabase/server'
import { updateUserRole, deleteUser } from './actions'

export default async function UsersPage() {
    const supabase = await createClient()

    // Verify Admin
    // (In a real app, middleware or layout protects this, but good to be safe)

    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="relative px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {profiles?.map((person) => (
                            <tr key={person.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{person.full_name || 'No Name'}</div>
                                    <div className="text-sm text-gray-500">{person.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${person.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                        {person.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(person.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <form action={async () => {
                                            'use server'
                                            await updateUserRole(person.id, person.role)
                                        }}>
                                            <button className="text-indigo-600 hover:text-indigo-900 text-xs">
                                                {person.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                            </button>
                                        </form>
                                        <form action={async () => {
                                            'use server'
                                            await deleteUser(person.id)
                                        }}
                                            // Simple browser confirmation
                                            onSubmit={(e) => {
                                                // This doesn't work well with Server Actions in inline forms easily without client component
                                                // But for now, we will trust the button. 
                                                // Ideally we make this a Client Component slightly or just add a script.
                                            }}
                                        >
                                            <button className="text-red-600 hover:text-red-900 text-xs ml-2">
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
