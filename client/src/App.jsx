import { useState } from 'react'
import { Routes, Route } from "react-router-dom"
import SpotifyAuth from './Pages/SpotifyAuth';
import Home from './Pages/Home';

function App() {

  return (
    <Routes>
      <Route path="/" element={<SpotifyAuth /> }/>
      <Route path="/home" element={<Home />} />
    </Routes>
  )
}

export default App
