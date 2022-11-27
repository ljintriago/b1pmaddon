import React from 'react';
import LogInForm  from "./features/authorization/components/LogInForm";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext';
import MassivePayments from './features/masive_payment/components/MassivePayments'; 
import './assets/App.css';

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={ <LogInForm/> }></Route>
            <Route path="/massPayments" element={ <MassivePayments/> }></Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
