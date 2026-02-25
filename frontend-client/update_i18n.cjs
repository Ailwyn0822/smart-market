const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'i18n', 'language');
const files = ['zh_TW.json', 'en.json', 'vi.json'];

const additions = {
  zh_TW: {
    menu: {
      notifications: "通知中心",
      mark_all_read: "全部標為已讀",
      no_notifications: "目前沒有通知",
      profile_settings: "個人資料設定",
      buyer_center: "買家中心",
      seller_center: "賣家中心",
      seller_dashboard: "賣家儀表板",
      sales_orders: "銷售訂單管理",
      my_products: "我的商品",
      favorites: "我的收藏"
    },
    cart: {
      discount_success_amount: "折扣碼套用成功！折抵 ${amount}",
      discount_success: "折扣碼套用成功！"
    },
    chat: {
      title: "聊聊",
      messages: "訊息通知",
      search_placeholder: "搜尋帳號...",
      search_results: "搜尋結果",
      no_user_found: "找不到此帳號",
      no_messages: "目前沒有任何訊息",
      search_to_start: "搜尋帳號開始聊天",
      click_to_start: "點擊開始對話",
      say_hi: "打個招呼吧！",
      type_message: "輸入訊息..."
    },
    profile: {
      title: "個人資料編輯",
      click_to_upload: "點擊圖片上傳大頭貼",
      uploading: "上傳中...",
      name_label: "名稱 Name",
      name_placeholder: "您的暱稱",
      email_label: "電子郵件 Email",
      email_note: "目前不支援修改電子郵件",
      saving: "儲存中...",
      save_changes: "儲存變更",
      avatar_success: "大頭貼更新成功！",
      name_required: "請輸入您的名稱",
      save_success: "儲存成功！",
      save_error: "儲存失敗，請稍後再試"
    },
    products: {
      not_found: "找不到此商品",
      back_to_list: "回到商品列表",
      view_seller: "查看賣家",
      seller_label: "賣家"
    },
    buy_order: {
      confirm_receipt: "確認收貨",
      confirm_receipt_success: "確認收貨成功！您現在可以為訂單留下評價。",
      status_update_success: "狀態更新成功",
      status_update_failed: "狀態更新失敗",
      review: "給予評價",
      reviewed: "已評價",
      review_modal_title: "評價賣家與商品",
      write_review: "寫下您對這次交易的感想... (選填)",
      submitting: "送出中...",
      submit_review: "確認送出評價",
      later: "稍後再說",
      review_success: "評價送出成功，感謝您的回饋！",
      review_failed: "評價送出失敗",
      status_badge: {
        processing: "備貨中",
        shipped: "已出貨",
        out_for_delivery: "配送中",
        delivered: "已收貨"
      }
    }
  },
  en: {
    menu: {
      notifications: "Notifications",
      mark_all_read: "Mark all as read",
      no_notifications: "No notifications",
      profile_settings: "Profile Settings",
      buyer_center: "Buyer Center",
      seller_center: "Seller Center",
      seller_dashboard: "Seller Dashboard",
      sales_orders: "Sales Orders",
      my_products: "My Products",
      favorites: "My Favorites"
    },
    cart: {
      discount_success_amount: "Discount applied! Saved ${amount}",
      discount_success: "Discount applied!"
    },
    chat: {
      title: "Chat",
      messages: "Messages",
      search_placeholder: "Search account...",
      search_results: "Search Results",
      no_user_found: "Account not found",
      no_messages: "No messages yet",
      search_to_start: "Search account to start chat",
      click_to_start: "Click to start chat",
      say_hi: "Say hi!",
      type_message: "Type a message..."
    },
    profile: {
      title: "Edit Profile",
      click_to_upload: "Click to upload avatar",
      uploading: "Uploading...",
      name_label: "Name",
      name_placeholder: "Your nickname",
      email_label: "Email",
      email_note: "Email modification is currently not supported",
      saving: "Saving...",
      save_changes: "Save Changes",
      avatar_success: "Avatar successfully updated!",
      name_required: "Please enter your name",
      save_success: "Saved successfully!",
      save_error: "Save failed, please try again"
    },
    products: {
      not_found: "Product not found",
      back_to_list: "Back to product list",
      view_seller: "View Seller",
      seller_label: "Seller"
    },
    buy_order: {
      confirm_receipt: "Confirm Receipt",
      confirm_receipt_success: "Receipt confirmed! You can now review the order.",
      status_update_success: "Status updated successfully",
      status_update_failed: "Failed to update status",
      review: "Review",
      reviewed: "Reviewed",
      review_modal_title: "Review this transaction",
      write_review: "Write your thoughts about this transaction... (Optional)",
      submitting: "Submitting...",
      submit_review: "Submit Review",
      later: "Later",
      review_success: "Review submitted successfully, thank you!",
      review_failed: "Failed to submit review",
      status_badge: {
        processing: "Processing",
        shipped: "Shipped",
        out_for_delivery: "Out for delivery",
        delivered: "Delivered"
      }
    }
  },
  vi: {
    menu: {
      notifications: "Thông báo",
      mark_all_read: "Đánh dấu tất cả là đã đọc",
      no_notifications: "Không có thông báo mới",
      profile_settings: "Cài đặt hồ sơ",
      buyer_center: "Trung tâm người mua",
      seller_center: "Trung tâm người bán",
      seller_dashboard: "Bảng điều khiển người bán",
      sales_orders: "Quản lý đơn hàng",
      my_products: "Sản phẩm của tôi",
      favorites: "Mục yêu thích"
    },
    cart: {
      discount_success_amount: "Đã áp dụng mã giảm giá! Tiết kiệm ${amount}",
      discount_success: "Đã áp dụng mã giảm giá!"
    },
    chat: {
      title: "Trò chuyện",
      messages: "Tin nhắn",
      search_placeholder: "Tìm kiếm tài khoản...",
      search_results: "Kết quả tìm kiếm",
      no_user_found: "Không tìm thấy tài khoản",
      no_messages: "Chưa có tin nhắn nào",
      search_to_start: "Tìm kiếm tài khoản để bắt đầu",
      click_to_start: "Nhấn để bắt đầu trò chuyện",
      say_hi: "Gửi lời chào đi!",
      type_message: "Nhập tin nhắn..."
    },
    profile: {
      title: "Chỉnh sửa hồ sơ",
      click_to_upload: "Nhấn để tải hình đại diện",
      uploading: "Đang tải lên...",
      name_label: "Tên Name",
      name_placeholder: "Biệt danh của bạn",
      email_label: "Email",
      email_note: "Hiện chưa hỗ trợ thay đổi email",
      saving: "Đang lưu...",
      save_changes: "Lưu thay đổi",
      avatar_success: "Cập nhật hình đại diện thành công!",
      name_required: "Vui lòng nhập tên của bạn",
      save_success: "Lưu thành công!",
      save_error: "Lưu thất bại, vui lòng thử lại sau"
    },
    products: {
      not_found: "Không tìm thấy sản phẩm",
      back_to_list: "Quay lại danh sách",
      view_seller: "Xem người bán",
      seller_label: "Người bán"
    },
    buy_order: {
      confirm_receipt: "Xác nhận đã nhận hàng",
      confirm_receipt_success: "Đã xác nhận nhận hàng! Bạn có thể đánh giá ngay bây giờ.",
      status_update_success: "Cập nhật trạng thái thành công",
      status_update_failed: "Cập nhật trạng thái thất bại",
      review: "Đánh giá",
      reviewed: "Đã đánh giá",
      review_modal_title: "Đánh giá giao dịch",
      write_review: "Viết cảm nghĩ của bạn về giao dịch này... (Tùy chọn)",
      submitting: "Đang gửi...",
      submit_review: "Xác nhận gửi đánh giá",
      later: "Để sau",
      review_success: "Gửi đánh giá thành công, cảm ơn phản hồi của bạn!",
      review_failed: "Gửi đánh giá thất bại",
      status_badge: {
        processing: "Đang chuẩn bị",
        shipped: "Đã giao hàng",
        out_for_delivery: "Đang giao hàng",
        delivered: "Đã nhận hàng"
      }
    }
  }
};

const map = {
  'zh_TW.json': additions.zh_TW,
  'en.json': additions.en,
  'vi.json': additions.vi
};

for (const file of files) {
  const p = path.join(localesDir, file);
  // Using JSON parse on current file strips out lint duplication automatically via the JS object model,
  // the latter key strictly overwrites the first. Hence no more duplicate carts!
  let data;
  try {
     data = JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch(e) {
     console.error('Error parsing', p);
  }
  
  const toAdd = map[file];

  // Deep merge
  const merge = (target, source) => {
    for (const key in source) {
      if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        merge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  };

  merge(data, toAdd);
  
  // 刪除原本我自己加入的重複 cart, 順便保證乾淨
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
}
console.log("I18N updated successfully!")
