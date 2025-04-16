import React, { useState } from "react";
import {
  User,
  LogOut,
  ShieldCheck,
  Edit,
  X,
  Home,
  Package,
  List,
  Users,
  ShoppingCart,
  Key,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../api/UserApi";

const Header = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [tokenExpired, setTokenExpired] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
      logout();
      alert("Bạn đã đăng xuất thành công!");
      navigate("/login");
    }
  };

  const handleToggleProfile = () => {
    setShowProfile(!showProfile);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutoLogout = (message: string) => {
    logout();
    setTokenExpired(true);
    alert(message);
    navigate("/login");
  };

  const handleSaveProfile = async () => {
    try {
      if (!token) {
        handleAutoLogout(
          "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại."
        );
        return;
      }

      const updatedUser = await updateUserProfile(profileData, token);
      alert("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      alert("Cập nhật thông tin thất bại. Vui lòng thử lại sau.");
    }
  };

  const handleChangePassword = () => {
    navigate("/change-password");
    setShowProfile(false);
  };

  // Danh sách các mục điều hướng với icon tương ứng
  const navItems = [
    { path: "/admin", name: "Trang chủ", icon: <Home size={18} /> },
    {
      path: "/admin/products",
      name: "Quản lý sản phẩm",
      icon: <Package size={18} />,
    },
    {
      path: "/admin/categories",
      name: "Quản lý danh mục",
      icon: <List size={18} />,
    },
    {
      path: "/admin/users",
      name: "Quản lý người dùng",
      icon: <Users size={18} />,
    },
    {
      path: "/admin/orders",
      name: "Quản lý đơn hàng",
      icon: <ShoppingCart size={18} />,
    },
  ];

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-3xl font-bold text-white">
          <Link to="/admin">NodeX-Store</Link>
        </div>

        {/* Menu chính với icon */}
        <nav className="hidden md:flex space-x-2">
          <ul className="flex space-x-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center text-lg text-white hover:text-gray-200 font-medium transition px-3 py-2 rounded hover:bg-gray-700"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Tài khoản người dùng */}
        <div className="flex items-center space-x-6">
          {user ? (
            <div className="flex items-center space-x-4 relative">
              {/* Avatar & Tên */}
              <button
                onClick={handleToggleProfile}
                className="text-lg text-white hover:text-gray-200 font-medium transition flex items-center"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-2">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                {user.name}
              </button>

              {/* Nút Admin (nếu là Admin) - Giữ nguyên như cũ */}
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center text-lg text-yellow-400 hover:text-yellow-600 font-medium transition"
                >
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  Admin
                </Link>
              )}

              {/* Đăng xuất */}
              <button
                onClick={handleLogout}
                className="flex items-center text-lg text-red-400 hover:text-red-600 transition"
                title="Đăng xuất"
              >
                <LogOut className="h-5 w-5" />
              </button>

              {/* Thông tin cá nhân */}
              {showProfile && (
                <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl overflow-hidden w-72 z-50 border border-gray-200">
                  <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
                    <h3 className="font-semibold text-lg">
                      Thông tin tài khoản
                    </h3>
                    <button
                      onClick={handleToggleProfile}
                      className="text-gray-300 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-4">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={profileData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Điện thoại
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="flex justify-end space-x-2 pt-2">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                          >
                            Lưu thay đổi
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold">{user.name}</h4>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <button
                            onClick={handleChangePassword}
                            className="w-full flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition"
                          >
                            <Key className="h-4 w-4 mr-2" />
                            Đổi mật khẩu
                          </button>

                          <div className="flex justify-between pt-2">
                            <button
                              onClick={handleLogout}
                              className="flex items-center px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition"
                            >
                              <LogOut className="h-4 w-4 mr-1" />
                              Đăng xuất
                            </button>
                            <button
                              onClick={() => setIsEditing(true)}
                              className="flex items-center px-3 py-1 text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Cập nhật
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center text-lg text-white hover:text-gray-200 font-medium transition px-3 py-2 rounded hover:bg-gray-700"
            >
              <User className="h-5 w-5 mr-2" />
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
