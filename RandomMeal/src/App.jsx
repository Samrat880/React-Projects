import React, { useEffect, useState } from "react";

function App() {
  const [meals, setMeals] = useState([]);
  const [activeIndex, setActiveIndex] = useState(2);

  const fetchMeals = async () => {
    try {
      const response = await fetch(
        "https://api.freeapi.app/api/v1/public/meals",
      );
      const data = await response.json();

      // Safely extract the array of meals from the nested JSON you provided
      const items = data?.data?.data ?? [];

      // Slicing first 9 meals
      setMeals(items.slice(0, 9));
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <div className="bg-[#f4f4f5] min-h-screen font-sans flex flex-col items-center justify-center p-6">
      {/* Optional Heading (Kept your text, but adapted to the light theme) */}
      <div className="text-3xl md:text-4xl font-[cursive] tracking-tight text-gray-900 mb-12 text-center">
        SAMRAT <span className="text-gray-400 ml-2"> Cafe's</span>
      </div>

      {/* Grid Container for Cards */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {meals.map((meal) => {
          return (
            <div
              key={meal.idMeal}
              className="relative w-full h-[480px] rounded-[2.5rem] overflow-hidden shadow-2xl group"
              style={{
                backgroundImage: `url(${meal.strMealThumb})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Gradient Overlay - Darkens the bottom so white text is readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/60 to-transparent"></div>

              {/* Top Badges */}
              <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
                {/* Category Badge (Left) - Using Backdrop Blur for Glassmorphism */}
                <div className="bg-white/20 backdrop-blur-md border border-white/10 text-white text-xs font-semibold px-4 py-2 rounded-full">
                  {meal.strCategory || "Top Pick"}
                </div>

                {/* Bookmark Icon Button (Right) */}
                <button className="bg-white/20 backdrop-blur-md border border-white/10 text-white p-2 rounded-full hover:bg-white/30 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      fill="currentColor"
                      className="text-white"
                    />
                  </svg>
                </button>
              </div>

              {/* Bottom Content Area */}
              <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col gap-3">
                {/* Meal Title */}
                <h2 className="text-3xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
                  {meal.strMeal}
                </h2>

                {/* Description (Truncated Instructions) */}
                <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed mb-2">
                  {meal.strInstructions}
                </p>

                {/* Add to Cart Button */}
                <button className="w-full bg-white text-black font-bold text-lg py-3.5 rounded-full shadow-lg hover:bg-gray-100 hover:scale-[1.02] active:scale-95 transition-all duration-200">
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}

export default App;
