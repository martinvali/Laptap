import Glide from "@glidejs/glide";
import Accordion from "accordion-js";
import { Anchors, Autoplay } from "@glidejs/glide/dist/glide.modular.esm";
window.__forceSmoothScrollPolyfill__ = true;

import smoothscroll from "smoothscroll-polyfill";

smoothscroll.polyfill();
console.log("Polyfill");

// Fixing flexbox gap property missing in some Safari versions

function checkFlexGap() {
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  const divOne = document.createElement("div");
  divOne.style.height = "1px";
  const divTwo = document.createElement("div");
  divTwo.style.height = "1px";
  flex.appendChild(divOne);
  flex.appendChild(divTwo);

  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 3;
  flex.remove();

  if (!isSupported) document.body.classList.add("no-flexbox-gap");
}

function hamburgerMenu() {
  const hamburger = document.querySelector(".menu-icon");
  const closeHamburgerButton = document.querySelector(".close-button");
  const navigation = document.querySelector(".navigation-links-container");

  function closeNavigation() {
    navigation.classList.remove("visible");
    navigation.classList.add("hidden");
  }
  hamburger.addEventListener("click", function () {
    navigation.classList.remove("hidden");
    navigation.classList.add("visible");
    navigation.style.zIndex = "1";
  });

  closeHamburgerButton.addEventListener("click", closeNavigation);
  navigation.addEventListener("transitionend", function () {
    if (this.classList.contains("hidden")) this.style.zIndex = "-1";
  });

  navigation.addEventListener("click", function (e) {
    if (e.target.classList.contains("navigation-link-anchor"))
      closeNavigation();
  });
}

function faqArrowOpen(element) {
  element.querySelector(".faq-arrow").style.animation =
    "openAnimation 0.2s linear";
  element.querySelector(".faq-question").style.backgroundColor = "#F9FAF8";
}

function faqArrowClose(element) {
  element.querySelector(".faq-arrow").style.animation =
    "closeAnimation 0.2s linear";
  element.querySelector(".faq-question").style.backgroundColor = "#EDEDED";
}

function anchorScrollTo() {
  document.querySelectorAll("[data-navigateTo]").forEach(function (e) {
    e.addEventListener("click", function (e) {
      document
        .querySelector(e.target.dataset.navigateto)
        .scrollIntoView({ behaviour: "smooth" });
    });
  });
}

anchorScrollTo();

checkFlexGap();
hamburgerMenu();

new Glide(".glide", {
  type: "carousel",
  animationDuration: 800,
  autoplay: 5000,
}).mount({ Autoplay });

new Accordion(".accordion-container", {
  duration: 200,
  beforeOpen: faqArrowOpen,
  beforeClose: faqArrowClose,
});
