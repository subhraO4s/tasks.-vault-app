import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { BiCalendarExclamation, BiLabel } from "react-icons/bi";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import DeleteDialogbox from "./DeleteDialogbox";

const CarouselItem = ({
  task,
  onLikeClick,
  onSliderChange,
  selected,
  onSelect,
  onDeleteTask,
}) => {
  const navigate = useNavigate();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleEditClick = () => {
    navigate(`/edit-task/${task.task_id}`, {
      state: { isEdit: true, task_id: task.task_id },
    });
  };
  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = (e) => {
    onDeleteTask(task.task_id);
    setShowDeleteConfirmation(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  const handleSliderChange = async (newValue) => {
    onSliderChange(task.task_id, newValue);

    const updatedTask = {
      ...task,
      percentage_done: newValue,
    };

    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const url = `${process.env.REACT_APP_BACKEND_ENDPOINT}/task/${task.task_id}`;
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTask),
        });

        if (response.ok) {
          console.log("Task updated successfully");
        } else {
          console.error("Error updating task");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log("User not logged in");
      navigate("/");
    }
  };

  const handleLikeClick = async () => {
    // Update the like locally
    onLikeClick(task.task_id);

    // Send a PUT request to update the task on the backend
    const updatedTask = {
      ...task,
      favourite: !task.favourite,
    };

    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const url = `${process.env.REACT_APP_BACKEND_ENDPOINT}/task/${task.task_id}`;
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTask),
        });

        if (response.ok) {
          console.log("Task like status updated successfully");
        } else {
          console.error("Error updating task like status");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log("User not logged in");
      navigate("/");
    }
  };

  return (
    <div className={`card ${selected ? "selected" : ""}`}>
      <div className="card-header">
        <h2>
          <div className="multi-select">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onSelect(task.task_id)}
            ></input>
          </div>
          <div class="task-title">{task.title}</div>
          <div className="labels">
            <BiLabel size={20} />
            <span>
              {task.label == null || task.label === ""
                ? "Add-Label"
                : task.label}
            </span>
          </div>
        </h2>
        <button className="like-button" onClick={handleLikeClick}>
          {task.favourite ? (
            <FcLike size={24} />
          ) : (
            <FcLikePlaceholder size={24} />
          )}
        </button>
      </div>
      <p>{task.description}</p>
      <div className="slider-container">
        <label></label>
        <input
          type="range"
          min="0"
          max="100"
          value={task.percentage_done}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
        />
        <span>{task.percentage_done}%</span>
      </div>
      <div className="due-date-label">
        <div className="label-item">
          <BiCalendarExclamation size={20} />
          <span>{task.due_date.slice(0, 16)}</span>
        </div>
        <div className="edit-delete-item">
          <button className="edit-button" onClick={handleEditClick}>
            <AiOutlineEdit size={20} />
          </button>
          <button className="delete-button" onClick={handleDeleteClick}>
            <AiOutlineDelete size={20} />
          </button>
        </div>
      </div>
      {showDeleteConfirmation && (
        <DeleteDialogbox
          message={"Are you sure you want to delete " + task.title + "?"}
          onDeleteConfirm={handleDeleteConfirm}
          onDeleteCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
};

export default CarouselItem;
