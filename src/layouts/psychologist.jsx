import React from 'react';
import { Outlet } from 'react-router-dom';
import PsychologistNavbar from '../components/psychologist/psychologistNavbar';

const PsychologistLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PsychologistNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PsychologistLayout;