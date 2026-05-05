import React, { useEffect, useState } from "react";

function App() {
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [random, setRandom] = useState(null);

  useEffect(() => {
    fetchJokes();
  }, []);

  const fetchJokes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        "https://api.freeapi.app/api/v1/public/randomjokes",
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const items = json?.data?.data ?? [];
      setJokes(items);
      setRandom(
        items.length ? items[Math.floor(Math.random() * items.length)] : null,
      );
    } catch (error) {
      setError(error.message || "Error aa gya oye!!!");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to Clipboard!");
    } catch {
      alert("Copy failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-semibold text-gray-800">Daily Jokes</h1>

          <button
            onClick={fetchJokes}
            disabled={loading}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Featured Joke */}
        {random && !loading && (
          <div className="mb-12 p-8 bg-white rounded-2xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-3">Featured</p>

            <p className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed mb-6">
              {random.content}
            </p>

            <button
              onClick={() => handleCopy(random.content)}
              className="text-sm text-gray-600 hover:text-black transition"
            >
              Copy
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-gray-500">
            Loading jokes...
          </div>
        )}

        {/* Grid */}
        {!loading && jokes.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jokes.map((joke) => (
              <div
                key={joke.id}
                className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-md transition"
              >
                <p className="text-gray-800 mb-6 leading-relaxed">
                  {joke.content}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {joke.categories?.[0] || "General"}
                  </span>

                  <button
                    onClick={() => handleCopy(joke.content)}
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;



