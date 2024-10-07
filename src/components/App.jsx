import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Login";
import Admin from "./Admin";
import Employee from "./Employee";
import axios from "axios";

function App() {

    const [employees, setEmployees] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            axios.get("http://localhost:5000/get", { headers: { "x-access-token": localStorage.getItem("token") } }).then((foundUsers) => {
                setEmployees(foundUsers.data);
            }).catch((err) => {
                console.log(err);
            });
        }
    }, [isLoggedIn]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios
                .get("http://localhost:5000/", { headers: { "x-access-token": token } })
                .then((response) => {
                    setEmployees(response.data);
                    setIsLoggedIn(true);
                })
                .catch((err) => {
                    console.log(err);
                    setIsLoggedIn(false);
                });
        }
    }, []);


    function handleAddSubmit(e, formData, setModalOpen, empId, setUpdateError) {
        e.preventDefault();
        axios.post("http://localhost:5000/add", formData).then((response) => {
            setEmployees(prev => [...prev, response.data]);
            setModalOpen(false);
        }).catch((err) => {
            setUpdateError("Check the credentials and if the credentials are right then wait and try again later!");
        });
    }

    function handleDelete(id) {
        axios.delete("http://localhost:5000/delete", { data: { id } }).then(() => {
            setEmployees(employees.filter((employee) => employee._id !== id));
        }).catch((err) => {
            console.log(err);
        });
    }

    function handleUpdateSubmit(e, formData, setModalOpen, empId, setUpdateError) {
        e.preventDefault();
        const sendingData = { empId, ...formData };
        axios.patch("http://localhost:5000/update", sendingData).then((response) => {
            setEmployees(employees.map((employee) =>
                employee._id === response.data._id ? response.data : employee
            ));
            setModalOpen(false);
        }).catch((err) => {
            setUpdateError("Check the credentials and if the credentials are right then wait and try again later!");
        });
    }

    function handleLogin(event, data, setError) {
        event.preventDefault();
        axios.post("http://localhost:5000/login", data).then((response) => {
            const { token, isAdmin } = response.data;
            localStorage.setItem("token", token);  // Store JWT token in localStorage
            setIsAdmin(isAdmin);
            setIsLoggedIn(true);
        }).catch((err) => {
            console.log(err);
            setError("Invalid credentials. Try Again!");
        });
    }

    function handleLogout() {
        localStorage.removeItem("token");  // Remove JWT token
        setIsLoggedIn(false);
        setIsAdmin(false);
    }


    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={isLoggedIn ? <Navigate to={isAdmin ? "/admin" : "/employee"} /> : <Login handleAppLogin={handleLogin} />}
                />
                <Route
                    path="/admin"
                    element={isLoggedIn && isAdmin ? (
                        <Admin
                            handleAddSubmit={handleAddSubmit}
                            employeeData={employees}
                            handleDelete={handleDelete}
                            handleUpdateSubmit={handleUpdateSubmit}
                            handleLogout={handleLogout}
                        />
                    ) : (
                        <Navigate to={isLoggedIn ? "/employee" : "/login"} />
                    )}
                />
                <Route
                    path="/employee"
                    element={isLoggedIn ? <Employee handleLogout={handleLogout} employeeData={employees} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/"
                    element={<Navigate to="/login" />}
                />
            </Routes>
        </Router>
    );
}

export default App;
