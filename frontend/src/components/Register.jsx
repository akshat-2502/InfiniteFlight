import { ArrowLeft } from "lucide-react";
import React from "react";

const images = [
  "https://res.cloudinary.com/dm6qyqnuz/image/upload/v1751558840/1_chpvon.jpg",
  "https://res.cloudinary.com/dm6qyqnuz/image/upload/v1751558857/6_kuuyq7.jpg",
  "https://res.cloudinary.com/dm6qyqnuz/image/upload/v1751558857/4_u0nqgn.jpg",
  "https://res.cloudinary.com/dm6qyqnuz/image/upload/v1751558857/2_pzo7ez.jpg",
  "https://res.cloudinary.com/dm6qyqnuz/image/upload/v1751558856/5_f2pyrz.jpg",
  "https://res.cloudinary.com/dm6qyqnuz/image/upload/v1751558856/7_qvykso.jpg",
  "https://res.cloudinary.com/dm6qyqnuz/image/upload/v1751558856/3_zojdm8.jpg",
];

const Register = () => {
  return (
    <div className="min-h-screen bg-[#1a1d21] flex items-center justify-center">
      <div className="w-[90%] max-w-6xl h-[90vh] bg-white rounded-2xl flex overflow-hidden shadow-lg">
        <div className="w-1/2 relative bg-black overflow-hidden border-r-4 border-zinc-700">
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
        <div className="w-1/2 flex flex-col justify-center p-10">
          <button className=" text-white cursor-pointer font-bold  rounded-xl py-2 px-3 bg-blue-600 flex justify-center items-center">
            <ArrowLeft /> HOME
          </button>
          <h2 className="text-3xl font-extrabold mb-2 mt-6">
            Create an Account
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            Join our sky crew — plan, share, and fly together!
          </p>
          <form className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              className="w-full p-3 border border-gray-300 rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full p-3 border border-gray-300 rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full p-3 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              required
              className="w-full p-3 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="profileImage"
              placeholder="Profile Image URL"
              required
              className="w-full p-3 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
            >
              Register
            </button>
            <p>
              Already have an account ?{" "}
              <span className="text-blue-500 cursor-pointer font-semibold">
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
