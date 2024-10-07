import React, { useState } from "react";
import Header from "./Header";
import DataTable from 'react-data-table-component';

function Employee(props) {

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
            name: 'Position',
            selector: row => row.position
        }
    ];

    return (
        <>
            <Header text="Logout" handleLogout={props.handleLogout} />
            <div className="employeTable">
                <DataTable
                    columns={columns}
                    data={props.employeeData}
                    pagination
                    style={{ width: '70%', margin: '0 auto' }}
                />
            </div>
        </>
    );
}

export default Employee;
