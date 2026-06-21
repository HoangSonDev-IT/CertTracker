// Cấu hình URL cơ sở của Server giả lập
// Nếu dùng MockAPI thì thay URL vào đây
const BASE_URL = "https://6a353de1f957779fdb3050d3.mockapi.io";

const api = {
  // 1. Lấy tất cả chứng chỉ
  // SỬ DỤNG .then() / .catch() THEO YÊU CẦU BẮT BUỘC CỦA ĐỀ BÀI
  getCertificates: () => {
    return fetch(`${BASE_URL}/certificates`)
      .then((response) => {
        if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");
        return response.json();
      })
      .catch((error) => {
        console.error("API Error:", error);
        return [];
      });
  },

  // 2. Lấy 1 chứng chỉ theo ID
  getCertificateById: (id) => {
    return fetch(`${BASE_URL}/certificates/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Lỗi tải dữ liệu chứng chỉ");
        return response.json();
      })
      .catch((error) => {
        console.error("API Error:", error);
        return null;
      });
  },

  // 3. Thêm mới
  addCertificate: (data) => {
    return fetch(`${BASE_URL}/certificates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Lỗi khi thêm chứng chỉ");
        return response.json();
      })
      .catch((error) => {
        console.error("API Error:", error);
        throw error;
      });
  },

  // 4. Cập nhật
  updateCertificate: (id, data) => {
    return fetch(`${BASE_URL}/certificates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Lỗi khi cập nhật");
        return response.json();
      })
      .catch((error) => {
        console.error("API Error:", error);
        throw error;
      });
  },

  // 5. Xóa
  deleteCertificate: (id) => {
    return fetch(`${BASE_URL}/certificates/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Lỗi khi xóa");
        return true;
      })
      .catch((error) => {
        console.error("API Error:", error);
        throw error;
      });
  },
  // ===================== KỸ NĂNG (SKILLS) =====================
  // Dùng jQuery AJAX theo yêu cầu
  getSkills: () => {
    return $.ajax({
      url: `${BASE_URL}/skills`,
      method: "GET",
    }).catch((error) => {
      console.error("jQuery AJAX Error:", error);
      return [];
    });
  },

  getSkillById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/skills/${id}`);
      if (!response.ok) throw new Error("Lỗi tải skill");
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  },

  addSkill: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Lỗi thêm skill");
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  updateSkill: async (id, data) => {
    try {
      const response = await fetch(`${BASE_URL}/skills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Lỗi cập nhật skill");
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  deleteSkill: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/skills/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Lỗi xóa skill");
      return true;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};
