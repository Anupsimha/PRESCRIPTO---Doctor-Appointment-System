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
import { DoctorContext } from './context/DoctorContext.jsx';
import DoctorDashboard from './pages/Doctor/DoctorDashboard.jsx';
import DoctorAppointments from './pages/Doctor/DoctorAppointments.jsx';
import DoctorProfile from './pages/Doctor/DoctorProfile.jsx';

const App = () => {

  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer></ToastContainer>
      <Navbar></Navbar>
      <div className='flex items-start'>
        <Sidebar></Sidebar>
        <Routes>
          {/* Admin Route */}
          <Route path='/' element={<></>}></Route>
          <Route path='/admin-dashboard' element={<Dashboard />}></Route>
          <Route path='/all-appointments' element={<AllAppointments />}></Route>
          <Route path='/add-doctor' element={<AddDoctor />}></Route>
          <Route path='/doctor-list' element={<DoctorList />}></Route>

          {/* Doctor Route */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard />}></Route>
          <Route path='/doctor-appointments' element={<DoctorAppointments/>}></Route>
          <Route path='/doctor-profile' element={<DoctorProfile />}></Route>
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
