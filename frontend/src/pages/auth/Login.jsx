import { ArrowLeft } from "lucide-react";
import React from "react";

const Login = ({ setLogin }) => {
  return (
    <div className="w-[90%] md:w-1/2 flex relative flex-col justify-center p-10">
      <button className="absolute top-2 left-2 text-white cursor-pointer font-bold w-30 rounded-xl py-2 px-3 bg-blue-600 flex justify-center items-center">
        <ArrowLeft /> HOME
      </button>
      <h2 className="text-3xl font-extrabold mb-2 mt-6 font-sans flex justify-center text-zinc-700">
        LOGIN
      </h2>
      <p className="text-gray-600 mb-6 font-semibold text-sm flex justify-center items-center">
        Join Together || Fly Together || Fly In A Group
      </p>
      <form className="space-y-4">
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
        <p>
          Don't have an account ?{" "}
          <span
            onClick={() => setLogin(false)}
            className="text-blue-500 cursor-pointer font-semibold"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
