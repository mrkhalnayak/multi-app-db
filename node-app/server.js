const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MongoDB connection string with authentication details
const mongoURI = 'mongodb://mongoUser:mongoPassword@mongo:27017/my-database?authSource=admin';

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Define a Task model
const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
});

const Task = mongoose.model('Task', taskSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' folder

// Serve the to-do list page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// API to add a new task
app.post('/addTask', (req, res) => {
  const { task } = req.body;

  if (task) {
    // Create a new task and save it to MongoDB
    const newTask = new Task({ task });
    newTask.save()
      .then(() => {
        res.json({ success: true, message: 'Task added successfully!' });
      })
      .catch((error) => {
        res.json({ success: false, message: 'Failed to add task' });
        console.error('Error adding task:', error);
      });
  } else {
    res.json({ success: false, message: 'Task cannot be empty' });
  }
});

// API to fetch all tasks
app.get('/tasks', (req, res) => {
  Task.find()
    .then((tasks) => {
      res.json(tasks);
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
    });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
