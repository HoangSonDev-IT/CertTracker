// Logic cho trang Admin
let certModal; // Biến lưu trữ Bootstrap Modal
let skillModal; // Biến lưu trữ Modal Kỹ năng

document.addEventListener("DOMContentLoaded", () => {
  console.log("Admin page loaded");

  // Khởi tạo Bootstrap Modal để điều khiển qua JS
  certModal = new bootstrap.Modal(document.getElementById("certModal"));
  skillModal = new bootstrap.Modal(document.getElementById("skillModal"));

  // Gọi API tải danh sách ban đầu
  loadAdminCertificates();
  loadAdminSkills();

  // Reset form khi bấm "Thêm chứng chỉ"
  document.getElementById("btnShowAddModal").addEventListener("click", () => {
    document.getElementById("certForm").reset();
    document.getElementById("certId").value = "";
    document.getElementById("certModalLabel").innerText = "Thêm Mới Chứng Chỉ";
  });

  // Bắt sự kiện LƯU (Submit Form)
  document
    .getElementById("certForm")
    .addEventListener("submit", handleSaveSubmit);

  // Xóa class validate lỗi khi user gõ lại (jQuery Events)
  $("#certForm input, #certForm select").on("input change", function () {
    $(this).removeClass("is-invalid");
  });

  $("#skillForm input, #skillForm select").on("input change", function () {
    $(this).removeClass("is-invalid");
  });

  // ===================== SỰ KIỆN KỸ NĂNG =====================
  document
    .getElementById("btnShowAddSkillModal")
    .addEventListener("click", () => {
      document.getElementById("skillForm").reset();
      document.getElementById("skillId").value = "";
      document.getElementById("skillModalLabel").innerText = "Thêm Mới Kỹ Năng";
    });

  document
    .getElementById("skillForm")
    .addEventListener("submit", handleSaveSkillSubmit);
});

// 1. TẢI VÀ RENDER DANH SÁCH BẢNG CHỨNG CHỈ
async function loadAdminCertificates() {
  const tbody = document.getElementById("adminCertList");
  tbody.innerHTML =
    '<tr><td colspan="7" class="text-center">Đang tải dữ liệu...</td></tr>';

  try {
    const certs = await api.getCertificates();
    if (certs.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="7" class="text-center">Chưa có dữ liệu.</td></tr>';
      return;
    }

    const html = certs
      .map((cert, index) => {
        const status = utils.checkExpiryStatus(cert.expiryDate);
        const badgeHtml = utils.getExpiryBadgeHtml(status);

        return `
        <tr>
          <td>${index + 1}</td>
          <td><img src="${cert.imageUrl}" alt="${cert.name}" style="height: 50px; width: 70px; object-fit: cover; border-radius: 4px;"></td>
          <td class="fw-bold">${cert.name}</td>
          <td><span class="badge bg-secondary">${cert.category}</span></td>
          <td>${utils.formatDate(cert.issueDate)}</td>
          <td>${utils.formatDate(cert.expiryDate)} <br> ${badgeHtml}</td>
          <td>
            <button class="btn btn-sm btn-primary me-1" onclick="editCert('${cert.id}')">✏️ Sửa</button>
            <button class="btn btn-sm btn-danger" onclick="deleteCert('${cert.id}')">🗑️ Xóa</button>
          </td>
        </tr>
      `;
      })
      .join("");

    tbody.innerHTML = html;
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-danger text-center">Lỗi: ${error.message}</td></tr>`;
  }
}

// 2. XỬ LÝ LƯU (THÊM / SỬA) VÀO DATABASE
async function handleSaveSubmit(e) {
  e.preventDefault(); // Ngăn load lại trang

  // Validation Form (JavaScript & jQuery)
  let isValid = true;

  const nameInput = $("#certName");
  if (!nameInput.val().trim()) {
    nameInput.addClass("is-invalid");
    isValid = false;
  }

  const issuerInput = $("#certIssuer");
  if (!issuerInput.val().trim()) {
    issuerInput.addClass("is-invalid");
    isValid = false;
  }

  const dateInput = $("#certIssueDate");
  if (!dateInput.val()) {
    dateInput.addClass("is-invalid");
    isValid = false;
  }

  const urlInput = $("#certImgUrl");
  const urlVal = urlInput.val().trim();
  if (urlVal && !urlVal.startsWith("http")) {
    urlInput.addClass("is-invalid");
    isValid = false;
  }

  if (!isValid) return; // Nếu có lỗi thì ngừng submit

  // Lấy dữ liệu từ Form
  const id = document.getElementById("certId").value;
  const certData = {
    name: nameInput.val().trim(),
    issuer: issuerInput.val().trim(),
    category: document.getElementById("certCategory").value,
    issueDate: dateInput.val(),
    expiryDate: document.getElementById("certExpiryDate").value, // Có thể rỗng
    imageUrl:
      urlVal || "https://placehold.co/600x400/EFEFEF/31343C?text=No+Image",
    description: document.getElementById("certDesc").value,
  };

  try {
    if (id) {
      // CẬP NHẬT nếu đã có ID
      await api.updateCertificate(id, certData);
      alert("Cập nhật thành công!");
    } else {
      // THÊM MỚI nếu chưa có ID
      await api.addCertificate(certData);
      alert("Thêm mới thành công!");
    }

    // Đóng Modal và tải lại danh sách
    certModal.hide();
    loadAdminCertificates();
  } catch (error) {
    alert("Có lỗi xảy ra: " + error.message);
  }
}

