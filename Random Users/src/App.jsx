import React, { useState, useEffect } from 'react'

function App() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUsers = async () => {  
    try {
      setLoading(true)
      const response = await fetch("https://api.freeapi.app/api/v1/public/randomusers")
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.data.data)
        setError(null)
      } else {
        setError("Failed to fetch users")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRefresh = () => {
    fetchUsers()
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 tracking-tighter mb-2">
              Random Users
            </h1>
            <p className="text-slate-500 text-lg font-medium">
              Discover random user profiles from around the world
            </p>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold rounded-lg shadow-sm transition-all duration-200 ease-in-out hover:shadow-md disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Users
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8 max-w-3xl mx-auto flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
          </div>
        )}

        {/* Users Grid */}
        {!loading && users.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {users.map((user) => (
              <div
                key={user.login.uuid}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 group flex flex-col"
              >
                {/* User Image */}
                <div className="overflow-hidden bg-slate-100 h-48 flex items-center justify-center relative">
                  <img
                    src={user.picture.large}
                    alt={`${user.name.first} ${user.name.last}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* User Info */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Name */}
                  <h2 className="text-xl font-bold text-slate-900 mb-1 line-clamp-1">
                    {user.name.title} {user.name.first} {user.name.last}
                  </h2>

                  {/* Email */}
                  <a href={`mailto:${user.email}`} className="text-indigo-600 text-sm mb-5 break-words hover:text-indigo-800 transition-colors font-medium">
                    {user.email}
                  </a>

                  {/* Details */}
                  <div className="space-y-3 mb-6 flex-grow">
                    {/* Phone */}
                    <div className="flex items-center text-slate-600">
                      <span className="font-medium text-slate-400 w-20 shrink-0 text-xs uppercase tracking-wider">Phone</span>
                      <span className="text-sm font-medium text-slate-800">{user.phone}</span>
                    </div>

                    {/* Age */}
                    <div className="flex items-center text-slate-600">
                      <span className="font-medium text-slate-400 w-20 shrink-0 text-xs uppercase tracking-wider">Age</span>
                      <span className="text-sm font-medium text-slate-800">{user.dob.age} years</span>
                    </div>

                    {/* Gender */}
                    <div className="flex items-center text-slate-600">
                      <span className="font-medium text-slate-400 w-20 shrink-0 text-xs uppercase tracking-wider">Gender</span>
                      <span className="text-sm font-medium text-slate-800 capitalize">{user.gender}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-start text-slate-600">
                      <span className="font-medium text-slate-400 w-20 shrink-0 text-xs uppercase tracking-wider mt-0.5">Location</span>
                      <span className="text-sm font-medium text-slate-800 leading-snug">
                        {user.location.city}, {user.location.country}
                      </span>
                    </div>
                  </div>

                  {/* Nationality Badge */}
                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <span className="inline-flex items-center bg-slate-50 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                      {user.nat}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Users Message */}
        {!loading && users.length === 0 && !error && (
          <div className="text-center text-slate-500 mt-12">
            <p className="text-lg">No users found. Click the refresh button to fetch users.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App;