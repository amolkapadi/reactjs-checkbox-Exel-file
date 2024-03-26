import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './App.css';

export default function App() {
  const [user, setUser] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const userData = async () => {
    const result = await fetch('https://jsonplaceholder.typicode.com/users');
    const res = await result.json();
    setUser(res);
  };

  useEffect(() => {
    userData();
  }, []);

  const handleCheckboxChange = (id) => {
    const updatedSelectedRows = [...selectedRows];
    if (updatedSelectedRows.includes(id)) {
      const index = updatedSelectedRows.indexOf(id);
      updatedSelectedRows.splice(index, 1);
    } else {
      updatedSelectedRows.push(id);
    }
    setSelectedRows(updatedSelectedRows);
  };

  const exportToExcel = () => {
    const filteredUserData = user.filter((userData) => selectedRows.includes(userData.id)).map(({ name, username, email, phone, website }) => ({
      Name: name,
      Username: username,
      Email: email,
      Phone: phone,
      Website: website
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredUserData);
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'user_data.xlsx');
  };

  return (
    <div className='container'>
      <div className='main'>
        <h1>All User</h1>
        <button className='btn' onClick={exportToExcel} disabled={selectedRows.length === 0}>Convert to Excel</button>
      </div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Website</th>
          </tr>
        </thead>
        <tbody>
          {user.map((result) => (
            <tr key={result.id}>
              <td><input type='checkbox' onChange={() => handleCheckboxChange(result.id)} checked={selectedRows.includes(result.id)} /></td>
              <td>{result.name}</td>
              <td>{result.username}</td>
              <td>{result.email}</td>
              <td>{result.phone}</td>
              <td>{result.website}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
