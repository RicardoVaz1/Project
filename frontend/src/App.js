import { Routes, Route } from "react-router-dom";
import "./App.css";

// Pages
import MainHeader from "./components/MainHeader";
import Home from "./pages/Home";

/* ----- Admin Routes ----- */
import AdminLogin from "./pages/Admin/Login";
import AdminLogged from "./pages/Admin/Logged";
import AdminMerchantsList from "./pages/Admin/MerchantsList";
import AdminEditMerchant from "./pages/Admin/EditMerchant";

/* ----- Merchant Routes ----- */
import Signup from "./pages/Merchant/Signup";
import Login from "./pages/Merchant/Login";
import Logged from "./pages/Merchant/Logged";


/* ----- Merchant Routes ----- */
import Vote from "./pages/Vote/Vote";
import MerchantInfo from "./pages/Vote/MerchantInfo";

function App() {
  return (
    <div>
      <MainHeader />
      <main className="center">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* ----- Admin Routes ----- */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin-logged" element={<AdminLogged />} />
          <Route path="/merchants-list" element={<AdminMerchantsList />} />
          <Route path="/admin-logged/edit/merchant/:id" element={<AdminEditMerchant />} />


          {/* ----- Merchant Routes ----- */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logged" element={<Logged />} />


          {/* ----- Vote Routes ----- */}
          <Route path="/vote" element={<Vote />} />
          <Route path="/vote/merchant/:id" element={<MerchantInfo />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