// 3. NÚT SỬA (Lấy dữ liệu cũ đắp lên form)
async function editCert(id) {
  try {
    const cert = await api.getCertificateById(id);
    if (!cert) return alert("Không tìm thấy dữ liệu chứng chỉ!");

    // Đắp data lên Form
    document.getElementById("certId").value = cert.id;
    document.getElementById("certName").value = cert.name;
    document.getElementById("certIssuer").value = cert.issuer;
    document.getElementById("certCategory").value = cert.category;
    document.getElementById("certIssueDate").value = cert.issueDate;
    document.getElementById("certExpiryDate").value = cert.expiryDate || "";
    document.getElementById("certImgUrl").value = cert.imageUrl;
    document.getElementById("certDesc").value = cert.description;

    document.getElementById("certModalLabel").innerText =
      "Sửa Thông Tin Chứng Chỉ";

    // Mở Modal
    certModal.show();
  } catch (error) {
    alert("Lỗi: " + error.message);
  }
}

// 4. NÚT XÓA CHỨNG CHỈ
async function deleteCert(id) {
  if (confirm("Bạn có chắc chắn muốn xóa chứng chỉ này chứ?")) {
    try {
      await api.deleteCertificate(id);
      alert("Đã xóa chứng chỉ!");
      loadAdminCertificates(); // Reload bảng
    } catch (error) {
      alert("Lỗi khi xóa: " + error.message);
    }
  }
}

// ----------------------------------------------------
// PHẦN QUẢN LÝ KỸ NĂNG (SKILLS)
// ----------------------------------------------------

async function loadAdminSkills() {
  const tbody = document.getElementById("adminSkillList");
  tbody.innerHTML =
    '<tr><td colspan="5" class="text-center">Đang tải dữ liệu...</td></tr>';

  try {
    const skills = await api.getSkills();
    if (skills.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" class="text-center">Chưa có kỹ năng.</td></tr>';
      return;
    }

    const html = skills
      .map((skill, index) => {
        return `
        <tr>
          <td>${index + 1}</td>
          <td class="fw-bold">${skill.name}</td>
          <td><span class="badge bg-secondary">${skill.category}</span></td>
          <td>${skill.level}</td>
          <td>
            <button class="btn btn-sm btn-primary me-1" onclick="editSkill('${skill.id}')">✏️ Sửa</button>
            <button class="btn btn-sm btn-danger" onclick="deleteSkill('${skill.id}')">🗑️ Xóa</button>
          </td>
        </tr>
      `;
      })
      .join("");

    tbody.innerHTML = html;
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-danger text-center">Lỗi tải kỹ năng</td></tr>`;
  }
}

async function handleSaveSkillSubmit(e) {
  e.preventDefault();

  // Validate skill form using jQuery
  const nameInput = $("#skillName");
  if (!nameInput.val().trim()) {
    nameInput.addClass("is-invalid");
    return;
  }

  const id = document.getElementById("skillId").value;
  const data = {
    name: nameInput.val().trim(),
    category: document.getElementById("skillCategory").value,
    level: document.getElementById("skillLevel").value,
  };

  try {
    if (id) {
      await api.updateSkill(id, data);
      alert("Cập nhật kỹ năng thành công!");
    } else {
      await api.addSkill(data);
      alert("Thêm kỹ năng thành công!");
    }
    skillModal.hide();
    loadAdminSkills();
  } catch (error) {
    alert("Lỗi: " + error.message);
  }
}

async function editSkill(id) {
  try {
    const skill = await api.getSkillById(id);
    if (!skill) return;

    document.getElementById("skillId").value = skill.id;
    document.getElementById("skillName").value = skill.name;
    document.getElementById("skillCategory").value = skill.category;
    document.getElementById("skillLevel").value = skill.level;

    document.getElementById("skillModalLabel").innerText =
      "Sửa Thông Tin Kỹ Năng";
    skillModal.show();
  } catch (error) {
    alert("Lỗi tải thông tin kỹ năng: " + error.message);
  }
}

async function deleteSkill(id) {
  if (confirm("Xóa kỹ năng này?")) {
    try {
      await api.deleteSkill(id);
      loadAdminSkills();
    } catch (error) {
      alert("Lỗi khi xóa kỹ năng");
    }
  }
}
