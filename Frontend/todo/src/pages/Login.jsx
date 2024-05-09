import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  const navigate = useNavigate();

  const validateEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const handleEmailChange = (event) => {
    const inputValue = event.target.value;
    setEmail(inputValue);
    setIsValidEmail(validateEmail(inputValue));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      );
      navigate("/home");
    } catch (error) {
      if (error.response.status === 401) {
        window.alert("Invalid email or password");
      }
      console.error("Error:", error);
    }
  };

  return (
    <div className="m-12">
      <div className="main">
        <div className="content">
          <div className="left-content">
            <section className="bg-gray-900 dark:bg-gray-900 rounded-2xl mt-5 mr-7 ml-7">
              <div className="flex justify-center pt-7 pb-7 pl-16 pr-7">
                <div className=" w-full bg-gray-900 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 pt-24">
                  <div className="mt-11 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight text-gray-100 md:text-2xl">
                      Welcome Back
                    </h1>
                    <form
                      className="space-y-4 md:space-y-6"
                      onSubmit={handleSubmit}
                    >
                      <div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={email}
                          onChange={handleEmailChange}
                          className="bg-gray-800 border border-gray-700 text-gray-50 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 "
                          placeholder="Enter your email address"
                          required
                        />
                        {!isValidEmail && (
                          <p className="text-red-500 text-xs">
                            Please enter a valid email address
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="bg-gray-800 border border-gray-700 text-gray-50 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5"
                          required
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="remember"
                              aria-describedby="remember"
                              type="checkbox"
                              className="w-4 h-4 border border-gray-300 rounded bg-gray-100 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                              required=""
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="remember" className="text-gray-500">
                              Remember me
                            </label>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full text-white bg-purple-700 hover:bg-purple-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      >
                        Sign in
                      </button>
                      <div className="horizontal-line">
                        <span className="line-text text-gray-100">OR</span>
                      </div>
                      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Don't have an account yet?{" "}
                        <Link
                          to="/"
                          className="font-medium text-blue-600 hover:underline text-base"
                        >
                          Sign up
                        </Link>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
