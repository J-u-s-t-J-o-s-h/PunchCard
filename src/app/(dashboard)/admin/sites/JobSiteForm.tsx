'use client'

import { useState } from 'react'
import { createSite } from './actions'

export default function JobSiteForm() {
    const [loadingLoc, setLoadingLoc] = useState(false)

    const handleGetLocation = (e: React.MouseEvent) => {
        e.preventDefault()
        setLoadingLoc(true)

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser")
            setLoadingLoc(false)
            return
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const latInput = document.querySelector('input[name="latitude"]') as HTMLInputElement
            const lngInput = document.querySelector('input[name="longitude"]') as HTMLInputElement

            if (latInput && lngInput) {
                latInput.value = position.coords.latitude.toString()
                lngInput.value = position.coords.longitude.toString()
            }
            setLoadingLoc(false)
        }, (err) => {
            console.error(err)
            alert("Unable to retrieve location. Please allow access.")
            setLoadingLoc(false)
        })
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 max-w-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Add New Site</h2>
            <form action={createSite} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-800">Site Name</label>
                    <input name="name" type="text" required className="mt-1 block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2" placeholder="HQ" />
                </div>

                <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-semibold text-gray-800">Location Coordinates</label>
                        <button
                            onClick={handleGetLocation}
                            className="text-xs flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            {loadingLoc ? 'Locating...' : '📍 Use Current Location'}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Latitude</label>
                            <input name="latitude" type="number" step="any" required className="block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2" placeholder="0.0000" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Longitude</label>
                            <input name="longitude" type="number" step="any" required className="block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2" placeholder="0.0000" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-800">Radius (meters)</label>
                    <input name="radius" type="number" required defaultValue={100} className="mt-1 block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2" />
                    <p className="text-xs text-gray-500 mt-1">Distance required to verify clock-in.</p>
                </div>
                <button type="submit" className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2.5 rounded-md hover:bg-indigo-700 font-medium shadow-sm active:transform active:scale-95 transition-all">
                    Create Job Site
                </button>
            </form>
        </div>
    )
}
