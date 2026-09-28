(() => {
  const modal = document.getElementById("regModal");
  const form = document.getElementById("modalForm");
  const nameInput = form.elements.namedItem("name");
  const phoneInput = form.elements.namedItem("phone");
  const submitButton = form.querySelector('[type="submit"]');

  function openModal(event) {
    event?.preventDefault();
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    nameInput.focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".cta, .btn--gold").forEach((button) => {
    button.addEventListener("click", openModal);
  });
  modal.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
  if (new URLSearchParams(location.search).get("modal") === "1") openModal();

  phoneInput.inputMode = "numeric";
  phoneInput.addEventListener("input", () => {
    const digits = phoneInput.value.replace(/\D/g, "").slice(0, 9);
    phoneInput.value = [
      digits.slice(0, 2),
      digits.slice(2, 5),
      digits.slice(5, 7),
      digits.slice(7, 9),
    ]
      .filter(Boolean)
      .join(" ");
  });
  window.addEventListener("pageshow", () => {
    submitButton.disabled = false;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (submitButton.disabled) return;
    const name = nameInput.value.trim();
    const phone = phoneInput.value;
    const validPhone = phone.replace(/\D/g, "").length === 9;
    nameInput.classList.toggle("err", !name);
    phoneInput.classList.toggle("err", !validPhone);
    if (!name || !validPhone) return;
    if (!window.saveRegistration(name, `+998 ${phone}`)) return;
    submitButton.disabled = true;
    window.location.href = "/thankYou.html";
  });
})();
