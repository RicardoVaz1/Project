import { Routes, Route } from "react-router-dom";
import "./App.css";

import MainHeader from "./components/MainHeader";

/* ----- Merchant Routes ----- */
import Home from "./pages/Home";
import Signup from "./pages/Merchant/Signup";
import Login from "./pages/Merchant/Login";
import Logged from "./pages/Merchant/Logged";
import PersonalInfo from "./pages/Merchant/PersonalInfo";

/* ----- Admin Routes ----- */
import AdminLogin from "./pages/Admin/Login";
import AdminLogged from "./pages/Admin/Logged";
import AdminMerchantsList from "./pages/Admin/MerchantsList";
import AdminEditMerchant from "./pages/Admin/EditMerchant";
import AdminAddMerchant from "./pages/Admin/AddMerchant";

/* ----- Merchant Routes ----- */
import Vote from "./pages/Vote/Vote";
import MerchantInfo from "./pages/Vote/MerchantInfo";

function App() {
  return (
    <div>
      <MainHeader />

      <main className="center">
        <Routes>
          {/* ----- Merchant Routes ----- */}
          <Route path="/" element={<Home />} />
          <Route path={"/signup"} element={<Signup />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/logged"} element={<Logged />} />
          <Route path={"/personal-info"} element={<PersonalInfo />} />

          {/* ----- Admin Routes ----- */}
          <Route path={"/admin"} element={<AdminLogin />} />
          <Route path={"/admin-logged"} element={<AdminLogged />} />
          <Route path={"/merchants-list"} element={<AdminMerchantsList />} />
          <Route path={"/admin-logged/edit/merchant/:id"} element={<AdminEditMerchant />} />
          <Route path={"/admin-logged/add-merchant"} element={<AdminAddMerchant />} />

          {/* ----- Vote Routes ----- */}
          <Route path={"/vote"} element={<Vote />} />
          <Route path={"/vote/merchant/:id"} element={<MerchantInfo />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
