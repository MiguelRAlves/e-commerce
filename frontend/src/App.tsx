import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Signup from "../src/pages/AuthPages/Signup";
import Signin from "../src/pages/AuthPages/Signin";
import Home from "../src/pages/Home/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import Header from "./components/Header/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetails from "../src/pages/ProductDetails/ProductDetails";
import MyOrders from "./pages/MyOrders/MyOrders";


function AppRoutes() {
  const location = useLocation();
  const hideHeaderRoutes = ["/signin", "/signup"];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/meus-pedidos" element={<MyOrders />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={5000} />
    </BrowserRouter>
  );
}

export default App;