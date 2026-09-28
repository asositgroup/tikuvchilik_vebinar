window.saveRegistration = (phone) => {
  const now = new Date();
  const date = now.toLocaleDateString("en-GB", { timeZone: "Asia/Tashkent" });
  const time = now.toLocaleTimeString("en-GB", {
    timeZone: "Asia/Tashkent",
    hour12: false,
  });
  try {
    localStorage.setItem(
      "formData",
      JSON.stringify({
        Ism: "",
        TelefonRaqam: phone,
        SanaSoat: `${date} - ${time}`,
      }),
    );
    return true;
  } catch {
    alert("Ma’lumotni saqlab bo‘lmadi. Brauzerda saqlashga ruxsat berib, qayta urinib ko‘ring.");
    return false;
  }
};
