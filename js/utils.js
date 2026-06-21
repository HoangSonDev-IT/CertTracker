// File chứa các hàm bổ trợ dùng chung

const utils = {
  // Format ngày chuẩn Việt Nam (DD/MM/YYYY)
  formatDate: (dateString) => {
    if (!dateString) return "Vĩnh viễn";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  },

  // Kiểm tra chứng chỉ sắp/đã hết hạn
  // Trả về: 'expired' (đã hết hạn), 'warning' (< 30 ngày), 'valid' (bình thường)
  checkExpiryStatus: (expiryDateString) => {
    if (!expiryDateString) return "valid";

    const expiry = new Date(expiryDateString);
    const now = new Date();
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "expired";
    if (diffDays <= 30) return "warning";
    return "valid";
  },

  // Tạo Badge (nhãn màu) HTML dựa trên trạng thái (còn hạn, sắp hết, đã hết)
  getExpiryBadgeHtml: (status) => {
    switch (status) {
      case "valid":
        return '<span class="badge bg-success">🟢 Còn hạn</span>';
      case "warning":
        return '<span class="badge bg-warning text-dark">🟡 Sắp hết hạn</span>';
      case "expired":
        return '<span class="badge bg-danger">🔴 Đã hết hạn</span>';
      default:
        return '<span class="badge bg-secondary">Vĩnh viễn</span>';
    }
  },
};
