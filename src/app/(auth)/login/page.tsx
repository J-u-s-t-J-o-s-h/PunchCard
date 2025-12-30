
import AuthForm from './AuthForm'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message: string }
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-6 py-12 lg:px-8 bg-grid-pattern">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-3xl font-extrabold leading-9 tracking-tight text-[var(--foreground)] uppercase font-mono">
                    CrewClock
                </h2>
                <p className="mt-2 text-center text-sm text-[var(--muted-foreground)]">
                    Sign in to your account
                </p>
            </div>

            <AuthForm message={searchParams.message} />
        </div>
    )
}
