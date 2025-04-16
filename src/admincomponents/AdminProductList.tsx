import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchProducts } from "../api/productSearchApi";
import AdminProduct from "./AdminProduct";
import SearchFilter from "../components/SearchFilter";
import { IProduct } from "../types/product";

const AdminProductList: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchFilteredProducts = async (params: { [key: string]: string }) => {
    try {
      setLoading(true);
      setError(null);
      const data: IProduct[] = await fetchProducts(params);
      setProducts(data);
    } catch (err) {
      setError("Không thể tải sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const params = {
      keyword: searchParams.get("keyword") || "",
      category: searchParams.get("category") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      rating: searchParams.get("rating") || "",
      sortBy: searchParams.get("sortBy") || "latest",
    };

    fetchFilteredProducts(params);
  }, [location.search]);

  const handleResetFilters = () => {
    navigate("/products", { replace: true });
  };

  const getInitialValues = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      keyword: searchParams.get("keyword") || "",
      category: searchParams.get("category") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      rating: searchParams.get("rating") || "",
      sortBy: searchParams.get("sortBy") || "latest",
    };
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== productId)
    );
  };

  const handleAddProduct = () => {
    navigate("/admin/add-product");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý sản phẩm</h1>
          <p className="text-gray-500 mt-1">
            Danh sách toàn bộ sản phẩm trong hệ thống
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Thêm sản phẩm
        </button>
      </div>

      {/* Search Filter Section */}
      <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Tìm kiếm & Lọc
        </h2>
        <SearchFilter initialValues={getInitialValues()} />
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500"></div>
            <span className="mt-4 text-gray-600 text-lg font-medium">
              Đang tải danh sách sản phẩm...
            </span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-6 rounded-lg mx-6 my-8">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">
                Tổng cộng{" "}
                <span className="text-blue-600">{products.length}</span> sản
                phẩm
              </h3>
              <div className="text-sm text-gray-500">
                Sắp xếp theo:{" "}
                <span className="font-medium text-gray-700">Mới nhất</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {products.map((product) => (
                <AdminProduct
                  key={product._id}
                  product={product}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-700">
              Không tìm thấy sản phẩm
            </h3>
            <p className="mt-1 text-gray-500">
              Không có sản phẩm nào phù hợp với bộ lọc hiện tại
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-300 inline-flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductList;
