import React, { useContext } from 'react'
import { ToastContainer , toast } from 'react-toastify'
import { Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login'
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Admin/Dashboard.jsx';
import AllAppointments from './pages/Admin/AllAppointments.jsx';
import AddDoctor from './pages/Admin/AddDoctor.jsx';
import DoctorList from './pages/Admin/DoctorList.jsx';

const App = () => {

  const {aToken} = useContext(AdminContext);

  return aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer></ToastContainer>
      <Navbar></Navbar>
      <div className='flex items-start'>
        <Sidebar></Sidebar>
        <Routes>
          <Route path='/' element={<></>}></Route>
          <Route path='/admin-dashboard' element={<Dashboard />}></Route>
          <Route path='/all-appointments' element={<AllAppointments />}></Route>
          <Route path='/add-doctor' element={<AddDoctor />}></Route>
          <Route path='/doctor-list' element={<DoctorList />}></Route>
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login></Login>
      <ToastContainer></ToastContainer>
    </>
  )
}

export default App
