const stripe = Stripe(
  "pk_test_51JktFJH7IkGhuWpe7itZiKGgaDMwn2sZGbbdIRsxm8ka8I6uZHAY28HLgBi5XSobhyAWO4674Kev5oImt3eh9SVw00qf1e32SH"
);

const wd2 = new OmnivaWidget({
  compact_mode: true, // Compact widget is not shown
  // If enabled only a dropdown with locations will be shown

  show_offices: true, // Post offices will be shown
  // If disabled post offices will not be shown in the dropdown

  custom_html: false, // Predefined HTML is activated
  // It is allowed to create a custom HTML                                // It will be included in the container

  id: 2, // Will be added to the unique element ids if
  // there is a need to have more than one widget

  selection_value: "", // Preselected value. (case insensitive, will be trimmed) Can be empty or entirely omitted. Optional
});

const item = [{ id: "prod_KXEBEYAwVhIrTA" }];

let elements;

initialize();

document
  .querySelector("#payment-form")
  .addEventListener("submit", handleSubmit);

async function initialize() {
  const response = await fetch(
    "https://laptap.herokuapp.com/create-checkout-session"
  );
  const { clientSecret } = await response.json();

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#63d9b6",
      colorText: "#1b5c49",
    },
  };
  elements = stripe.elements({ appearance, clientSecret });

  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");
}

window.addEventListener("load", function () {
  console.log("loaded");
})
