(() => {
  const minutes = document.querySelector('[data-cd="mins"]');
  const seconds = document.querySelector('[data-cd="secs"]');
  if (minutes && seconds) {
    let remaining = 120;
    const render = () => {
      minutes.textContent = String(Math.floor(remaining / 60)).padStart(2, "0");
      seconds.textContent = String(remaining % 60).padStart(2, "0");
    };
    render();
    const timer = setInterval(() => {
      remaining -= 1;
      render();
      if (remaining === 0) clearInterval(timer);
    }, 1000);
  }

  const slider = document.getElementById("korsetSlider");
  const gallery = document.getElementById("korsetGallery");
  const root = slider || gallery;
  if (!root) return;
  const track = slider?.querySelector(".kslider__track");
  const slides = root.querySelectorAll(slider ? ".kslide" : "img");
  const dots = root.querySelectorAll(slider ? ".kdot" : ".gdot");
  let index = 0;
  let timer;

  function showSlide(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    if (track) track.style.transform = `translateX(${-index * 100}%)`;
    else
      slides.forEach((slide, position) => slide.classList.toggle("is-active", position === index));
    dots.forEach((dot, position) => dot.classList.toggle("is-active", position === index));
  }
  function restart() {
    clearInterval(timer);
    timer = setInterval(() => showSlide(index + 1), 3200);
  }
  dots.forEach((dot, position) =>
    dot.addEventListener("click", () => {
      showSlide(position);
      if (gallery) restart();
    }),
  );
  root.querySelector(".kslider__nav--prev")?.addEventListener("click", () => showSlide(index - 1));
  root.querySelector(".kslider__nav--next")?.addEventListener("click", () => showSlide(index + 1));
  if (slider) {
    let touchStart = null;
    slider.addEventListener(
      "touchstart",
      (event) => {
        touchStart = event.touches[0].clientX;
      },
      { passive: true },
    );
    slider.addEventListener(
      "touchend",
      (event) => {
        if (touchStart === null) return;
        const distance = event.changedTouches[0].clientX - touchStart;
        if (Math.abs(distance) > 40) showSlide(index + (distance < 0 ? 1 : -1));
        touchStart = null;
      },
      { passive: true },
    );
  }
  if (gallery) restart();
  showSlide(0);
})();
