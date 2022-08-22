import { Routes, Route, Navigate } from "react-router-dom"
import "./App.css"

import MainHeader from "./components/MainHeader"

/* ----- Buyer Routes ----- */
import MerchantsList from "./pages/Buyer/MerchantsList"
import ProductsList from "./pages/Buyer/ProductsList"

/* ----- Merchant Routes ----- */
import Login from "./pages/Merchant/Login"
import Dashboard from "./pages/Merchant/Logged"

/* ----- Admin Routes ----- */
import AdminLogin from "./pages/Admin/Login"
import AdminDashboard from "./pages/Admin/Logged"
import AdminEditMerchant from "./pages/Admin/EditMerchant"

/* ----- Merchant Routes ----- */
import Vote from "./pages/Vote/Vote"
import MerchantInfo from "./pages/Vote/MerchantInfo"


function App() {
  return (
    <>
      <MainHeader />

      <main className="center">
        <Routes>
          {/* ----- Buyer Routes ----- */}
          <Route path="/buyer" element={<MerchantsList />} />
          <Route path={"/merchant/:id/products-list"} element={<ProductsList />} />

          {/* ----- Merchant Routes ----- */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/dashboard"} element={<Dashboard />} />

          {/* ----- Admin Routes ----- */}
          <Route path={"/console"} element={<AdminLogin />} />
          <Route path={"/admin"} element={<AdminDashboard />} />
          <Route path={"/admin/edit/merchant/:id"} element={<AdminEditMerchant />} />

          {/* ----- Vote Routes ----- */}
          <Route path={"/vote"} element={<Vote />} />
          <Route path={"/vote/merchant/:id"} element={<MerchantInfo />} />
        </Routes>
      </main>
    </>
  )
}

export default App
