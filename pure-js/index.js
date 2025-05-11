const form = document.getElementById("product-form");
const nameInput = document.getElementById("product-name");
const priceInput = document.getElementById("product-price");
const weightInput = document.getElementById("product-weight");
const productList = document.getElementById("product-list");
const totalDisplay = document.getElementById("total");
const sendButton = document.getElementById("send-button");
const phoneInput = document.getElementById("phone-number");
const shareText = document.getElementById("share-text");
const dingSound = document.getElementById("ding-sound");

let products = JSON.parse(localStorage.getItem("products")) || [];

function renderList() {
  productList.innerHTML = "";
  let total = 0;

  products.forEach((product, index) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = product.checked;

    checkbox.onchange = () => {
      product.checked = checkbox.checked;
      saveProducts();
      renderList();
    };

    const label = document.createElement("label");
    let text = `${product.name} — ${product.price.toFixed(2)} грн`;
    if (product.weight) text += `, ${product.weight}`;

    label.appendChild(checkbox);
    label.append(" " + text);

    if (product.checked) {
      label.style.textDecoration = "line-through";
      label.style.opacity = "0.6";
      total += product.price;
    }

    li.appendChild(label);
    productList.appendChild(li);
  });

  totalDisplay.textContent = `Загальна сума: ${total.toFixed(2)} грн`;

  
  const allText =
    products
      .map((p) => {
        let line = `${p.name} — ${p.price.toFixed(2)} грн`;
        if (p.weight) line += `, ${p.weight}`;
        return line;
      })
      .join("\n") + `\n\nЗагальна сума: ${total.toFixed(2)} грн`;

  shareText.value = allText;
}

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);
  const weight = weightInput.value.trim();

  if (!name || isNaN(price) || price <= 0) return;

  products.push({
    name,
    price,
    weight,
    checked: false,
  });

  form.reset();
  saveProducts();
  renderList();
});

sendButton.addEventListener("click", () => {
  const phone = phoneInput.value.trim();
  const message = shareText.value.trim();

  if (!phone || !message) {
    alert("Введіть номер телефону та заповніть список!");
    return;
  }

  fetch("http://localhost:3000/send-sms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: phone,
      message: message,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        dingSound.play();
        alert("✅ SMS успішно надіслано!");
      } else {
        alert("❌ Помилка: " + data.error);
      }
    })
    .catch((err) => {
      alert("❌ Помилка запиту: " + err.message);
    });
});

renderList();
