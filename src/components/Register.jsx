import React from "react";
import Header from "./Header";

function Register() {
    return (
        <>
            <Header />
            <div className="container">
                <h1>Register</h1>
                <form className="form">
                    <input type="text" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <button type="submit">Register</button>
                </form>
            </div>
        </>
    );
}

export default Register;
