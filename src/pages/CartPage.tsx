import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getCart } from "../api/CartApi";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import { removeFromCart, updateCartItem } from "../api/CartApi";

const CartPage = () => {
  const [cartData, setCartData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const fetchCart = async () => {
    const token = getToken();
    if (!token) {
      setError("Vui lòng đăng nhập để xem giỏ hàng!");
      setLoading(false);
      return;
    }

    try {
      const response = await getCart(token);
      setCartData(response);

      if (!response.cart.cartItems || response.cart.cartItems.length === 0) {
        setError("Giỏ hàng trống");
      }
    } catch (error) {
      console.error(error);
      setError("Không thể lấy thông tin giỏ hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [getToken]);

  const handleRemoveItem = async (productId: string) => {
    const token = getToken();
    if (!token) return;

    try {
      // Cập nhật trạng thái giỏ hàng ngay lập tức sau khi xóa sản phẩm
      const updatedCartData = cartData.cart.cartItems.filter(
        (item: any) => item.product._id !== productId
      );
      setCartData({
        ...cartData,
        cart: {
          ...cartData.cart,
          cartItems: updatedCartData,
        },
      });

      // Gọi API xóa sản phẩm khỏi giỏ hàng
      await removeFromCart(productId, token);

      // Sau khi xóa, gọi lại API để cập nhật giỏ hàng mới
      fetchCart(); // Cập nhật lại giỏ hàng từ server để đảm bảo tính đồng bộ
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      setError("Không thể xóa sản phẩm.");
    }
  };

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    const token = getToken();
    if (!token) return;

    try {
      await updateCartItem(productId, newQuantity, token);
      fetchCart();
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
    }
  };

  const handleBuyNow = () => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    if (!cartData?.cart.cartItems || cartData.cart.cartItems.length === 0) {
      return;
    }

    const products = cartData.cart.cartItems.map((item: any) => ({
      _id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      quantity: item.quantity,
      countInStock: item.product.countInStock,
    }));

    navigate("/create", {
      state: {
        products,
        summary: {
          itemsPrice: cartData?.itemsPrice,
          shippingPrice: cartData?.shippingPrice,
          taxPrice: cartData?.taxPrice,
          totalPrice: cartData?.totalPrice,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!cartData || cartData.cart.cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-gray-600 mb-6">
          Hãy khám phá cửa hàng và thêm sản phẩm vào giỏ hàng!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Giỏ hàng của bạn
        </h1>
        <div className="flex items-center text-gray-600">
          <Link to="/" className="hover:text-blue-600">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-blue-600">Giỏ hàng</span>
        </div>
      </div>

      <div className="lg:flex gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="hidden md:grid grid-cols-12 bg-gray-100 p-4 text-gray-600 font-medium">
              <div className="col-span-5">Sản phẩm</div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-3 text-center">Số lượng</div>
              <div className="col-span-2 text-center">Thành tiền</div>
            </div>

            {cartData.cart.cartItems.map((item: any) => (
              <CartItem
                key={item.product._id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            ))}
          </div>
        </div>

        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <CartSummary
            itemsPrice={cartData.itemsPrice}
            shippingPrice={cartData.shippingPrice}
            taxPrice={cartData.taxPrice}
            totalPrice={cartData.totalPrice}
            onBuyNow={handleBuyNow}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
