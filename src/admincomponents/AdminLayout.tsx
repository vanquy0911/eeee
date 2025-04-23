import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../admincomponents/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AdminHeader /> {/* Hiển thị header cho các trang admin */}
      <div className="container mx-auto p-4">
        {children} {/* Render các children */}
      </div>
       {/* Trong component App (hoặc layout chính) */}
      <ToastContainer
        position="top-right"
        autoClose={1000}
        toastStyle={{ marginTop: "4.5rem" }} // hoặc 5rem tuỳ chiều cao header
      />
    </>
  );
};

export default AdminLayout;
