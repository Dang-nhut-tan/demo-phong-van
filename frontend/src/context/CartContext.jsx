import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('vt_cart');
      return saved ? JSON.parse(saved) : [
        // Sẵn sàng 2 items mẫu để người dùng thực hành bắt locator trong bảng giỏ hàng ngay lập tức!
        {
          id: "cart-item-1",
          tourId: "tour-1",
          title: "Tokyo - Núi Phú Sĩ - Trải Nghiệm Mùa Hoa",
          slug: "tokyo-nui-phu-si",
          avatar: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80",
          departureDate: "25/10/2026",
          priceUnit: 26010000,
          quantity: 2,
          selected: true
        },
        {
          id: "cart-item-2",
          tourId: "tour-4",
          title: "Sapa Mùa Mây - Chinh Phục Đỉnh Fansipan",
          slug: "sapa-mua-may",
          avatar: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80",
          departureDate: "19/10/2026",
          priceUnit: 6600000,
          quantity: 1,
          selected: true
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vt_cart', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  const addToCart = (tour, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.tourId === (tour._id || tour.id));
      if (existing) {
        return prev.map(item =>
          item.tourId === (tour._id || tour.id)
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prev,
        {
          id: "cart-item-" + Date.now(),
          tourId: tour._id || tour.id,
          title: tour.name,
          slug: tour.slug,
          avatar: tour.avatar,
          departureDate: tour.departureDateFormat || "19/10/2026",
          priceUnit: tour.priceNewAdult || tour.priceAdult,
          quantity: qty,
          selected: true
        }
      ];
    });
  };

  const updateQuantity = (tourId, delta) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.tourId === tourId || item.id === tourId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (tourId) => {
    setCartItems(prev => prev.filter(item => item.tourId !== tourId && item.id !== tourId));
  };

  const toggleSelect = (tourId) => {
    setCartItems(prev =>
      prev.map(item =>
        item.tourId === tourId || item.id === tourId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const toggleSelectAll = (checked) => {
    setCartItems(prev => prev.map(item => ({ ...item, selected: checked })));
  };

  const clearCart = () => setCartItems([]);

  const totalCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);
  const totalPrice = cartItems
    .filter(it => it.selected)
    .reduce((acc, it) => acc + it.priceUnit * it.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        toggleSelect,
        toggleSelectAll,
        clearCart,
        totalCount,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
