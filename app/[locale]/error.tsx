'use client'

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  void error
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Something went wrong</h1>
      <p className="mt-3 text-gray-500 dark:text-gray-400">The tool could not be loaded. Please try again.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Try again
      </button>
    </div>
  )
}
