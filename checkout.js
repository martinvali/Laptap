const stripe = Stripe(
  "pk_test_51JktFJH7IkGhuWpe7itZiKGgaDMwn2sZGbbdIRsxm8ka8I6uZHAY28HLgBi5XSobhyAWO4674Kev5oImt3eh9SVw00qf1e32SH",
  {
    locale: "et",
  }
);

const wd2 = new OmnivaWidget({
  compact_mode: true, // Compact widget is not shown
  // If enabled only a dropdown with locations will be shown

  show_offices: true, // Post offices will be shown
  // If disabled post offices will not be shown in the dropdown

  custom_html: false, // Predefined HTML is activated
  // It is allowed to create a custom HTML                                // It will be included in the container
  show_machines: true,

  id: 2, // Will be added to the unique element ids if
  // there is a need to have more than one widget

  selection_value: "", // Preselected value. (case insensitive, will be trimmed) Can be empty or entirely omitted. Optional
});

const item = [{ id: "prod_KXEBEYAwVhIrTA" }];
let elements;
window.addEventListener("load", function () {
  const omnivaSelect = document.querySelector("#omniva_select2");
  const opt = document.createElement("option");
  opt.value = "tasuta";
  opt.innerText = "TASUTA: Tulen ise järgi Tallinna Lilleküla Gümnaasiumisse";
  omnivaSelect.required = true;
  omnivaSelect.setAttribute("form", "payment-form");
  omnivaSelect.prepend(opt);
  omnivaSelect.value = opt;

  console.log(omnivaSelect);
  omnivaSelect.addEventListener("change", updatePrice);
});

initialize();

document
  .querySelector("#payment-form")
  .addEventListener("submit", handleSubmit);

function productsPriceText(quantity, unitPrice, totalAmount) {
  document.querySelector(
    ".product-price-value"
  ).textContent = `${quantity} x ${unitPrice} = ${totalAmount}€`;
}

function transportPriceText(transportPrice) {
  document.querySelector(
    ".transport-price-value"
  ).innerText = `${transportPrice}€`;
}

function totalPriceText(totalPrice) {
  document.querySelector(".total-price-value").innerText = `${totalPrice}€`;
}

function currentSelectedQuantity() {
  return document.querySelector(".product-quantity")?.value || 1;
}

function currentSelectedTransport() {
  return document.querySelector("#omniva_select2")?.value || "";
}

function currentSelectedTransportName() {
  const omnivaSelect = document.querySelector("#omniva_select2");
  return omnivaSelect.options[omnivaSelect.selectedIndex].innerText || "";
}

async function updatePrice(e) {
  document.querySelector("#submitBtn").disabled = true;

  document.querySelector(".spinner-total-price").classList.remove("hidden");
  document.querySelector(".total-price-value").style.display = "none";
  const response = await fetch(
    `https://laptap.herokuapp.com/payment-intent/prices/${localStorage.getItem(
      "paymentId"
    )}`,
    {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quantity: currentSelectedQuantity(),
        transport: currentSelectedTransport(),
      }),
    }
  );

  const { unitPrice, productsPrice, quantity, transportPrice, totalPrice } =
    await response.json();
  document.querySelector("#submitBtn").disabled = false;

  /* FIRST MAKE SURE THERE ARE NO ERRORS */

  document.querySelector(".total-price-value").style.display = "inline";
  document.querySelector(".spinner-total-price").classList.add("hidden");

  productsPriceText(quantity, unitPrice, productsPrice);
  transportPriceText(transportPrice);
  totalPriceText(totalPrice);
}

async function initialize() {
  document.querySelector("#submitBtn").disabled = false;

  document
    .querySelector(".product-quantity")
    .addEventListener("change", updatePrice);

  setPaymentELLoading(true);

  const response = await fetch("https://laptap.herokuapp.com/payment-intent", {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quantity: 1,
      transport: "",
    }),
  });

  const {
    clientSecret,
    unitPrice,
    productsPrice,
    transportPrice,
    quantity,
    totalPrice,
    id,
  } = await response.json();
  localStorage.setItem("paymentId", id);
  productsPriceText(quantity, unitPrice, productsPrice);
  transportPriceText(transportPrice);
  totalPriceText(totalPrice);
  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#63d9b6",
      colorText: "#495057",
      fontSizeBase: "10px",
      borderRadius: "5px",
      fontFamily: "Poppins, sans-serif",
      fontWeightNormal: 500,
      spacingUnit: "4px",
    },

    rules: {
      ".Label": {
        fontSize: "1.8rem",
        fontFamily: "Poppins, sans-serif",
      },
      ".Input": {
        fontSize: "1.8rem",
        fontFamily: "inherit",
        transition: "all 0.15s",
      },
      ".input:focus": {
        border: "2px solid #63d9b6",
      },
      ".Input--invalid": {
        fontSize: "1.2rem",
      },
    },
  };

  elements = stripe.elements({
    appearance,
    clientSecret,
    fonts: [
      {
        cssSrc: "https://fonts.googleapis.com/css2?family=Poppins",
      },
    ],
  });

  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");

  paymentElement.on("ready", function () {
    setPaymentELLoading(false);
  });
}

async function handleSubmit(e) {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const name = document.querySelector("#name").value;
  const phone = document.querySelector("#phone").value;

  fetch(
    `https://laptap.herokuapp.com/payment-intent/metadata/${localStorage.getItem(
      "paymentId"
    )}`,
    {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        fullName: name,
        phone,
        transport: currentSelectedTransportName(),
      }),
    }
  );
  setSubmitLoading(true);

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: "https://laptap.herokuapp.com/after-payment",
    },
  });
  if (error.type === "card_error" || error.type === "validation_error") {
    showMessage(error.message);
  } else {
    showMessage("An unexpected error occured.");
  }
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageText.textContent = "";
  }, 4000);
}

function fetchWithTimeout(link, timeout) {}

// Show a spinner on payment submission
function setPaymentELLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submitBtn").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#payment-element").classList.add("hidden");
    //  document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submitBtn").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#payment-element").classList.remove("hidden");

    // document.querySelector("#button-text").classList.remove("hidden");
  }
}

function setSubmitLoading(isLoading) {
  if (isLoading) {
    const submitBtns = document.querySelectorAll(".btn-order-2, .btn-order-1");
    submitBtns.forEach(function (btn) {
      btn.disabled = true;
      btn.style.opacity = 0.6;
    });
  }
}
