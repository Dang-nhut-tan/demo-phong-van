import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, CheckCircle2, CreditCard, Banknote, ShieldAlert, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { submitOrder } from '../services/api';

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    toggleSelect,
    toggleSelectAll,
    clearCart,
    totalPrice
  } = useCart();

  const navigate = useNavigate();

  // Checkout form state
  const [fullName, setFullName] = useState('Đặng Nhựt Tân');
  const [phone, setPhone] = useState('0909000001');
  const [email, setEmail] = useState('khachhang@viettravel.vn');
  const [address, setAddress] = useState('123 Nguyễn Huệ, Quận 1, TP.HCM');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('banking'); // 'cash' | 'banking' | 'momo'
  const [voucherCode, setVoucherCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState('');

  // Order success modal state
  const [orderModalData, setOrderModalData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allSelected = cartItems.length > 0 && cartItems.every(i => i.selected);

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    if (voucherCode.trim().toUpperCase() === 'VIETTRAVEL500') {
      setDiscountAmount(500000);
      setVoucherMessage('Áp dụng mã giảm giá 500.000đ thành công!');
    } else if (voucherCode.trim().toUpperCase() === 'PLAYWRIGHT') {
      setDiscountAmount(1000000);
      setVoucherMessage('Tuyệt vời! Mã Playwright Automation giảm 1.000.000đ!');
    } else {
      setDiscountAmount(0);
      setVoucherMessage('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.filter(i => i.selected).length === 0) {
      alert("Vui lòng chọn ít nhất 1 tour để đặt!");
      return;
    }

    setIsSubmitting(true);
    const orderPayload = {
      userInfo: { fullName, phone, email, address },
      items: cartItems.filter(i => i.selected),
      paymentMethod,
      note,
      discount: discountAmount,
      totalAmount: Math.max(0, totalPrice - discountAmount)
    };

    const res = await submitOrder(orderPayload);
    setIsSubmitting(false);

    if (res.code === 200) {
      setOrderModalData({
        orderCode: res.orderCode || "ORD" + Date.now().toString().slice(-6),
        fullName,
        phone,
        total: Math.max(0, totalPrice - discountAmount),
        itemCount: cartItems.filter(i => i.selected).length
      });
      clearCart();
    }
  };

  const finalTotal = Math.max(0, totalPrice - discountAmount);

  return (
    <div className="_vt_cartPage_view">
      {/* Success Order Confirmation Modal */}
      {orderModalData && (
        <div className="_orderModal_overlay" role="dialog" aria-modal="true">
          <div className="_orderModal_card">
            <div className="_modalSuccess_badge">
              <CheckCircle2 size={48} className="_badgeIcon_green" />
            </div>
            <h2 className="_modalSuccess_h2">Đặt Tour Thành Công!</h2>
            <p className="_modalSuccess_lead">
              Mã đơn hàng của bạn là: <strong className="_orderCode_pill">{orderModalData.orderCode}</strong>
            </p>
            <div className="_orderSummary_box">
              <div className="_summaryRow">
                <span>Khách hàng:</span>
                <strong>{orderModalData.fullName}</strong>
              </div>
              <div className="_summaryRow">
                <span>Số điện thoại:</span>
                <strong>{orderModalData.phone}</strong>
              </div>
              <div className="_summaryRow">
                <span>Tổng thanh toán:</span>
                <strong className="_totalAmount_highlight">{orderModalData.total.toLocaleString('vi-VN')}đ</strong>
              </div>
            </div>
            <p className="_modalFooter_note">
              Chuyên viên VietTravel sẽ liên hệ với bạn trong vòng 15 phút để xác nhận lịch trình.
            </p>
            <button
              type="button"
              onClick={() => { setOrderModalData(null); navigate('/'); }}
              className="_btnDone_modal"
            >
              Về Trang Chủ
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="_cartHero_banner">
        <div className="_container_inner_wrap">
          <h1 className="_cartHero_h1">Giỏ Hàng & Đặt Tour</h1>
          <p className="_cartHero_desc">Kiểm tra lại thông tin chuyến đi và hoàn tất thủ tục giữ chỗ</p>
        </div>
      </div>

      <div className="_container_inner_wrap _cartLayout_grid">
        {cartItems.length === 0 ? (
          <div className="_cartEmpty_state_full">
            <ShoppingBag size={56} className="_emptyBag_icon" />
            <h2>Giỏ tour của bạn đang trống</h2>
            <p>Hãy khám phá các điểm đến hấp dẫn và lựa chọn hành trình yêu thích của bạn.</p>
            <Link to="/category/all" className="_btnExplore_link">
              <span>Khám phá danh sách tour</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            {/* Left Column: Data Table of Tour Items */}
            <div className="_cartTable_col">
              <div className="_tableCard_wrapper">
                <table className="_cartDataTable_element" data-component="cart-table">
                  <thead className="_tableHeader_row">
                    <tr>
                      <th className="_col_select">
                        <label className="_tableCheckbox_label">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={(e) => toggleSelectAll(e.target.checked)}
                            className="_hiddenCheck_input"
                          />
                          <span className="_customCheck_box"></span>
                        </label>
                      </th>
                      <th className="_col_product">Tour Du Lịch</th>
                      <th className="_col_price">Đơn Giá</th>
                      <th className="_col_qty">Số Lượng</th>
                      <th className="_col_subtotal">Thành Tiền</th>
                      <th className="_col_action">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="_tableBody_rows">
                    {cartItems.map((item) => (
                      <tr
                        key={item.id || item.tourId}
                        className="_cartTableRow_item"
                        data-tour-title={item.title}
                      >
                        {/* Select checkbox */}
                        <td className="_col_select">
                          <label className="_tableCheckbox_label">
                            <input
                              type="checkbox"
                              checked={item.selected}
                              onChange={() => toggleSelect(item.tourId || item.id)}
                              className="_hiddenCheck_input"
                            />
                            <span className="_customCheck_box"></span>
                          </label>
                        </td>

                        {/* Tour Info */}
                        <td className="_col_product">
                          <div className="_tourItem_preview_cluster">
                            <img src={item.avatar} alt={item.title} className="_itemThumb_img" />
                            <div className="_itemText_details">
                              <Link to={`/tour/${item.slug}`} className="_itemTitle_anchor">
                                {item.title}
                              </Link>
                              <span className="_itemDeparture_tag">Khởi hành: {item.departureDate}</span>
                            </div>
                          </div>
                        </td>

                        {/* Unit Price */}
                        <td className="_col_price">
                          <span className="_unitPrice_val">{item.priceUnit.toLocaleString('vi-VN')}đ</span>
                        </td>

                        {/* Quantity Controls: [-] [val] [+] */}
                        <td className="_col_qty">
                          <div className="_qtyControls_box">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.tourId || item.id, -1)}
                              className="_btnQty_action _btnQty_dec"
                              aria-label="Giảm số lượng"
                            >
                              -
                            </button>
                            <span className="_qtyNumber_display">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.tourId || item.id, 1)}
                              className="_btnQty_action _btnQty_inc"
                              aria-label="Tăng số lượng"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Subtotal */}
                        <td className="_col_subtotal">
                          <strong className="_subtotalVal_highlight">
                            {(item.priceUnit * item.quantity).toLocaleString('vi-VN')}đ
                          </strong>
                        </td>

                        {/* Delete Button (Icon Only - Great locator challenge) */}
                        <td className="_col_action">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.tourId || item.id)}
                            className="_btnDelete_item_icon"
                            aria-label={`Xóa tour ${item.title}`}
                            title="Xóa tour khỏi giỏ"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Voucher Code Box */}
              <div className="_voucherCard_box">
                <div className="_voucherHeader">
                  <Tag size={16} className="_tagIcon" />
                  <h4>Mã Ưu Đãi / Voucher Giảm Giá</h4>
                  <small>(Gợi ý test: nhập <strong>VIETTRAVEL500</strong> hoặc <strong>PLAYWRIGHT</strong>)</small>
                </div>
                <form onSubmit={handleApplyVoucher} className="_voucherForm_inline">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Nhập mã voucher..."
                    className="_voucherInput_control"
                  />
                  <button type="submit" className="_btnApply_voucher">
                    Áp Dụng
                  </button>
                </form>
                {voucherMessage && (
                  <p className={`_voucherMessage_feedback ${discountAmount > 0 ? '_msg_success' : '_msg_error'}`}>
                    {voucherMessage}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Customer Info & Checkout Form */}
            <div className="_checkoutForm_col">
              <div className="_checkoutCard_box" data-component="checkout-form">
                <h3 className="_checkoutCard_title">Thông Tin Đặt Tour</h3>

                <form onSubmit={handleCheckoutSubmit} className="_customerForm_fields">
                  {/* Họ và tên */}
                  <div className="_fieldGroup_item">
                    <label className="_fieldLabel_text">
                      Họ và tên người đặt <span className="_reqStar">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="_inputControl_standard"
                      required
                    />
                  </div>

                  {/* Số điện thoại */}
                  <div className="_fieldGroup_item">
                    <label className="_fieldLabel_text">
                      Số điện thoại liên hệ <span className="_reqStar">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0901234567"
                      className="_inputControl_standard"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="_fieldGroup_item">
                    <label className="_fieldLabel_text">
                      Hòm thư điện tử (Email) <span className="_reqStar">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="_inputControl_standard"
                      required
                    />
                  </div>

                  {/* Địa chỉ */}
                  <div className="_fieldGroup_item">
                    <label className="_fieldLabel_text">Địa chỉ đón khách hoặc nhận vé</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Số nhà, tên đường, quận/huyện..."
                      className="_inputControl_standard"
                    />
                  </div>

                  {/* Payment Methods */}
                  <div className="_fieldGroup_item">
                    <label className="_fieldLabel_text">Phương thức thanh toán:</label>
                    <div className="_paymentRadios_stack">
                      <label className="_paymentRadio_label">
                        <input
                          type="radio"
                          name="payMethod"
                          value="banking"
                          checked={paymentMethod === 'banking'}
                          onChange={() => setPaymentMethod('banking')}
                          className="_hiddenRadio"
                        />
                        <span className="_customRadio_circle"></span>
                        <CreditCard size={18} className="_payIcon" />
                        <div>
                          <strong>Chuyển khoản ngân hàng (QR Code)</strong>
                          <small>Vietcombank / Techcombank / MBBank</small>
                        </div>
                      </label>

                      <label className="_paymentRadio_label">
                        <input
                          type="radio"
                          name="payMethod"
                          value="cash"
                          checked={paymentMethod === 'cash'}
                          onChange={() => setPaymentMethod('cash')}
                          className="_hiddenRadio"
                        />
                        <span className="_customRadio_circle"></span>
                        <Banknote size={18} className="_payIcon" />
                        <div>
                          <strong>Thanh toán trực tiếp tại văn phòng</strong>
                          <small>123 Nguyễn Huệ, Quận 1, TP.HCM</small>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Ghi chú */}
                  <div className="_fieldGroup_item">
                    <label className="_fieldLabel_text">Yêu cầu đặc biệt hoặc ghi chú tour</label>
                    <textarea
                      rows={2}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ăn chay, chỗ ngồi gần cửa sổ, đón sân bay..."
                      className="_textareaControl_standard"
                    />
                  </div>

                  <hr className="_summaryDivider" />

                  {/* Order Summary Pricing */}
                  <div className="_pricingSummary_block">
                    <div className="_priceRow">
                      <span>Tạm tính ({cartItems.filter(i => i.selected).length} tour):</span>
                      <strong>{totalPrice.toLocaleString('vi-VN')}đ</strong>
                    </div>
                    {discountAmount > 0 && (
                      <div className="_priceRow _discountRow">
                        <span>Giảm giá khuyến mãi:</span>
                        <strong className="_discountVal">-{discountAmount.toLocaleString('vi-VN')}đ</strong>
                      </div>
                    )}
                    <div className="_priceRow _finalTotalRow">
                      <span>Tổng tiền thanh toán:</span>
                      <strong className="_grandTotal">{finalTotal.toLocaleString('vi-VN')}đ</strong>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="_btnSubmitCheckout_primary"
                  >
                    {isSubmitting ? (
                      <span>Đang xử lý đơn tour...</span>
                    ) : (
                      <span className="_btnSlot_row">
                        <span>Xác</span>&nbsp;<span>nhận</span>&nbsp;<span>đặt tour ngay</span>
                        <ArrowRight size={18} />
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
