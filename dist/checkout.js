(()=>{const e=Stripe("pk_test_51JktFJH7IkGhuWpe7itZiKGgaDMwn2sZGbbdIRsxm8ka8I6uZHAY28HLgBi5XSobhyAWO4674Kev5oImt3eh9SVw00qf1e32SH",{locale:"et"});let t;function n(e,t,n){document.querySelector(".product-price-value").textContent=`${e} x ${t} = ${n}€`}function o(e){document.querySelector(".transport-price-value").innerText=`${e}€`}function r(e){document.querySelector(".total-price-value").innerText=`${e}€`}function a(){const e=document.querySelector("#omniva_select2");return e.options[e.selectedIndex].innerText||""}async function c(e){document.querySelector("#submitBtn").disabled=!0,document.querySelector(".spinner-total-price").classList.remove("hidden"),document.querySelector(".total-price-value").style.display="none";const t=await fetch(`https://laptap.herokuapp.com/payment-intent/prices/${localStorage.getItem("paymentId")}`,{method:"POST",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({quantity:document.querySelector(".product-quantity")?.value||1,transport:document.querySelector("#omniva_select2")?.value||""})}),{unitPrice:a,productsPrice:c,quantity:i,transportPrice:s,totalPrice:l}=await t.json();document.querySelector("#submitBtn").disabled=!1,document.querySelector(".total-price-value").style.display="inline",document.querySelector(".spinner-total-price").classList.add("hidden"),n(i,a,c),o(s),r(l)}function i(e){const t=document.querySelector("#payment-message");t.classList.remove("hidden"),t.textContent=e,setTimeout((function(){t.classList.add("hidden"),e.textContent=""}),4e3)}function s(e){e?(document.querySelector("#submitBtn").disabled=!0,document.querySelector("#spinner").classList.remove("hidden"),document.querySelector("#payment-element").classList.add("hidden")):(document.querySelector("#submitBtn").disabled=!1,document.querySelector("#spinner").classList.add("hidden"),document.querySelector("#payment-element").classList.remove("hidden"))}new OmnivaWidget({compact_mode:!0,show_offices:!0,custom_html:!1,show_machines:!0,id:2,selection_value:""}),window.addEventListener("load",(function(){const e=document.querySelector("#omniva_select2"),t=document.createElement("option");t.value="tasuta",t.innerText="TASUTA: Tulen ise järgi Tallinna Lilleküla Gümnaasiumisse",e.required=!0,e.setAttribute("form","payment-form"),e.prepend(t),e.value=t,console.log(e),e.addEventListener("change",c)})),async function(){document.querySelector("#submitBtn").disabled=!1,document.querySelector(".product-quantity").addEventListener("change",c),s(!0);const a=await fetch("https://laptap.herokuapp.com/payment-intent",{method:"POST",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({quantity:1,transport:""})}),{clientSecret:i,unitPrice:l,productsPrice:u,transportPrice:d,quantity:m,totalPrice:p,id:y}=await a.json();localStorage.setItem("paymentId",y),n(m,l,u),o(d),r(p),t=e.elements({appearance:{theme:"stripe",variables:{colorPrimary:"#63d9b6",colorText:"#495057",fontSizeBase:"10px",borderRadius:"5px",fontFamily:"Poppins, sans-serif",fontWeightNormal:500,spacingUnit:"4px"},rules:{".Label":{fontSize:"1.8rem",fontFamily:"Poppins, sans-serif"},".Input":{fontSize:"1.8rem",fontFamily:"inherit",transition:"all 0.15s"},".input:focus":{border:"2px solid #63d9b6"}}},clientSecret:i,fonts:[{cssSrc:"https://fonts.googleapis.com/css2?family=Poppins"}]});const S=t.create("payment");S.mount("#payment-element"),S.on("ready",(function(){s(!1)}))}(),document.querySelector("#payment-form").addEventListener("submit",(async function(n){n.preventDefault();const o=document.querySelector("#email").value,r=document.querySelector("#name").value,c=document.querySelector("#phone").value;fetch(`https://laptap.herokuapp.com/payment-intent/metadata/${localStorage.getItem("paymentId")}`,{method:"POST",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o,fullName:r,phone:c,transport:a()})}),document.querySelectorAll(".btn-order-2, .btn-order-1").forEach((function(e){e.disabled=!0,e.style.opacity=.6}));const{error:s}=await e.confirmPayment({elements:t,confirmParams:{return_url:"https://laptap.herokuapp.com/after-payment"}});"card_error"===s.type||"validation_error"===s.type?i(s.message):i("An unexpected error occured.")}))})();