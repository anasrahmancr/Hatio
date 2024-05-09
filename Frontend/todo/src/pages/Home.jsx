import React, { useState, useEffect } from "react";
import { AiFillEye, AiFillDelete, AiFillEdit } from "react-icons/ai";
import "./home.css";
import { Link, useNavigate } from "react-router-dom";
import NewProjectModal from "../components/NewProjectModal";
import EditProjectModal from "../components/EditProjectModal";
import axios from "axios";
import { handleCookie } from "../utils/handleCookie";
import Logout from "../components/Logout";

export const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [projects, setProjects] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        handleCookie(navigate); 

        const response = await axios.get(
          "http://localhost:8080/project/getAllProjects",
          {
            withCredentials: true,
          }
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchData();
  }, [showModal, showEditModal]);

  const handleClick = async (e) => {
    setShowModal(true);
  };


  const handleEditClick = async (projectId) => {
    setEditProjectId(projectId);
    setShowEditModal(true);
  };

  const handleDeleteClick = async (projectId) => {
    try {
      await axios
        .delete(`http://localhost:8080/project/delete/${projectId}`, {
          withCredentials: true,
        })
        .then((response) => {
          window.location.reload();
        });
    } catch (error) {
      console.log("error");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  return (
    <div className="main">
      <section className="bg-gray-900 dark:bg-gray-900 rounded-2xl mt-5 mr-7 ml-7">
      <div>
        <Logout/>
      </div>
        <div className="flex justify-center pt-7 pb-7 pl-16 pr-7">
          <h1 className="mt-11 text-xl text-center font-bold leading-tight text-gray-100 md:text-2xl">
            Your Projects
          </h1>
        </div>
        <div className="flex flex-row-reverse mb-20">
          <button
            onClick={handleClick}
            type="submit"
            className="mr-32 text-white bg-purple-700 hover:bg-purple-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Create New Project
          </button>
        </div>

        <div className="pb-8">
          {projects !== null ? (
            projects.length > 0 ? (
              projects.map((project) => (
                <div className="project-list ml-24 " key={project.projectId}>
                  <div className="flex justify-between bg-gray-800 w-2/3 border border-gray-700 text-gray-50 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block p-2.5 mb-8">
                    <h2 className="text-xl font-bold leading-tight text-gray-100 md:text-xl mr-8">
                      {project.title}
                    </h2>
                    <div className="flex justify-center">
                      <div className="text-xl font-bold leading-tight text-gray-100 md:text-xl mt-1 mr-8">
                        <button
                          onClick={() => handleEditClick(project.projectId)}
                        >
                          <AiFillEdit />
                        </button>
                      </div>

                      <Link to={`/project/${project.projectId}`}>
                        <div className="text-xl font-bold leading-tight text-gray-100 md:text-xl mt-1 mr-8">
                          <AiFillEye />
                        </div>
                      </Link>
                      <div className="text-xl font-bold leading-tight text-gray-100 md:text-xl mt-1">
                        <button
                          onClick={() => handleDeleteClick(project.projectId)}
                        >
                          <AiFillDelete />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="mt-11 text-lg font-bold leading-tight text-gray-200 m-10 pl-10">
                No Projects available
              </p>
            )
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </section>
      {showModal && <NewProjectModal closeModal={closeModal} />}
      {showEditModal && (
        <EditProjectModal
          closeEditModal={closeEditModal}
          projectId={editProjectId}
        />
      )}
    </div>
  );
};
