import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Project } from "./pages/Project";

function App() {

  return (
      <Router>
        <div className='App h-screen'>
          <Routes>
              <Route path="/" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/project/:projectId" element={<Project />} />
          </Routes>
        </div>
      </Router>
  )
}

export default App