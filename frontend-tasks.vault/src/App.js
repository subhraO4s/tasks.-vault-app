
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './component/Home/Home';
import TaskForm from "../src/component/Body/TaskForm.js";
import LandingPage from "../src/component/LandingPage/LandingPage.js";

function App() {
  return (
    
    <Router>
      <Routes>
        <Route exact path='/' element={<LandingPage/>} />
        <Route path="/home/" element={<Home />} />
        <Route path="/create-task" element={<TaskForm />} />
        <Route path="/edit-task/:taskId" element={<TaskForm />} />
      </Routes>
    </Router>


  );
}

export default App;
