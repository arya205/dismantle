import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login';
import TechnicianDashboard from './teknisi/dashboard';
import Devices from './teknisi/devices';
import TechnicianTeams from './teknisi/technicianTeams';
import AdminDashboard from './admin/dashboard';
import OntData from './admin/ontData';
import Teknisi from './admin/teknisi';
import SelectTechnician from './selectTechnician';
import './App.css';



function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<SelectTechnician/>}/>
        <Route path='/login' element={<Login/>}/>

        <Route path='/dashboard' element={<TechnicianDashboard/>}/>
        <Route path='/devices' element={<Devices/>}/>
        <Route path='/teams' element={<TechnicianTeams/>}/>

        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
        <Route path='/admin/data-ont' element={<OntData/>}/>
        <Route path='/admin/tim' element={<Teknisi/>}/>

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
