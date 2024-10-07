import React, { useState } from "react";
import Modal from 'react-modal';

const UpdateForm = ({ modalIsOpen, setModalIsOpen, formData, handleInputChange, handleSubmit, text, empId }) => {
    const [UpdateError, setUpdateError] = useState("");

    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Update Employee"
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)'
                }
            }}
        >
            <h2>{text} Employee</h2>
            <form className="updateForm">
                <div className="namEm">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        style={{ outline: "none" }}
                        required
                    />
                </div>
                <div className="namEm">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="ageField">
                    <label>Age:</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        required
                        min="15"
                    />
                </div>
                <div>
                    <label>Position:</label>
                    <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="salary">
                    <label>Salary:</label>
                    <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        required
                        min="1"
                    />
                </div>
                <div>
                    <label>Pass****:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" onClick={(event) => {
                    handleSubmit(event, formData, setModalIsOpen, empId, setUpdateError)
                }}>
                    {text}
                </button>
                <button type="button" onClick={() => setModalIsOpen(false)}>
                    Cancel
                </button>
                <p>{UpdateError}</p>
            </form>
        </Modal>
    );
};

export default UpdateForm;
