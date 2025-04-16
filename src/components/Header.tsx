import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  User,
  Phone,
  LogOut,
  ShieldCheck,
  Edit,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCart } from "../api/CartApi";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
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
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);

  // Hàm kiểm tra token hết hạn
  const checkTokenExpiration = (token: string) => {
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        handleAutoLogout("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Lỗi khi giải mã token:", error);
      return true;
    }
  };

  // Hàm xử lý đăng xuất tự động
  const handleAutoLogout = (message: string) => {
    logout();
    setTokenExpired(true);
    alert(message);
    navigate("/login");
  };

  // Interceptor axios để xử lý token hết hạn
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          handleAutoLogout(
            "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
          );
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout, navigate]);

  // Kiểm tra token định kỳ
  useEffect(() => {
    if (!user) return;

    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        handleAutoLogout(
          "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại."
        );
        return;
      }

      // Kiểm tra thời gian hết hạn của token
      checkTokenExpiration(token);
    };

    // Kiểm tra ngay lần đầu
    checkToken();

    // Kiểm tra định kỳ mỗi phút
    const interval = setInterval(checkToken, 60000);

    return () => clearInterval(interval);
  }, [user, logout, navigate]);

  // Hiển thị thông báo nhắc nhở đăng nhập mỗi 10 giây
  useEffect(() => {
    if (user) return;

    const interval = setInterval(() => {
      setShowLoginPrompt(true);

      // Tự động ẩn sau 3 giây
      setTimeout(() => {
        setShowLoginPrompt(false);
      }, 3000);
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  const fetchCartItemCount = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleAutoLogout(
          "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại."
        );
        return;
      }

      // Kiểm tra token trước khi gọi API
      if (checkTokenExpiration(token)) return;

      const cartData = await getCart(token);
      const count = cartData.cart.cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setCartItemCount(count);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleAutoLogout("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchCartItemCount();
      setProfileData({
        name: user.name || "",
        phone: user.phone || "",
      });
    } else {
      setCartItemCount(0);
    }
  }, [user]);

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
      logout();
      alert("Bạn đã đăng xuất thành công!");
    }
  };

  const handleViewProducts = () => {
    navigate("/products");
  };

  const handleToggleProfile = () => {
    setShowProfile(!showProfile);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      if (!token) {
        handleAutoLogout(
          "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại."
        );
        return;
      }

      const updatedUser = await updateUserProfile(profileData, token); // Gọi API

      // Nếu update thành công, bạn có thể cập nhật lại user context (nếu có logic update user ở context)
      alert("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      alert("Cập nhật thông tin thất bại. Vui lòng thử lại sau.");
    }
  };

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-3xl font-bold text-white">
          <Link to="/">NodeX-Store</Link>
        </div>

        <nav className="hidden md:flex space-x-8 relative">
          <ul className="flex space-x-8">
            <li>
              <Link
                to="/"
                className="text-lg text-white hover:text-gray-200 font-medium transition"
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <button
                onClick={handleViewProducts}
                className="text-lg text-white hover:text-gray-200 font-medium transition"
              >
                Sản phẩm
              </button>
            </li>
          </ul>
        </nav>

        <div className="hidden md:flex items-center space-x-4 text-white text-lg">
          <Phone className="h-6 w-6 mr-2" />
          <span>Liên hệ hỗ trợ 1900 2154</span>
        </div>

        <div className="flex items-center space-x-6">
          <Link
            to="/orders"
            className="flex items-center text-lg text-white hover:text-gray-200 font-medium transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Đơn hàng
          </Link>
          <Link
            to="/cart"
            className="flex items-center text-lg text-white hover:text-gray-200 font-medium transition relative"
          >
            <ShoppingCart className="h-7 w-7 mr-2" />
            Giỏ hàng
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center space-x-4 relative">
              <button
                onClick={handleToggleProfile}
                className="text-lg text-white hover:text-gray-200 font-medium transition flex items-center"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-2">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                {user.name}
              </button>

              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center text-lg text-yellow-400 hover:text-yellow-600 font-medium transition"
                >
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center text-lg text-red-400 hover:text-red-600 transition"
                title="Đăng xuất"
              >
                <LogOut className="h-5 w-5" />
              </button>

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

                        <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Điện thoại:
                            </span>
                            <span className="text-sm font-medium">
                              {user.phone || "Chưa cập nhật"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Vai trò:
                            </span>
                            <span className="text-sm font-medium">
                              {user.isAdmin ? "Quản trị viên" : "Người dùng"}
                            </span>
                          </div>
                        </div>
                        {/* Thêm nút Đổi mật khẩu */}
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <button
                            onClick={() => navigate("/change-password")}
                            className="w-full flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Đổi mật khẩu
                          </button>
                        </div>
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center px-3 py-1 text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Cập nhật
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <Link
                to="/login"
                className="flex items-center text-lg text-white hover:text-gray-200 font-medium transition"
              >
                <User className="h-7 w-7 mr-2" />
                Đăng nhập
              </Link>

              {/* Thông báo nhắc nhở đăng nhập */}
              {showLoginPrompt && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-yellow-100 text-yellow-800 text-sm px-3 py-2 rounded-md shadow-lg animate-fade-in">
                  <div className="flex items-start">
                    <span className="flex-1">
                      Đăng nhập để trải nghiệm dễ dàng hơn!
                    </span>
                    <button
                      onClick={() => setShowLoginPrompt(false)}
                      className="ml-2 text-yellow-600 hover:text-yellow-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
