import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker"; // Import the date picker component
import "react-datepicker/dist/react-datepicker.css"; // Import the date picker styles
import "./TaskForm.css";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const TaskForm = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [percentageDone, setPercentageDone] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [label, setLabel] = useState("");

  const isEdit = location.state?.isEdit;
  const taskId = location.state?.task_id;
  console.log(taskId);
  useEffect(() => {
    if (isEdit && taskId) {
      fetchTaskDetails(taskId);
    }
  }, [isEdit, taskId]);

  const fetchTaskDetails = async (taskId) => {
    const user = firebase.auth().currentUser;
    if (!user) {
      console.error("User not logged in");
      navigate("/");
      return;
    }
    const token = await user.getIdToken();

    try {
      const url = `${process.env.REACT_APP_BACKEND_ENDPOINT}/task/${taskId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const taskData = await response.json();
        populateFormFields(taskData);
      } else {
        console.error("Error fetching task details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const populateFormFields = (taskData) => {
    setTitle(taskData.title);
    setDescription(taskData.description);
    setPercentageDone(taskData.percentage_done);
    setDueDate(new Date(taskData.due_date));
    setLabel(taskData.label);
  };
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    // Authenticate the user and get the token
    e.preventDefault();
    const user = firebase.auth().currentUser;
    if (!user) {
      console.error("User not logged in");
      navigate("/");
      return;
    }

    const token = await user.getIdToken();
    const newTask = {
      title,
      description,
      due_date: dueDate.toISOString(),
      label: label,
      percentage_done: percentageDone,
      favourite: false,
    };
    console.log(dueDate);
    setTitle("");
    setDescription("");
    setPercentageDone(0);
    setDueDate(null);
    setLabel("");

    try {
      const url = `${process.env.REACT_APP_BACKEND_ENDPOINT}/task`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Include the token in the headers
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        console.log("Task added successfully");
        // Clear the form or update state as needed
      } else {
        console.error("Error adding task");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    navigate("/home");
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const user = firebase.auth().currentUser;
    if (!user) {
      console.error("User not logged in");
      navigate("/");
      return;
    }

    const token = await user.getIdToken();

    const updatedTask = {
      title,
      description,
      due_date: dueDate.toISOString(),
      label: label,
      percentage_done: percentageDone,
      favourite: false,
    };

    try {
      const url = `${process.env.REACT_APP_BACKEND_ENDPOINT}/task/${taskId}`;
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
        navigate("/home");
      } else {
        console.error("Error updating task");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDropdownChange = (e) => {
    const selectedOption = e.target.value;
    let newDueDate = null;

    if (selectedOption === "today") {
      newDueDate = new Date();
    } else if (selectedOption === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      newDueDate = tomorrow;
    } else if (selectedOption === "weekend") {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const daysUntilWeekend =
        dayOfWeek === 5 ? 1 : dayOfWeek === 6 ? 0 : 5 - dayOfWeek;
      const weekendDate = new Date(today);
      weekendDate.setDate(today.getDate() + daysUntilWeekend);
      newDueDate = weekendDate;
    } else if (selectedOption === "custom") {
      newDueDate = null;
    }

    setDueDate(newDueDate);
  };

  const getOptionText = () => {
    if (dueDate === null) {
      return "Pick a Deadline";
    } else if (isToday(dueDate)) {
      return "Today";
    } else if (isTomorrow(dueDate)) {
      return "Tomorrow";
    } else if (isThisWeekend(dueDate)) {
      return "This Weekend";
    } else {
      return dueDate ? formatDate(dueDate) : "Custom Date";
    }
  };
  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  const isToday = (date) => {
    const today = new Date();
    if (date === "") {
      return false;
    }
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isTomorrow = (date) => {
    if (date === "") {
      return false;
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    );
  };

  const isThisWeekend = (date) => {
    if (date === "") {
      return false;
    }
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilWeekend =
      dayOfWeek === 5 ? 1 : dayOfWeek === 6 ? 0 : 5 - dayOfWeek;
    const weekendDate = new Date(today);
    weekendDate.setDate(today.getDate() + daysUntilWeekend);
    return (
      date.getDate() === weekendDate.getDate() &&
      date.getMonth() === weekendDate.getMonth() &&
      date.getFullYear() === weekendDate.getFullYear()
    );
  };

  return (
    <div className="vertical-form-container">
      <div>
        {isEdit ? (
          <h2 className="form-title">Edit Task</h2>
        ) : (
          <h2 className="form-title">Create Task</h2>
        )}
      </div>
      <form>
        <div className="add-title">
          <label className="form-label">Title</label>
          <input
            className="form-input"
            type="text"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div className="add-description">
          <label className="form-label">Description</label>
          <textarea
            type="description"
            className="form-description"
            value={description}
            onChange={handleDescriptionChange}
            required
          />
        </div>
        <div className="form-row">
          <div className="add-due-date">
            <label className="form-label">Due Date</label>
            <select
              className="form-dropdown"
              value={dueDate}
              onChange={handleDropdownChange}
            >
              <option value="">{getOptionText()}</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="weekend">This Weekend</option>
              <option value="custom">Custom Date</option>
            </select>

            {dueDate === null ? (
              <div className="custom-datepicker-container">
                <DatePicker
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  className="form-datepicker"
                  dateFormat="dd/MM/yyyy"
                  isClearable
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={10}
                  placeholderText="Select a due date"
                />
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="add-label">
            <label className="form-label">Label</label>
            <input
              className="form-label-input"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="@"
            />
          </div>
        </div>
        <div className="add-slider">
          <label className="form-label">
            Percentage Done: {percentageDone}%
            <input
              className="form-slider"
              type="range"
              min={0}
              max={100}
              value={percentageDone}
              onChange={(e) => setPercentageDone(Number(e.target.value))}
            />
          </label>
        </div>
        <div className="add-submit">
          {isEdit ? (
            <button className="form-button" onClick={handleEdit}>
              Edit
            </button>
          ) : (
            <button className="form-button" onClick={handleSubmit}>
              Submit
            </button>
          )}
          <Link to={`/home`} style={{ textDecoration: "none" }}>
            <button className="close-button" onClick={onClose}>
              Close
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
