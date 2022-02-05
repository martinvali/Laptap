import smoothscroll from "smoothscroll-polyfill";
import Glide from "@glidejs/glide";
import Accordion from "accordion-js";
import { Anchors, Autoplay } from "@glidejs/glide/dist/glide.modular.esm";

const smoothAnchorClasses = [
  ".navigation-link-desktop:nth-of-type(1) .navigation-link-anchor-desktop",
  ".navigation-link-desktop:nth-of-type(2) .navigation-link-anchor-desktop",
  ".navigation-link-desktop:nth-of-type(3) .navigation-link-anchor-desktop",
  ".navigation-link-desktop:nth-of-type(4) .navigation-link-anchor-desktop",
  ".navigation-link-desktop:nth-of-type(5) .navigation-link-anchor-desktop",
  ".navigation-link:nth-of-type(1) .navigation-link-anchor",
  ".navigation-link:nth-of-type(2) .navigation-link-anchor",
  ".navigation-link:nth-of-type(3) .navigation-link-anchor",
  ".navigation-link:nth-of-type(4) .navigation-link-anchor",
  ".navigation-link:nth-of-type(5) .navigation-link-anchor",
  ".btn-primary",
  ".btn-secondary",
  ".kkk",
];
smoothscroll.polyfill();
smoothAnchorClasses.forEach(function (className) {
  document.querySelector(className).addEventListener("click", function (e) {
    document
      .querySelector(e.target.dataset.navigateto)
      .scrollIntoView({ behavior: "smooth" });
  });
});

/*document
  .querySelector(".navigation-link-anchor-desktop")
  .forEach(function (el) {
    el.addEventListener("click", function () {
      document
        .querySelector(el.dataset.navigateto)
        .scrollIntoView({ behaviour: "smooth" });
    });
  });*/
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
  element.querySelector(".ac-panel").style.marginTop = "0.8rem";
}

function faqArrowClose(element) {
  element.querySelector(".faq-arrow").style.animation =
    "closeAnimation 0.2s linear";
  element.querySelector(".faq-question").style.backgroundColor = "#EDEDED";
}

function anchorScrollTo() {}

function removeAnswerMarginTop(element) {
  element.querySelector(".ac-panel").style.marginTop = "0";
}

anchorScrollTo();

checkFlexGap();
hamburgerMenu();

const glider = new Glide(".glide", {
  type: "carousel",
  animationDuration: 800,
  autoplay: 5000,
  hoverpause: true,
  focusAt: "center",
}).mount({ Autoplay });

setTimeout(() => {
  glider.update();
}, 500); /* TO FIX GLIDE BUG */

new Accordion(".accordion-container", {
  duration: 200,
  beforeOpen: faqArrowOpen,
  beforeClose: faqArrowClose,
  onClose: removeAnswerMarginTop,
});
