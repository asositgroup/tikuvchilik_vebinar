let submissionInProgress = false;

async function sendFormData() {
  if (submissionInProgress) return;
  submissionInProgress = true;

  try {
    const formDataRaw = localStorage.getItem("formData");
    if (!formDataRaw) return;
    const formDataObj = JSON.parse(formDataRaw);
    const formData = new FormData();
    formData.append("sheetName", "Lead");
    formData.append("Ism", formDataObj.Ism);
    formData.append("Telefon raqam", formDataObj.TelefonRaqam);
    formData.append("Royhatdan o'tgan vaqti", formDataObj.SanaSoat);

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwRtVu6OODL5WAuNdFA5WCwOW8Ej59bJO9DZa-UcHuEmOyr_YJmS4op4bNZLwEASO06bg/exec",
      { method: "POST", body: formData, keepalive: true },
    );
    if (!response.ok) throw new Error("API response was not ok");
    const result = await response.json();
    if (result.ok !== true || result.sheet !== "Lead") {
      throw new Error(result.message || "Lead saqlangani tasdiqlanmadi");
    }
    // Do not remove a newer registration submitted in another tab.
    if (localStorage.getItem("formData") === formDataRaw) {
      localStorage.removeItem("formData");
    }
    document.getElementById("errorMessage")?.remove();
  } catch (error) {
    console.error("Error submitting form:", error);
    let message = document.getElementById("errorMessage");
    if (!message) {
      message = document.createElement("p");
      message.id = "errorMessage";
      message.setAttribute("role", "alert");
      message.style.cssText =
        "text-align:center;color:#e53e3e;font-family:sans-serif;margin:16px 0";
      message.append("Ma’lumot yuborilmadi. Internetni tekshirib, ");
      const retry = document.createElement("button");
      retry.type = "button";
      retry.textContent = "qayta yuboring";
      retry.addEventListener("click", sendFormData);
      message.append(retry);
      document.querySelector(".hero-left").append(message);
    }
  } finally {
    submissionInProgress = false;
  }
}

window.addEventListener("load", sendFormData);
