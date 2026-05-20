import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Page not found</h1>
      <p className="mt-3 text-gray-500 dark:text-gray-400">This tool page does not exist or has moved.</p>
      <Link
        href="/en"
        className="mt-6 inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Back to tools
      </Link>
    </div>
  )
}
