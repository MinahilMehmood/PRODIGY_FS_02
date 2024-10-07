import React, { useState } from "react";
import UpdateForm from "./updateForm";
import axios from "axios";

function Header(props) {

    const [formData, setFormData] = useState({
        name: 'Employee Name',
        email: 'Employee Email',
        position: 'Employee Position',
        age: '00',
        salary: '000',
        password: '*******'
    });

    const [modalOpen, setModalOpen] = useState(false);

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    function handleClick() {
        setModalOpen(true);
    }

    function handleLogout(event) {
        event.preventDefault();
        props.handleLogout();
    }

    return (
        <header>
            {props.text == "Login" ?
                <p><a href="/login">{props.text}</a></p>
                :
                <p><a onClick={handleLogout} href="#">{props.text}</a></p>
            }
            {props.add && <p><a onClick={handleClick}>{props.add}</a></p>}
            <UpdateForm
                modalIsOpen={modalOpen}
                setModalIsOpen={setModalOpen}
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={props.handleAddSubmit}
                text="Add"
            />
        </header>
    );
}

export default Header;
