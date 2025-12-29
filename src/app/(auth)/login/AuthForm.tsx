'use client'

import { useState } from 'react'
import { login, signup } from './actions'

export default function AuthForm({ message }: { message?: string }) {
    const [isLogin, setIsLogin] = useState(true)

    return (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6">
                {!isLogin && (
                    <div>
                        <label
                            htmlFor="fullName"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Full Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                autoComplete="name"
                                required={!isLogin}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        Email address
                    </label>
                    <div className="mt-2">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Password
                        </label>
                    </div>
                    <div className="mt-2">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        />
                    </div>
                </div>

                {message && (
                    <div className="text-red-500 text-sm text-center">
                        {message}
                    </div>
                )}

                <div>
                    <button
                        formAction={isLogin ? login : signup}
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {isLogin ? 'Sign in' : 'Sign up'}
                    </button>
                </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
                {isLogin ? 'Not a member? ' : 'Already a member? '}
                <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                    {isLogin ? 'Sign up now' : 'Sign in'}
                </button>
            </p>
        </div>
    )
}
