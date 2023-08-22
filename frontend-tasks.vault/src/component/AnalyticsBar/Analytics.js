import "./Analytics.css";
import { MdOutlineAnalytics } from "react-icons/md";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [percentageDone, setPercentageDone] = useState(0);
  const [inprogressTasks, setInprogressTasks] = useState(0);
  const [waitingTasks, setWaitingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalPercentageDone, setTotalPercentageDone] = useState(0);

  const navigate = useNavigate();
  const fetchTasks = async () => {
    const storedToken = localStorage.getItem("authToken");

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

          // Update the state values with new data
          const newTotalTasks = tasksData.length;
          const newCompletedTasks = tasksData.filter(
            (task) => task.percentage_done === 100
          ).length;
          const newInprogressTasks = tasksData.filter(
            (task) => task.percentage_done > 0 && task.percentage_done < 100
          ).length;
          const newWaitingTasks = tasksData.filter(
            (task) => task.percentage_done === 0
          ).length;
          const newTotalPercentageDone = tasksData.reduce(
            (sum, task) => sum + task.percentage_done,
            0
          );
          const newPercentageDone =
            tasksData.length > 0
              ? newTotalPercentageDone / tasksData.length
              : 0;

          // Update the state with new values
          setTotalTasks(newTotalTasks);
          setCompletedTasks(newCompletedTasks);
          setInprogressTasks(newInprogressTasks);
          setWaitingTasks(newWaitingTasks);
          setTotalPercentageDone(newTotalPercentageDone);
          setPercentageDone(newPercentageDone);
        } else {
          console.error("Error fetching tasks");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log("User not logged in");
      navigate("/");
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);
  const handleReload = () => {
    fetchTasks();
  };
  return (
    <div className="analytics-bar">
      <div className="analytics-label">
        <h3>
          User<br></br>
          Analytics
        </h3>
        <div className="analytics-icon">
          <button onClick={handleReload}>
            <MdOutlineAnalytics size={24} />
          </button>
          <div className="comment-box">Reload</div>
        </div>
      </div>
      <div className="progress-slab">
        <div
          className="progress-bar"
          style={{
            background: `radial-gradient(closest-side,white 50%, #CAE9FF 93%, transparent 80% 100%), 
                        conic-gradient(rgba(118, 120, 237, 1) ${percentageDone}%, #CAE9FF 0)`,
          }}
        >
          <h2 className="progress">{percentageDone.toFixed(2)}%</h2>
        </div>
      </div>
      <div className="timeline-bar">
        <h3> Timeline </h3>
        <div className="timeline-counts">
          <div className="total">
            <h4>total</h4>
            <div className="vertical-line">{totalTasks}</div>
          </div>
          <div className="completed">
            <h4>completed</h4>
            <div className="vertical-line">{completedTasks}</div>
          </div>
          <div className="in-progress">
            <h4>in-progress</h4>
            <div className="vertical-line">{inprogressTasks}</div>
          </div>
          <div className="waiting">
            <h4>waiting</h4>
            <div className="vertical-line">{waitingTasks}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
