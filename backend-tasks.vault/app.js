import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import cors from "cors";
import admin from "firebase-admin";
import Task from "./taskSchema.js";
import connectToDatabase from "./db.js";
import authenticate from "./authenticate.js";
import { v4 as uuidv4 } from "uuid";

// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const admin = require("firebase-admin");

// const connectToDatabase = require("./db");
// const authenticate = require("./authenticate");
// const { v4: uuidv4 } = require("uuid");

let serviceAccount = null;
try {
  const serviceAccountObj = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN
  };
  serviceAccount = serviceAccountObj;
} catch (error) {
  console.error("Error parsing FIREBASE_SERVICE_ACCOUNT:", error);
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

app.get("/", async (req, res) => {
  try {
    const tasks = {
      title: "jai bharat",
    };
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

//get all tasks
app.get("/tasks", authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ user_id: req.user.uid });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

//get a task by task-id
app.get("/task/:taskId", authenticate, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const showTask = await Task.findOne({
      user_id: req.user.uid,
      task_id: taskId,
    });
    if (!showTask) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }
    res.json(showTask);
  } catch (error) {
    res.status(500).json({ error: "An error occured" });
  }
});

//search a task
app.get("/search", authenticate, async (req, res) => {
  try {
    const { searchQuery, searchOption } = req.query;
    const query = {
      user_id: req.user.uid,
      [searchOption]: { $regex: searchQuery, $options: "i" },
    };
    const searchResults = await Task.find(query);
    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

//post request
app.post("/task", authenticate, async (req, res) => {
  try {
    const { title, description, due_date, label, percentage_done, favourite } =
      req.body;
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
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

//update a task by taskId
app.put("/task/:taskId", authenticate, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { title, description, due_date, label, percentage_done, favourite } =
      req.body;
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
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

//delete request
app.delete("/task/:taskId", authenticate, async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const deletedTask = await Task.findOneAndDelete({
      user_id: req.user.uid,
      task_id: taskId,
    });

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    res.status(200).json({ message: "Task deleted successfully", deletedTask });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
