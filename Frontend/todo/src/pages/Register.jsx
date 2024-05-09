import React, { useState } from "react";
import "./register.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/api/register", formData, {
        withCredentials: true,
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="m-12">
      <div className="main">
        <div className="content">
          <div className="left-content">
            <section className="bg-gray-900 dark:bg-gray-900 rounded-2xl mt-5 mr-7 ml-7">
              <div className="flex justify-center pt-7 pb-7 pl-16 pr-7">
                <div className="w-full bg-gray-900 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 pt-24">
                  <div className="mt-11 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight text-gray-100 md:text-2xl">
                      Create a new account
                    </h1>
                    <form
                      className="space-y-4 md:space-y-6"
                      onSubmit={handleSubmit}
                    >
                      <div>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="bg-gray-800 border border-gray-700 text-gray-50 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 "
                          placeholder="Enter your Userame"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="bg-gray-800 border border-gray-700 text-gray-50 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 "
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          className="bg-gray-800 border border-gray-700 text-gray-50 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full text-white bg-purple-700 hover:bg-purple-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      >
                        Sign up
                      </button>
                      <div className="horizontal-line">
                        <span className="line-text text-gray-100">OR</span>
                      </div>
                      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          className="font-medium text-blue-600 hover:underline text-base"
                        >
                          Login
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
