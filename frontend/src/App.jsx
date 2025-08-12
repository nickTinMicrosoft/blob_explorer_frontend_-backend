import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Explorer from './pages/Explorer';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upc/:upcId/*" element={<Explorer />} />
    </Routes>
  );
}
