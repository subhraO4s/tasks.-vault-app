const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const Task = require('./taskSchema');
const connectToDatabase = require('./db');
const authenticate = require('./authenticate');
const { v4: uuidv4 } = require('uuid');

let serviceAccount = null;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (error) {
  console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', error);
}

const app = express();
const port = process.env.PORT || 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const MONGO_URI = process.env.MONGO_URI;

connectToDatabase(MONGO_URI);

app.use(cors());
app.use(bodyParser.json());

//get all tasks
app.get('/tasks', authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ user_id: req.user.uid });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

//get a task by task-id
app.get('/task/:taskId', authenticate, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const showTask = await Task.findOne({ user_id: req.user.uid, task_id: taskId });
    if (!showTask) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    res.json(showTask);
  }catch (error) {
    res.status(500).json({error: 'An error occured'});
  }
});

//search a task
app.get('/search', authenticate, async (req, res) => {
  try {
    const { searchQuery, searchOption } = req.query;
    const query = {
      user_id: req.user.uid,
      [searchOption]: { $regex: searchQuery, $options: 'i' }, 
    };
    const searchResults = await Task.find(query);
    res.json(searchResults);
    console.log(searchResults);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

//post request
app.post('/task', authenticate, async (req, res) => {
  try {
    const { title, description, due_date, label, percentage_done, favourite } = req.body;
    const parsedDueDate = new Date(due_date);
    const task_id = uuidv4();
    const newTask = new Task({
      user_id: req.user.uid,
      task_id,
      title,
      description,
      due_date: parsedDueDate,
      label,
      percentage_done,
      favourite,
    });
    console.log(newTask);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

//update a task by taskId
app.put('/task/:taskId', authenticate, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { title, description, due_date, label, percentage_done, favourite } = req.body;
    const parsedDueDate = new Date(due_date);
    
    const updatedTask = await Task.findOneAndUpdate(
      { user_id: req.user.uid, task_id: taskId },
      {
        title,
        description,
        due_date: parsedDueDate,
        label,
        percentage_done,
        favourite,
      },
      { new: true } 
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

//delete request
app.delete('/task/:taskId', authenticate, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    
    const deletedTask = await Task.findOneAndDelete({ user_id: req.user.uid, task_id: taskId });

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.status(200).json({ message: 'Task deleted successfully', deletedTask });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});