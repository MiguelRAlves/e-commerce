import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Home from './pages/Home';
import ProtectedRoute from './routes/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} />
    </BrowserRouter>
  );
}

export default App;