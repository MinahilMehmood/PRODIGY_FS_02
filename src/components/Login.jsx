import React, { useState } from "react";
import Header from "./Header";

function Login(props) {

    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    function handleInputChange(e) {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    function handleClick(event) {
        props.handleAppLogin(event, data, setError);
    }

    return (
        <>
            <Header text="Login" />
            <div className="container">
                <h1>Login</h1>
                <form className="form">
                    <input onChange={handleInputChange} name="email" value={data.email} type="text" placeholder="Email" />
                    <input onChange={handleInputChange} name="password" value={data.password} type="password" placeholder="Password" />
                    <button onClick={handleClick} type="submit">Login</button>
                    <p className="danger">{error}</p>
                </form>
            </div>
        </>
    );
}

export default Login;
