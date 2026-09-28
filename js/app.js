document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("registrationModal");
  const form = document.getElementById("registrationForm");
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const nameError = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");
  const submitButton = document.getElementById("submitBtn");
  const formatter = window.phoneFormatter;
  let scrollPosition = 0;

  function openModal(event) {
    event.preventDefault();
    scrollPosition = window.scrollY;
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    nameError.style.display = "none";
    phoneError.style.display = "none";
  }

  function closeModal() {
    if (modal.style.display === "none") return;
    modal.style.display = "none";
    document.body.style.overflow = "";
    window.scrollTo(0, scrollPosition);
  }

  document.querySelectorAll(".registerBtn").forEach((button) => {
    button.addEventListener("click", openModal);
  });
  document.getElementById("closeModalBtn").addEventListener("click", closeModal);
  document.querySelector(".homeModalOverlay").addEventListener("click", closeModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });

  window.addEventListener("pageshow", () => {
    submitButton.disabled = false;
    submitButton.textContent = "DAVOM ETISH";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (submitButton.disabled) return;
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const validPhone = formatter?.validate(phone);
    nameError.style.display = name ? "none" : "block";
    phoneError.style.display = validPhone ? "none" : "block";
    if (!name || !validPhone) return;

    submitButton.disabled = true;
    if (!window.saveRegistration(name, `${formatter.getCurrentCode()} ${phone}`)) {
      submitButton.disabled = false;
      return;
    }
    window.location.href = "/thankYou.html";
  });
});
