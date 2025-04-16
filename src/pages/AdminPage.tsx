import React from "react";
import AdminProductList from "../admincomponents/AdminProductList";
// Import your admin products component
const AdminPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <AdminProductList />
      </main>
    </div>
  );
};

export default AdminPage;
