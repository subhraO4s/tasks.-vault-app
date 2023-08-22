import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import React Router components
import CarouselItem from "./CarouselItem";
import Loader from "../Loader/Loader";
import TaskForm from "./TaskForm";
import DeleteDialogbox from "./DeleteDialogbox";
import { AiOutlineDelete } from "react-icons/ai";
import { IoAddCircleOutline } from "react-icons/io5";
import "./Body.css";
import "firebase/compat/auth";

const Body = ({ searchResults, showOnlyFav }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const storedToken = localStorage.getItem("authToken");
      setLoading(true);
      if (storedToken) {
        try {
          const url = `${process.env.REACT_APP_BACKEND_ENDPOINT}/tasks`;
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const tasksData = await response.json();
            setTasks(tasksData);
          } else {
            console.error("Error fetching tasks");
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("User not logged in");
        navigate("/");
      }
    };

    if (searchResults.length === 0) {
      fetchTasks();
    } else {
      setTasks(searchResults);
    }
  }, [searchResults]);

  console.log(showOnlyFav);
  const tasksToDisplay = showOnlyFav
    ? tasks
    : tasks.filter((task) => task.favourite);

  const [currentPage, setCurrentPage] = useState(0);
  const cardsPerPage = 6;

  const handleLikeClick = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.task_id === taskId ? { ...task, favourite: !task.favourite } : task
      )
    );
  };

  const handleSliderChange = (taskId, value) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.task_id === taskId ? { ...task, percentage_done: value } : task
      )
    );
  };

  // Calculate the index range for the currently displayed cards
  const indexOfLastCard = (currentPage + 1) * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = tasksToDisplay.slice(indexOfFirstCard, indexOfLastCard);

  // Total number of pages in the carousel
  const totalPages = Math.ceil(tasks.length / cardsPerPage);

  // Function to handle navigating to the previous page
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  // Function to handle navigating to the next page
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleTaskSelection = (taskId) => {
    setSelectedTasks((prevSelectedTasks) =>
      prevSelectedTasks.includes(taskId)
        ? prevSelectedTasks.filter((id) => id !== taskId)
        : [...prevSelectedTasks, taskId]
    );
  };
  const deleteTask = async (taskId) => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      try {
        const url = `${process.env.REACT_APP_BACKEND_ENDPOINT}/task/${taskId}`;
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.ok) {
          const deletedTask = await response.json();
          console.log("Task deleted:", deletedTask);
        } else {
          console.error("Error deleting task");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log("User not logged in");
      navigate("/");
    }
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.task_id !== taskId)
    );
  };

  const handleDeleteTasks = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = () => {
    try {
      for (const taskId of selectedTasks) {
        deleteTask(taskId);
      }

      setTasks((prevTasks) =>
        prevTasks.filter((task) => !selectedTasks.includes(task.task_id))
      );
      setSelectedTasks([]);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="body">
      <section>
        <div className="card-container">
          <div className="tasks-header">
            <h1>Tasks</h1>
            <div className="create-task-button">
              {selectedTasks.length > 0 ? (
                <button onClick={handleDeleteTasks}>
                  <AiOutlineDelete size={20} /> Delete Tasks
                </button>
              ) : (
                <Link to="/create-task">
                  <button onClick={() => setIsModalOpen(true)}>
                    <IoAddCircleOutline size={20} /> Create Task
                  </button>
                </Link>
              )}
            </div>
          </div>
          <div className="cards">
            {currentCards.map((task) => (
              <CarouselItem
                key={task.task_id}
                task={task}
                onLikeClick={handleLikeClick}
                onSliderChange={handleSliderChange}
                selected={selectedTasks.includes(task.task_id)}
                onSelect={handleTaskSelection}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
          <div className="carousel-navigation">
            <button onClick={handlePrevPage} disabled={currentPage === 0}>
              Back
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && <TaskForm onClose={() => setIsModalOpen(false)} />}
      {showDeleteConfirmation && (
        <DeleteDialogbox
          message={`Are you sure you want to delete ${
            selectedTasks.length === 1
              ? "this task?"
              : `${selectedTasks.length} tasks?`
          }`}
          onDeleteConfirm={handleDeleteConfirm}
          onDeleteCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
};

export default Body;
