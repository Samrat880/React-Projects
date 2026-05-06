import React, { useState, useEffect } from "react";

const API_BASE_URL = "https://api.freeapi.app/api/v1/users";

export default function App() {
  // --- State Management ---
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Toast State
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // --- Helper Functions ---
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch Current User whenever the token changes
  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  // --- API Calls ---

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: "ADMIN", // Hardcoded as per requirements
        }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        showToast("Registration successful! Please log in.", "success");
        setFormData({ username: "", email: "", password: "" });
        setAuthMode("login");
      } else {
        showToast(data.message || "Registration failed", "error");
      }
    } catch (error) {
      showToast("Network error occurred", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        const accessToken = data.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        setToken(accessToken); // This triggers the useEffect to fetch user
        showToast("Logged in successfully!", "success");
        setFormData({ username: "", email: "", password: "" });
      } else {
        showToast(data.message || "Invalid credentials", "error");
      }
    } catch (error) {
      showToast("Network error occurred", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/current-user`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.data);
      } else {
        // Token is invalid/expired
        handleLogout(false);
        showToast("Session expired. Please log in again.", "error");
      }
    } catch (error) {
      showToast("Failed to fetch user details", "error");
    }
  };

  const handleLogout = async (callApi = true) => {
    if (callApi && token) {
      setIsLoading(true);
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Logout API failed");
      } finally {
        setIsLoading(false);
      }
    }

    // Clear state & local storage
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
    if (callApi) showToast("Logged out successfully", "success");
  };

  // --- UI Components ---

 return (
   <div className="min-h-screen bg-[#0a0a0a] text-white">
     {/* NAVBAR */}
     <nav className="flex items-center justify-between px-8 md:px-16 py-8 border-b border-white/5">
       <h1 className="text-xl font-semibold tracking-tight">AuthFlow</h1>

       {token && (
         <button
           onClick={() => handleLogout(true)}
           className="text-sm text-zinc-400 hover:text-white transition"
         >
           Logout
         </button>
       )}
     </nav>

     {!token ? (
       /* AUTH SCREEN */
       <div className="max-w-7xl mx-auto px-8 md:px-16 py-20 grid lg:grid-cols-2 gap-24 items-center">
         {/* LEFT */}
         <div>
           <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs mb-8">
             Authentication Platform
           </p>

           <h1 className="text-6xl md:text-8xl font-semibold leading-[0.92] tracking-tight">
             Secure access for modern applications.
           </h1>

           <p className="text-zinc-500 text-lg leading-relaxed mt-10 max-w-xl">
             Token based authentication with seamless user management and
             beautifully minimal experiences.
           </p>
         </div>

         {/* RIGHT FORM */}
         <div className="border border-white/10 rounded-[2rem] p-10 md:p-14 bg-white/[0.02]">
           <div className="mb-12">
             <h2 className="text-4xl font-semibold tracking-tight">
               {authMode === "login" ? "Welcome back" : "Create account"}
             </h2>

             <p className="text-zinc-500 mt-4">
               {authMode === "login"
                 ? "Enter your credentials to continue."
                 : "Start your journey with a new account."}
             </p>
           </div>

           <form
             onSubmit={authMode === "login" ? handleLogin : handleRegister}
             className="space-y-5"
           >
             <input
               type="text"
               name="username"
               placeholder="Username"
               value={formData.username}
               onChange={handleInputChange}
               className="w-full bg-transparent border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-white/30 transition"
             />

             {authMode === "register" && (
               <input
                 type="email"
                 name="email"
                 placeholder="Email"
                 value={formData.email}
                 onChange={handleInputChange}
                 className="w-full bg-transparent border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-white/30 transition"
               />
             )}

             <input
               type="password"
               name="password"
               placeholder="Password"
               value={formData.password}
               onChange={handleInputChange}
               className="w-full bg-transparent border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-white/30 transition"
             />

             <button
               type="submit"
               disabled={isLoading}
               className="w-full bg-white text-black rounded-2xl py-4 font-medium hover:opacity-90 transition"
             >
               {isLoading
                 ? "Processing..."
                 : authMode === "login"
                   ? "Login"
                   : "Create Account"}
             </button>
           </form>

           <button
             onClick={() =>
               setAuthMode(authMode === "login" ? "register" : "login")
             }
             className="mt-8 text-zinc-500 hover:text-white transition text-sm"
           >
             {authMode === "login"
               ? "Need an account?"
               : "Already have an account?"}
           </button>
         </div>
       </div>
     ) : (
       /* DASHBOARD */
       <div className="max-w-7xl mx-auto px-8 md:px-16 py-20">
         <div className="flex items-end justify-between mb-20">
           <div>
             <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs mb-6">
               Dashboard
             </p>

             <h1 className="text-6xl md:text-8xl font-semibold tracking-tight leading-[0.9]">
               Hello,
               <br />
               {user?.username}
             </h1>
           </div>
         </div>

         {/* GRID */}
         <div className="grid lg:grid-cols-3 gap-8">
           {/* PROFILE */}
           <div className="lg:col-span-2 border border-white/10 rounded-[2rem] p-10 bg-white/[0.02]">
             <p className="text-zinc-500 text-sm uppercase tracking-[0.2em] mb-10">
               Profile Information
             </p>

             {!user ? (
               <div className="space-y-5 animate-pulse">
                 <div className="h-8 bg-white/5 rounded-xl w-1/2"></div>
                 <div className="h-8 bg-white/5 rounded-xl w-1/3"></div>
                 <div className="h-8 bg-white/5 rounded-xl w-1/4"></div>
               </div>
             ) : (
               <div className="space-y-10">
                 <div>
                   <p className="text-zinc-500 mb-2">Username</p>
                   <h2 className="text-4xl font-semibold">{user.username}</h2>
                 </div>

                 <div>
                   <p className="text-zinc-500 mb-2">Email</p>
                   <h2 className="text-2xl">{user.email}</h2>
                 </div>

                 <div>
                   <p className="text-zinc-500 mb-2">Role</p>

                   <div className="inline-flex border border-white/10 px-4 py-2 rounded-full text-sm">
                     {user.role}
                   </div>
                 </div>
               </div>
             )}
           </div>

           {/* SIDE PANEL */}
           <div className="border border-white/10 rounded-[2rem] p-10 bg-white/[0.02] flex flex-col justify-between">
             <div>
               <p className="text-zinc-500 text-sm uppercase tracking-[0.2em]">
                 System
               </p>

               <h2 className="text-5xl font-semibold leading-none mt-8">
                 JWT
                 <br />
                 Auth
               </h2>
             </div>

             <p className="text-zinc-500 leading-relaxed">
               Secure session management with token based authentication flow.
             </p>
           </div>
         </div>
       </div>
     )}
   </div>
 );
}
