import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";

const images = [
  "https://res.cloudinary.com/dm6qyqnuz/image/upload/v1751558840/1_chpvon.jpg",
  "https://res.cloudinary.com/dm6qyqnuz/image/upload/v1751558857/6_kuuyq7.jpg",
  "https://res.cloudinary.com/dm6qyqnuz/image/upload/v1751558857/4_u0nqgn.jpg",
  "https://res.cloudinary.com/dm6qyqnuz/image/upload/v1751558857/2_pzo7ez.jpg",
  "https://res.cloudinary.com/dm6qyqnuz/image/upload/v1751558856/5_f2pyrz.jpg",
  "https://res.cloudinary.com/dm6qyqnuz/image/upload/v1751558856/7_qvykso.jpg",
  "https://res.cloudinary.com/dm6qyqnuz/image/upload/v1751558856/3_zojdm8.jpg",
];

const Authorization = () => {
  const [login, setLogin] = useState(true);
  return (
    <div className="min-h-screen bg-[#1a1d21] flex items-center justify-center">
      <div className="w-[90%] max-w-7xl h-[90vh] bg-white rounded-2xl flex overflow-hidden shadow-lg">
        <div className="max-md:hidden w-1/2 relative bg-black overflow-hidden border-r-4 border-zinc-700">
          {/* Scrolling container */}
          <div className="absolute inset-0">
            <div className="marquee-vertical">
              <div className="flex flex-col">
                {images.concat(images).map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`flight-${idx}`}
                    className="h-[40vh] w-full object-cover brightness-70"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        {login ? (
          <Login setLogin={setLogin} />
        ) : (
          <Register setLogin={setLogin} />
        )}
      </div>
    </div>
  );
};

export default Authorization;
