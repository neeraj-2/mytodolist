const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const path=require('path')

const PORT = process.env.PORT || 5000;

let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());

/*mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})*/
const MONGODB_URI="mongodb://Neeraj_Anand:D5zguGcJWefW4Blv@cluster0-shard-00-00.fczo0.mongodb.net:27017,cluster0-shard-00-01.fczo0.mongodb.net:27017,cluster0-shard-00-02.fczo0.mongodb.net:27017/todos2?ssl=true&replicaSet=atlas-5o8qqh-shard-0&authSource=admin&retryWrites=true&w=majority"

mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost:27017/todos', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => console.log( 'Database Connected' ))
    .catch(err => console.log(err));
    


mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!!!!');
});

todoRoutes.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

todoRoutes.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send('data is not found');
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => { 
        res.sendFile(path.resolve(__dirname,'../client','build','index.html'));


    })
}


app.use('/todos', todoRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
