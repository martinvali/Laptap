import Glide from "@glidejs/glide";
import { Autoplay } from "@glidejs/glide/dist/glide.modular.esm";

new Glide(".glide", {
  type: "carousel",
  animationDuration: 800,
  autoplay: 5000,
}).mount({ Autoplay });

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

function onHideFaq(evt) {
  evt.target.removeEventListener("transitionend", onHideFaq);
  evt.target.classList.remove("paddingtop");
}

function faqClick(e) {
  const questionButton = e.target.closest(".faq-question"); //Find the question button element to expand it so that the answer would become visible
  const answerText = questionButton.querySelector(".faq-answer");
  const buttonArrow = questionButton.querySelector("img");
  answerText.classList.toggle("hidden");
  answerText.classList.toggle("visible");
  if (answerText.classList.contains("hidden")) {
    answerText.style.height = 0;
    buttonArrow.style.animation = "closeAnimation 0.25s linear";
    answerText.addEventListener("transitionend", onHideFaq);
    questionButton.style.animation = "colorDarken 0.25s linear";
  } else {
    answerText.classList.add("paddingtop");
    answerText.style.height = answerText.scrollHeight + "px"; //Reveal the answertext's content
    buttonArrow.style.animation = "";
    buttonArrow.style.animation = "openAnimation 0.25s linear";
    questionButton.style.animation = "colorLighten 0.25s linear";
  }
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

const faqContainer = document.querySelector(".faq-questions-container");

faqContainer.addEventListener("click", faqClick);

checkFlexGap();
hamburgerMenu();
