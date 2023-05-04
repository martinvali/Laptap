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
  omnivaSelect.addEventListener("change", updatePrice);
});

initialize();

document
  .querySelector("#payment-form")
  .addEventListener("submit", handleSubmit);

document
  .querySelector(".discount-apply")
  .addEventListener("click", checkDiscount);

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

function hideDiscountText() {
  const discountPriceText = document.querySelector(".discount-price");
  discountPriceText.style.visibility = "hidden";
  discountPriceText.style.position = "absolute";
}

function discountText(discount) {
  const discountPriceText = document.querySelector(".discount-price");
  discountPriceText.style.visibility = "visible";
  discountPriceText.style.position = "relative";
  document.querySelector(".discount-price-value").innerText = `${discount}€`;
}
function currentSelectedQuantity() {
  return document.querySelector(".product-quantity")?.value || 1;
}

function currentSelectedTransport() {
  return document.querySelector("#omniva_select2")?.value || "";
}

function currentDiscountCode() {
  return document.querySelector(".discount")?.value || "";
}

function currentSelectedTransportName() {
  const omnivaSelect = document.querySelector("#omniva_select2");
  return omnivaSelect.options[omnivaSelect.selectedIndex].innerText || "";
}

async function updatePrice() {
  try {
    document.querySelector("#submitBtn").disabled = true;

    document.querySelector(".spinner-total-price").classList.remove("hidden");
    document.querySelector(".total-price-value").style.display = "none";

    const { signal, timeoutId } = createAbortSignal(10000);
    const response = await fetch(
      `https://laptap-backend.onrender.com/payment-intent/prices/${localStorage.getItem(
        "paymentId"
      )}`,
      {
        method: "POST",
        signal,
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: currentSelectedQuantity(),
          transport: currentSelectedTransport(),
        }),
      }
    );
    clearInterval(timeoutId);

    const { unitPrice, productsPrice, quantity, transportPrice, totalPrice } =
      await response.json();
    document.querySelector("#submitBtn").disabled = false;

    document.querySelector(".total-price-value").style.display = "inline";
    document.querySelector(".spinner-total-price").classList.add("hidden");

    productsPriceText(quantity, unitPrice, productsPrice);
    transportPriceText(transportPrice);
    totalPriceText(totalPrice);
  } catch (e) {
    console.log(e);
  }
}

async function initialize() {
  try {
    document.querySelector("#submitBtn").disabled = false;

    document
      .querySelector(".product-quantity")
      .addEventListener("change", updatePrice);

    setPaymentELLoading(true);
    const { signal, timeoutId } = createAbortSignal(15000);
    const response = await fetch(
      "https://laptap-backend.onrender.com/payment-intent",
      {
        method: "POST",
        mode: "cors",
        signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: 1,
          transport: "",
        }),
      }
    );

    clearInterval(timeoutId);
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
        ".Error": {
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
  } catch (e) {
    console.log(e);
  }
}

async function checkDiscount(e) {
  try {
    e.preventDefault();
    document.querySelector(".spinner-total-price").classList.remove("hidden");
    document.querySelector(".total-price-value").style.display = "none";

    const { signal, timeoutId } = createAbortSignal(10000);
    const response = await fetch(
      `https://laptap-backend.onrender.com/discount-code/${localStorage.getItem(
        "paymentId"
      )}`,
      {
        method: "POST",
        signal,
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: currentSelectedQuantity(),
          transport: currentSelectedTransport(),
          code: currentDiscountCode(),
        }),
      }
    );
    clearInterval(timeoutId);

    const responseJSON = await response.json();
    document.querySelector(".total-price-value").style.display = "inline";
    document.querySelector(".spinner-total-price").classList.add("hidden");
    document.querySelector("#submitBtn").disabled = false;

    const {
      quantity,
      unitPrice,
      productsPrice,
      transportPrice,
      totalPrice,
      discount,
    } = responseJSON;
    productsPriceText(quantity, unitPrice, productsPrice);
    transportPriceText(transportPrice);
    totalPriceText(totalPrice);
    if (discount === "none") {
      hideDiscountText();
    } else {
      discountText(discount);
    }
  } catch (e) {
    console.log(e);
  }
}

async function handleSubmit(e) {
  try {
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const name = document.querySelector("#name").value;
    const phone = document.querySelector("#phone").value;
    fetch(
      `https://laptap-backend.onrender.com/payment-intent/metadata/${localStorage.getItem(
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
        return_url: "https://laptap-backend.onrender.com/after-payment",
        receipt_email: email,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setSubmitLoading(false);
    } else {
      setSubmitLoading(false);

      showMessage(
        "Midagi läks valesti",
        "Palun värskendage lehte, et uuesti proovida."
      );
    }
  } catch (e) {
    showMessage(
      "Midagi läks valesti",
      "Palun värskendage lehte, et uuesti proovida."
    );
    console.log(e);
  }
}

// ------- UI helpers -------

function showMessage(heading, message) {
  const messageContainer = document.querySelector(".error-msg");

  messageContainer.classList.remove("hidden");
  messageContainer.querySelector(".error-heading").textContent = heading;
  messageContainer.querySelector(".error-text").textContent = message;

  document.querySelector(".ok-btn").addEventListener("click", function () {
    document.querySelector(".error-msg").classList.add("hidden");
  });
}

function createAbortSignal(timeout) {
  const abortController = new AbortController();
  const signal = abortController.signal;

  const timeoutId = setTimeout(() => {
    abortController.abort();
    console.log("abort");
    showMessage(
      "Midagi läks valesti",
      "Palun värskendage lehte, et uuesti proovida"
    );
  }, timeout);

  return { signal, timeoutId };
}

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

    // document.querySelector("#button-text")f.classList.remove("hidden");
  }
}

function setSubmitLoading(isLoading) {
  console.log(isLoading);
  if (isLoading) {
    const submitBtns = document.querySelectorAll(".btn-order-2, .btn-order-1");
    submitBtns.forEach(function (btn) {
      btn.disabled = true;
      btn.style.opacity = 0.6;
    });
  } else if (!isLoading) {
    const submitBtns = document.querySelectorAll(".btn-order-2, .btn-order-1");
    submitBtns.forEach(function (btn) {
      btn.disabled = false;
      btn.style.opacity = 1;
    });
  }
}
