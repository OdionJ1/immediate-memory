import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/sign-up/Signup';
import Master from './pages/master/Master';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/*' element={<Master />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='' element={<Navigate to='/signup' />} />
        <Route path='*' element={<Navigate to='/signup' />} />
      </Routes>
    </div>
  );
}

export default App;
