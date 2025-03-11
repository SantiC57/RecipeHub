import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup/Signup.jsx";
import Login from "./Login.jsx";
import MainPage from "./MainPage.jsx";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mainp" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
