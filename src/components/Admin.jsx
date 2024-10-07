import React, { useState } from "react";
import Header from "./Header";
import DataTable from 'react-data-table-component';
import UpdateForm from './updateForm';

function Admin(props) {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [empId, setEmpId] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: '',
        age: '',
        salary: '',
        password: '*******'
    });

    const handleUpdate = (employee) => {
        setModalIsOpen(true);
        setEmpId(employee._id);
        setFormData({
            name: employee.name,
            email: employee.email,
            position: employee.position,
            age: employee.age,
            salary: employee.salary,
            password: '*******'
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Email',
            selector: row => row.email
        },
        {
            name: 'Age',
            selector: row => row.age,
            sortable: true
        },
        {
            name: 'Position',
            selector: row => row.position
        },
        {
            name: 'Salary',
            selector: row => row.salary,
            sortable: true
        },
        {
            name: 'Admin',
            selector: row => row.isAdmin ? 'Yes' : 'No'
        },
        {
            name: 'Password',
            cell: row => "*******"
        },
        {
            name: 'Actions',
            cell: row => (
                <div>
                    <button onClick={() => handleUpdate(row)} style={{ marginRight: '10px', cursor: 'pointer' }}>
                        ✏️
                    </button>
                    <button onClick={() => props.handleDelete(row._id)} style={{ color: 'red', cursor: 'pointer' }}>
                        🗑️
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true
        }
    ];

    return (
        <>
            <Header handleLogout={props.handleLogout} handleAddSubmit={props.handleAddSubmit} text="Logout" add="Add" />
            <div>
                <DataTable columns={columns} data={props.employeeData} pagination />

                <UpdateForm
                    modalIsOpen={modalIsOpen}
                    setModalIsOpen={setModalIsOpen}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={props.handleUpdateSubmit}
                    text="Update"
                    empId={empId}
                />
            </div>
        </>
    );
}

export default Admin;
