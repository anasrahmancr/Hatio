import React, { useState, useEffect } from "react";
import axios from "axios";

const EditTodoModal = ({ closeEditModal, todoId }) => {
  const [description, setDescription] = useState("");

  const handleDescriptionChange = (event) => {
    const inputValue = event.target.value;
    setDescription(inputValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios
        .put(
          `http://localhost:8080/todo/update/${todoId}`,
          {
            description: description,
          },
          { withCredentials: true }
        )
        .then((response) => {
          closeEditModal();
        });
    } catch (error) {
      console.log("error");
    }
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <form>
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            <div className="border border-gray-600 shadow-lg relative flex flex-col w-full outline-none focus:outline-none bg-gray-900 dark:bg-gray-900 rounded-2xl mt-5 mr-7 ml-7">
              <div className="flex items-start justify-between p-5 border-solid border-blueGray-200 rounded-t">
                <h3 className="text-3xl font-semibold text-gray-50">
                  Edit Todo
                </h3>
              </div>
              <div className="relative p-6 flex-auto">
                <div>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Enter the Todo "
                    className="bg-gray-800 border border-gray-700 text-gray-50 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-end p-6 border-solid border-blueGray-200 rounded-b">
                <button
                  className="w-auto text-white bg-red-800 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mr-4"
                  type="button"
                  onClick={closeEditModal}
                >
                  Close
                </button>
                <button
                  className="w-auto text-white bg-purple-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  type="button"
                  onClick={handleSubmit}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default EditTodoModal;
