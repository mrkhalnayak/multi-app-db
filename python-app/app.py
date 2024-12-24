from flask import Flask, request, jsonify, render_template_string
from pymongo import MongoClient

app = Flask(__name__)

# MongoDB connection
client = MongoClient("mongodb://mongoUser:mongoPassword@mongo:27017/my-database?authSource=admin")
db = client["my-database"]

# Serve the HTML form
@app.route('/')
def index():
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Task Manager</title>
    </head>
    <body>
        <h1>Add a Task</h1>
        <form action="/tasks" method="POST">
            <label for="task">Task:</label>
            <input type="text" id="task" name="task" required>
            <br><br>
            <button type="submit">Add Task</button>
        </form>

        <h2>Current Tasks</h2>
        <ul>
            {% for task in tasks %}
                <li>{{ task.task }}</li>
            {% endfor %}
        </ul>
    </body>
    </html>
    """
    tasks = list(db.tasks.find({}, {"_id": 0}))  # Retrieve tasks without `_id`
    return render_template_string(html, tasks=tasks)

# Handle form submissions
@app.route('/tasks', methods=['POST'])
def create_task():
    task_text = request.form.get('task')  # Get task from the form
    if not task_text:
        return jsonify({"error": "Task is required"}), 400
    try:
        db.tasks.insert_one({"task": task_text})
        return jsonify({"message": "Task created"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API to fetch tasks (JSON)
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = list(db.tasks.find({}, {"_id": 0}))
    return jsonify(tasks)

if __name__ == '__main__':
    app.run(debug=True, port=8000)
