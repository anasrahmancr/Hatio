import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import axios from "axios";
import NewTodoModal from "../components/NewTodoModal";
import EditTodoModal from "../components/EditTodoModal";
import EditProjectModal from "../components/EditProjectModal";
import { Link, useNavigate } from "react-router-dom";

export const Project = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [showTodoEditModal, setShowTodoEditModal] = useState(false);
  const [showProjectEditModal, setShowProjectEditModal] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);
  const [todos, setTodos] = useState(null);
  const [editTodoId, setEditTodoId] = useState(null);
  const [gistUrl, setGistUrl] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const response = await axios.get(
          `http://localhost:8080/todo/${projectId}/getAllTodos`,
          {
            withCredentials: true,
          }
        );
        setTodos(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/project/getProject/${projectId}`,
          {
            withCredentials: true,
          }
        );
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchData();
  }, [showTodoModal, showTodoEditModal, showProjectEditModal]);

  const handleClick = async (e) => {
    setShowTodoModal(true);
  };

  const closeTodoModal = () => {
    setShowTodoModal(false);
  };

  const closeTodoEditModal = () => {
    setShowTodoEditModal(false);
  };

  const closeProjectEditModal = () => {
    setShowProjectEditModal(false);
  };

  const handleDeleteClick = async (todoId) => {
    try {
      await axios
        .delete(`http://localhost:8080/todo/delete/${todoId}`, {
          withCredentials: true,
        })
        .then((response) => {
          window.location.reload();
        });
    } catch (error) {
      console.log("error");
    }
  };

  const handleViewGistClick = async (gistUrl) => {
    window.open(gistUrl, "_blank");
  };

  const handleProjectEditClick = async (projectId) => {
    setEditProjectId(projectId);
    setShowProjectEditModal(true);
  };

  const handleEditClick = async (todoId) => {
    setEditTodoId(todoId);
    setShowTodoEditModal(true);
  };

  const handleExportClick = async () => {
    try {
      await axios
        .post(`http://localhost:8080/project/exportSummary/${projectId}`, {
          withCredentials: true,
        })
        .then((response) => {
          setGistUrl(response.data);
        });
    } catch (error) {
      console.log("error");
    }
  };

  const handleDownloadClick = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/project/downloadSummary/${projectId}`,
        {
          responseType: "blob", 
          withCredentials: true,
        }
      );

      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });
      
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${project.title}.md`);

      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("error");
    }
  };

  const handleCheckboxChange = async (e, todoId) => {
    try {
      const isChecked = e.target.checked;
      await axios.put(
        `http://localhost:8080/todo/update/${todoId}`, 
        { status: isChecked }, 
        { withCredentials: true }
      );
      window.location.reload();
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.todoId === todoId ? { ...todo, status: isChecked } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo status:", error);
    }
  };

  return (
    <div className="main">
      <section className="bg-gray-900 dark:bg-gray-900 rounded-2xl mt-5 mr-7 ml-7 mb-5">
        <div className="p-20">
          <div className="border border-gray-600 shadow-lg flex flex-col  outline-none focus:outline-none bg-gray-900 dark:bg-gray-900 rounded-2xl p-10">
            <div className="flex justify-center items-center p-5 border-solid border-blueGray-200 rounded-t mb-24">
              <h3 className="text-3xl font-semibold text-gray-50">
                {project !== null ? project.title : <p>No project</p>}
              </h3>
              <div className="text-xl ml-5 font-bold leading-tight text-gray-100 md:text-xl mt-1 mr-8">
                <button
                  onClick={() => handleProjectEditClick(project.projectId)}
                >
                  <AiFillEdit />
                </button>
              </div>
            </div>

            <div className="flex flex-row-reverse mb-20">
              <button
                onClick={handleClick}
                type="submit"
                className="mr-32 text-white bg-purple-700 hover:bg-purple-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-l px-10 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Add +
              </button>
            </div>
            <h1 className="mt-11 text-xl font-bold leading-tight text-gray-100 md:text-2xl m-10 pl-10">
              Todos
            </h1>
            {todos !== null ? (
              todos.length > 0 ? (
                todos.map((todo) => (
                  <div className="pb-8">
                    <div className="project-list ml-24 " key={todo.todoId}>
                      <div className="flex justify-between items-center bg-gray-800 w-2/4 border border-gray-700 text-gray-50 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block p-2.5 mb-8">
                        <input
                          type="checkbox"
                          checked={todo.status} 
                          onChange={(e) => handleCheckboxChange(e, todo.todoId)} 
                          className="mr-2 w-5 h-5"
                        />
                        <h2 className="text-xl font-bold leading-tight text-gray-100 md:text-xl mr-8">
                          {todo.description}
                        </h2>
                        <h2 className="text-xl font-bold leading-tight text-gray-100 md:text-xl mr-8">
                          {todo.createdDate}
                        </h2>
                        <div className="flex">
                          <div className="text-xl font-bold leading-tight text-gray-100 md:text-xl mt-1 mr-8">
                            <button
                              onClick={() => handleEditClick(todo.todoId)}
                            >
                              <AiFillEdit />
                            </button>
                          </div>
                          <div className="text-xl font-bold leading-tight text-gray-100 md:text-xl mt-1">
                            <button
                              onClick={() => handleDeleteClick(todo.todoId)}
                            >
                              <AiFillDelete />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="mt-11 text-lg font-bold leading-tight text-gray-200 m-10 pl-10">
                  No todos available
                </p>
              )
            ) : (
              <p>Loading...</p>
            )}
            {todos !== null ? (
              todos.length > 0 ? (
            <div className="flex justify-center mb-20">
              <button
                onClick={handleExportClick}
                type="submit"
                className="mr-32 text-white bg-purple-700 hover:bg-purple-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-l px-10 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Export as Gist
              </button>
            </div>
              ):(<p></p>)):(<p></p>)}
            {gistUrl.length > 0 ? (
              <div className="flex justify-center">
                <div className="flex justify-center mb-20">
                  <button
                    onClick={() => handleViewGistClick(gistUrl)}
                    type="submit"
                    className="mr-32 text-white bg-blue-700 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-l px-10 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Click to view
                  </button>
                </div>
                <div className="flex justify-center mb-20">
                  <button
                    onClick={handleDownloadClick}
                    type="submit"
                    className="mr-32 text-white bg-red-700 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-l px-10 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Download
                  </button>
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </section>
      {showTodoModal && (
        <NewTodoModal closeTodoModal={closeTodoModal} projectId={projectId} />
      )}
      {showTodoEditModal && (
        <EditTodoModal
          closeEditModal={closeTodoEditModal}
          todoId={editTodoId}
        />
      )}
      {showProjectEditModal && (
        <EditProjectModal
          closeEditModal={closeProjectEditModal}
          projectId={editProjectId}
        />
      )}
    </div>
  );
};
