import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ProductList from "../components/FeaturedProducts";
import LoginPage from "../pages/LoginPage";
import AdminPage from "../pages/AdminPage";
import { AuthProvider } from "../context/AuthContext";
import Layout from "../components/Layout";
import CartPage from "../pages/CartPage";
import ListOrderPage from "../pages/ListOrderPage";
import PaymentResult from "../pages/PaymentPage";
import OrderPage from "../pages/OrderPage";
import Chatbot from "../components/chatbot";
import ProductDetail from "../components/ProductDetail";
import Register from "../pages/RegisterPage";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import AdminLayout from "../admincomponents/AdminLayout"; // Import AdminLayout
import AdminProductList from "../admincomponents/AdminProductList";
import AddProduct from "../admincomponents/AddProduct";
import UpdateProduct from "../admincomponents/GetDetail";
import GetDetail from "../admincomponents/GetDetail";
import ChangePassword from "../pages/ChangePassword";
import EditProduct from "../admincomponents/EditProduct";
import CategoryManager from "../admincomponents/CategoryManager";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes cho trang người dùng */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products/search" element={<ProductList />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/orders" element={<ListOrderPage />} />
                  <Route path="/payment-result" element={<PaymentResult />} />
                  <Route path="/create" element={<OrderPage />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/reset-password/:resetToken"
                    element={<ResetPassword />}
                  />
                  <Route path="/change-password" element={<ChangePassword />} />
                </Routes>
                <Chatbot />
              </Layout>
            }
          />

          {/* Routes cho trang admin */}
          <Route
            path="/admin/*"
            element={
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<AdminPage />} />
                  <Route path="/products" element={<AdminProductList />} />
                  <Route path="/add-product" element={<AddProduct />} />
                  <Route path="/product/:id" element={<GetDetail />} /> 
                  <Route path="/edit-product/:id" element={<EditProduct />} />
                  <Route path="/categories" element={ <CategoryManager/>} />
                </Routes>
                <Chatbot />
              </AdminLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
