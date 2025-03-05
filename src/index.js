const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key_here';

app.use(cors());
app.use(express.json());

let users = [];

// Load users from the JSON file if it exists
const loadUsers = () => {
    if (fs.existsSync('users.json')) {
        const data = fs.readFileSync('users.json');
        users = JSON.parse(data);
    }
};

// Save users to the JSON file
const sendUsersToFile = () => {
    fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error('Error saving users:', err);
        } else {
            console.log('Users saved successfully');
        }
    });
};

// Load users when the server starts
loadUsers();

// Registration endpoint
app.post('/api/register-users', (req, res) => {
    const { username, password } = req.body;

    // Check if the user already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(400).send({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Add the new user to the users array with an empty stats object
    users.push({ username, password: hashedPassword });

    // Save users to the file
    sendUsersToFile();

    // Send a response message back to let us know that our user was added successfully
    res.status(201).send({ message: 'User registered successfully' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Look for the user within our users array
    const user = users.find(u => u.username === username);

    // Check if the user exists and if not send a 401
    if (!user) {
        return res.status(401).send({ message: 'Invalid Username' });
    }

    // Compare the password
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
        return res.status(401).send({ message: 'Invalid Password' });
    }

    // Create a token with secret key and set expire time
    const token = jwt.sign({ id: user.username }, SECRET_KEY, { expiresIn: '1h' });

    // Send a response message back to let us know that our user was added successfully
    res.status(200).send({ token, message: 'User logged in successfully' });
});

// Endpoint to get all registered users
app.get('/register-users', (req, res) => {
    res.send(users);
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});