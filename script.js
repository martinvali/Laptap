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

checkFlexGap();
