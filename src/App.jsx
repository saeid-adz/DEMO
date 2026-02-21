import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import Gallery from './components/Gallery'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/gallery" element={<Gallery />} />
    </Routes>
  )
}

export default App
