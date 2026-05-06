import React, { useEffect, useState } from "react";

function App() {
  // Standardized naming convention for state
  const [cats, setCats] = useState([]);
  const [activeIndex, setActiveIndex] = useState(2);

  const fetchCats = async () => {
    try {
      const response = await fetch(
        "https://api.freeapi.app/api/v1/public/cats",
      );
      const data = await response.json();

      // Safely extract the array of cats
      const imgs = data?.data?.data ?? [];

      // Slice the first 5-7 cats so the carousel isn't overly crowded
      setCats(imgs.slice(0, 9));
    } catch (error) {
      console.error("Error fetching cats:", error);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden flex flex-col">
      {/* Top Navigation */}
      <nav className="flex justify-center items-center p-8 max-w-7xl mx-auto w-full">
        <div className="text-4xl font-serif font-bold tracking-tight ">
          Who is real <span className="text-gray-500 ml-2">BOSS</span>
        </div>
      </nav>

      {/* Main Heading */}
      <header className="flex flex-col items-center justify-center mt-12 mb-20 text-center px-4 z-10">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight leading-[1.1]">
          Selected and popular
          <br />
          posts on the social
          <br />
          right now
        </h1>
      </header>

      {/* 3D Coverflow Carousel */}
      <main
        className="relative w-full h-[500px] flex justify-center items-center mb-20"
        style={{ perspective: "1200px" }} // Enables 3D space for the children
      >
        {cats.map((cat, index) => {
          // Calculate how far this card is from the active center card
          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);

          // 3D Math Logic
          // Left cards rotate right (-deg), right cards rotate left (+deg)
          const rotateY = offset === 0 ? 0 : offset > 0 ? -30 : 30;
          // Push non-active cards back in Z space
          const translateZ = absOffset * -150;
          // Spread cards out horizontally
          const translateX = offset * 110;
          const scale = offset === 0 ? 1 : 0.85;
          const zIndex = 10 - absOffset;
          const opacity = absOffset > 2 ? 0 : offset === 0 ? 1 : 0.5;

          return (
            <div
              key={cat.id}
              onClick={() => setActiveIndex(index)}
              className="absolute w-[280px] h-[400px] md:w-[320px] md:h-[460px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col justify-end p-8"
              style={{
                transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                zIndex: zIndex,
                opacity: opacity,
                backgroundImage: `url(${cat.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Dark Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>

              {/* Card Content */}
              <div className="relative z-10 text-center mb-2">
                <h2 className="text-2xl font-serif text-white leading-snug drop-shadow-lg">
                  {cat.name}
                </h2>
                <p className="text-sm text-gray-300 font-sans line-clamp-3 drop-shadow-md">
                  {cat.description}
                </p>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}

export default App;