import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    var navigate = useNavigate();
    const handleLogout = async (e) => {
        try {
          await axios
            .post("http://localhost:8080/api/logout", {
              withCredentials: true,
            })
            .then((response) => {
              if (response.status == 200) {
                navigate("/login");
              }
              
            });
        } catch (error) {
          console.log("error");
        }
      };
  return (
    <div>
      <div className="flex justify-end mb-20 pt-8">
          <button
            onClick={handleLogout}
            type="submit"
            className="mr-32 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Logout
          </button>
        </div>
    </div>
  )
}

export default Logout
