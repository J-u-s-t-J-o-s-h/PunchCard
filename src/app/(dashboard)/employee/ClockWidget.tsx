'use client'

import { useState } from 'react'
import { clockIn, clockOut } from './actions'

export default function ClockWidget({ isClockedIn, lastEntryTime }: { isClockedIn: boolean, lastEntryTime?: string }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleClock = async () => {
        setLoading(true)
        setError(null)

        if (!navigator.geolocation) {
            setError("Geolocation is not supported")
            setLoading(false)
            return
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords

            try {
                let res
                if (isClockedIn) {
                    res = await clockOut(latitude, longitude)
                } else {
                    res = await clockIn(latitude, longitude)
                }

                if (res?.error) {
                    setError(res.error)
                }
            } catch (e) {
                setError('An unexpected error occurred')
            } finally {
                setLoading(false)
            }
        }, (err) => {
            console.error(err)
            setError("Unable to retrieve location. Please allow GPS access.")
            setLoading(false)
        }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        })
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-8 py-10">

            {/* Status Indicator */}
            <div className="flex flex-col items-center space-y-2">
                <div className={`h-4 w-4 rounded-full ${isClockedIn ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm font-medium text-gray-500 tracking-wider uppercase">
                    {isClockedIn ? 'On Duty' : 'Off Duty'}
                </span>
                {isClockedIn && lastEntryTime && (
                    <span className="text-xs text-gray-400">Since {new Date(lastEntryTime).toLocaleTimeString()}</span>
                )}
            </div>

            {/* Main Button */}
            <button
                onClick={handleClock}
                disabled={loading}
                className={`
            relative flex items-center justify-center w-64 h-64 rounded-full shadow-xl transition-all transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-4
            ${isClockedIn
                        ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-600 text-white'
                    }
            ${loading ? 'opacity-70 cursor-not-allowed' : ''}
        `}
            >
                <div className="flex flex-col items-center">
                    {loading ? (
                        <svg className="animate-spin h-10 w-10 text-white mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {isClockedIn ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            )}
                        </svg>
                    )}
                    <span className="text-2xl font-bold uppercase tracking-widest">
                        {loading ? 'Processing...' : (isClockedIn ? 'Clock Out' : 'Clock In')}
                    </span>
                </div>
            </button>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-md max-w-sm text-center text-sm">
                    {error}
                </div>
            )}

            <div className="text-center max-w-xs text-gray-500 text-sm">
                <p>{isClockedIn ? 'Head to the admin panel if you need to adjust your time.' : 'Ensure you are within the job site radius to verify your location.'}</p>
            </div>

        </div>
    )
}
