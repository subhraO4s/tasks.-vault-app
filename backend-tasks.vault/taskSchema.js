import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  task_id: String,
  title: String,
  description: String,
  due_date: String,
  label: String,
  percentage_done: Number,
  favourite: Boolean,
  // Add more fields if needed
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
