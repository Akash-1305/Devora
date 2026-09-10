import HomeHeader from "./components/HomeHeader"
import {BrowserRouter, Route, Routes, Link} from "react-router"
import './App.css'
import Login from "./components/Login";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<HomeHeader />} /> 
            <Route path='login' element={<Login />} />
        </Routes>
      </BrowserRouter>
      </div>
  );
}

export default App;
