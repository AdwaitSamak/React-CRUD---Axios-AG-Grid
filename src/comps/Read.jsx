import axios  from 'axios';
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
function Read() {
    const [data,setData] = useState([]);
    const {id} = useParams();
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:3000/users?id=' + id);
            console.log(response.data);
            setData(response.data[0]);
          } catch (error) {
            console.log("Error in fetching data", error);
          }
        };
        fetchData();
      }, []);
  return (
    <div className='d-flex w-100 vh-100 justify-content-center align-items-center bg-light'>
      <div className='w-50 border bg-white shadow px-5 pt-3 pb-5 rounded'>
        <h3>Details of the User</h3>
        <div className='mb-2'>
            <strong>Name: {data.name}</strong>
        </div>
        <div className='mb-2'>
            <strong>Username: {data.username}</strong>
        </div>
        <div className='mb-2'>
            <strong>Email: {data.email}</strong>
        </div>
        <div className='mb-2'>
            <strong>Phone: {data.phone}</strong>
        </div>
      </div>
      <Link to={`/update/${data.id}`} className='btn btn-success ms-3'>Edit</Link>
      <Link to="/" className='btn btn-success ms-3'>Home</Link>
    </div>
  )
}

export default Read
