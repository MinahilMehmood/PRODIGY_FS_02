const dotenv = require('dotenv');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
dotenv.config();

const app = express();
const port = 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://127.0.0.1:27017/EmployeeDB');

app.listen(port, () => {
    console.log("App is running on port " + port + "!");
});

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 15
    },
    salary: {
        type: Number,
        required: true,
        min: 1
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const Employee = new mongoose.model("Employee", employeeSchema);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Employee.findById(id)
        .then(function (user) {
            done(null, user)
        })
        .catch(function (err) {
            done(err, null)
        })
});

app.post("/add", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newEmployee = new Employee({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            position: req.body.position,
            age: req.body.age,
            salary: req.body.salary,
        });

        await newEmployee.save();
        res.status(201).send(newEmployee);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Error creating employee" });
    }
});


app.get("/get", (req, res) => {
    Employee.find().then((foundUser) => {
        res.send(foundUser);
    }).catch((err) => {
        res.send(err);
    })
});

const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(401).json({ error: "Access denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Store user info from token
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid token" });
    }
};


app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Employee.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }  // Token valid for 1 hour
        );

        res.json({ token, isAdmin: user.isAdmin });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) { console.log(err); } else {
            res.send("Logged Out!");
        }
    });
});

app.get("/", verifyToken, (req, res) => {
    Employee.find().then((foundUsers) => {
        res.json(foundUsers);
    }).catch((err) => {
        res.status(500).json(err);
    });
});


app.delete("/delete", (req, res) => {
    Employee.deleteOne({ _id: req.body.id }).then(() => {
        res.send("Employee has been deleted!");
    }).catch((err) => {
        res.send(err);
    })
});

app.patch("/update", (req, res) => {
    const updateData = { ...req.body };

    if (req.body.password === '*******' || !req.body.password) {
        delete updateData.password;
    }

    Employee.findByIdAndUpdate(req.body.empId, {
        $set: updateData
    }, { new: true, runValidators: true })
        .then(updatedEmployee => {
            res.send(updatedEmployee);
        })
        .catch(err => {
            console.log(err);
            res.status(400).send(err);
        });
});

