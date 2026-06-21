// Logic cho trang index (Public)
document.addEventListener("DOMContentLoaded", () => {
  console.log("Home page loaded");

  // Gọi màn hình danh sách ban đầu
  loadPublicCertificates();
  loadPublicSkills();

  // Bắt sự kiện lọc theo lĩnh vực (sử dụng jQuery Events & Effects)
  $("#filterCategory").on("change", function (e) {
    const category = $(this).val();

    // Áp dụng hiệu ứng fadeOut trước khi load lại chứng chỉ
    $("#certList").fadeOut(200, () => {
      loadPublicCertificates(category).then(() => {
        $("#certList").fadeIn(200);
      });
    });
  });
});

// Hàm gọi API và load dữ liệu chứng chỉ
async function loadPublicCertificates(categoryFilter = "all") {
  const certList = document.getElementById("certList");

  // Hiển thị trạng thái đang tải
  certList.innerHTML =
    '<div class="col-12 text-center my-4"><div class="spinner-border text-primary" role="status"></div><p>Đang tải dữ liệu...</p></div>';

  try {
    const certs = await api.getCertificates();

    // Lọc theo lĩnh vực nếu người dùng có chọn
    const filteredCerts =
      categoryFilter === "all"
        ? certs
        : certs.filter((c) => c.category === categoryFilter);

    renderCertificates(filteredCerts);
  } catch (error) {
    certList.innerHTML = `<div class="col-12"><div class="alert alert-danger">Lỗi khi tải dữ liệu: ${error.message}</div></div>`;
  }
}

// Hàm render dữ liệu ra mã HTML (dạng Card)
function renderCertificates(certs) {
  const certList = document.getElementById("certList");

  if (certs.length === 0) {
    certList.innerHTML =
      '<div class="col-12"><div class="alert alert-info">Không có chứng chỉ nào trong danh mục này.</div></div>';
    return;
  }

  // Duyệt qua từng chứng chỉ và tạo HTML Card
  const html = certs
    .map((cert) => {
      const status = utils.checkExpiryStatus(cert.expiryDate);
      const badgeHtml = utils.getExpiryBadgeHtml(status);
      const issueDate = utils.formatDate(cert.issueDate);
      const expiryDate = utils.formatDate(cert.expiryDate);

      return `
      <div class="col-md-4 mb-4">
        <div class="card h-100 cert-card shadow-sm border-0">
          <img src="${cert.imageUrl}" class="card-img-top cert-img" alt="${cert.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-primary fw-bold mb-1">${cert.name}</h5>
            <div class="mb-2">
              <span class="badge bg-secondary">${cert.category}</span>
            </div>
            <p class="card-text text-muted small flex-grow-1">${cert.description}</p>
            <ul class="list-unstyled mb-3 small">
              <li><i class="bi bi-building"></i> <strong>Tổ chức:</strong> ${cert.issuer}</li>
              <li><i class="bi bi-calendar-check"></i> <strong>Cấp ngày:</strong> ${issueDate}</li>
              <li><i class="bi bi-calendar-x"></i> <strong>Hết hạn:</strong> ${expiryDate}</li>
            </ul>
            <div class="mt-auto text-end">
              ${badgeHtml}
            </div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  // Đổ HTML vào container
  certList.innerHTML = html;
}

// ----------------------------------------------------
// PHẦN KỸ NĂNG (SKILLS)
// ----------------------------------------------------
async function loadPublicSkills() {
  const skillList = document.getElementById("skillList");
  skillList.innerHTML =
    '<div class="col-12"><div class="spinner-border text-primary" role="status"></div></div>';

  try {
    const skills = await api.getSkills();
    renderSkills(skills);
  } catch (error) {
    skillList.innerHTML = `<div class="col-12"><div class="alert alert-danger">Lỗi tải kỹ năng: ${error.message}</div></div>`;
  }
}

function renderSkills(skills) {
  const skillList = document.getElementById("skillList");

  if (skills.length === 0) {
    skillList.innerHTML =
      '<div class="col-12"><p class="text-muted">Chưa có kỹ năng nào được cập nhật.</p></div>';
    return;
  }

  // Tùy màu sắc theo mức độ để trông đẹp hơn
  const getLevelColor = (level) => {
    switch (level) {
      case "Xuất sắc":
        return "bg-success";
      case "Tốt":
        return "bg-primary";
      case "Khá":
        return "bg-info text-dark";
      case "Trung bình":
        return "bg-warning text-dark";
      case "Cơ bản":
        return "bg-secondary";
      default:
        return "bg-primary";
    }
  };

  const html = skills
    .map((skill) => {
      const colorClass = getLevelColor(skill.level);
      return `
      <div class="col-md-3 col-sm-6 mb-3">
        <div class="card shadow-sm border-0 text-center py-2 h-100">
          <div class="card-body">
            <h6 class="card-title fw-bold m-0">${skill.name}</h6>
            <span class="badge ${colorClass} mt-2">${skill.level}</span>
            <div class="small text-muted mt-1">${skill.category}</div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  skillList.innerHTML = html;
}
