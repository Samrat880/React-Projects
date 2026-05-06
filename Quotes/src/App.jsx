import React, { useEffect, useState } from 'react'

function App() {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [random, setRandom] = useState(null)

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('https://api.freeapi.app/api/v1/public/quotes')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const items = json?.data?.data ?? []
      setQuotes(items)
      setRandom(items.length ? items[Math.floor(Math.random() * items.length)] : null)
    } catch (err) {
      setError(err.message || 'Failed to load quotes')
    } finally {
      setLoading(false)
    }
  }

  const filtered = quotes.filter(q => {
    const text = `${q.content} ${q.author}`.toLowerCase()
    return text.includes(query.toLowerCase())
  })

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard')
    } catch {
      alert('Copy failed')
    }
  }

  const handleSurprise = () => {
    if (!quotes.length) return
    const r = quotes[Math.floor(Math.random() * quotes.length)]
    setRandom(r)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Quotes Gallery</h1>
            <p className="mt-1 text-gray-600">Curated quotes for inspiration, reflection, and a smile.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchQuotes} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">Refresh</button>
            <button onClick={handleSurprise} className="px-4 py-2 bg-rose-500 text-white rounded-lg shadow hover:bg-rose-600">Surprise me</button>
          </div>
        </header>

        {random && (
          <div className="mb-8 p-6 rounded-2xl bg-white shadow-lg">
            <p className="text-xl md:text-2xl text-gray-800">“{random.content}”</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">— {random.author}</span>
              <div className="flex gap-2">
                <button onClick={() => handleCopy(random.content + ' — ' + random.author)} className="text-sm text-indigo-600">Copy</button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex gap-4 items-center">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search quotes or authors..." className="flex-1 px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:outline-none" />
          <div className="text-sm text-gray-500">{filtered.length} results</div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 text-red-700 rounded-lg">{error}</div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(q => (
              <article key={q.id} className="p-6 bg-white rounded-xl shadow transform transition hover:scale-105">
                <p className="text-gray-800">“{q.content}”</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600">— {q.author}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleCopy(q.content + ' — ' + q.author)} className="text-sm text-indigo-600">Copy</button>
                  </div>
                </div>
                {q.tags && q.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {q.tags.map((t, i) => <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">{t}</span>)}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App;