// alert("Fix Search When No Items => search method()")

let productNameInput = document.getElementById("productNameInput"),
  productPriceInput = document.getElementById("productPriceInput"),
  productCatInput = document.getElementById("productCatInput"),
  productDescInput = document.getElementById("productDescInput"),
  imageInput = document.getElementById("imageInput");

let searchInput = document.getElementById("searchInput"),
  selectCategory = document.getElementById("selectCategory"),
  opt = document.getElementById("opt");

let confirmUpdateBtn = document.getElementById("confirmUpdate"),
  cancelUpdateBtn = document.getElementById("cancelUpdateBtn"),
  addItemBtn = document.getElementById("addItem");

let allInputs = document.querySelectorAll("input.change");

let productIndex, beforeDeleted;

let productsContainer = [];

if (localStorage.getItem("products") !== null) {
  productsContainer = JSON.parse(localStorage.getItem("products"));
  appendCategory();
  display();
}

function appendProductCard(i) {
  return `
    <div class="col-md-6 col-lg-4 align-items-center py-4">
    <div class="card product-card shadow-lg rounded">
              <picture>
                <img src="${productsContainer[i].image}" class="card-img-top w-100" alt="Product Image">
              </picture>
              <div class="card-body">
              <h2 class="h5 card-title"><Span class="fw-bold">Type: </Span> ${productsContainer[i].productName}</h2>
              <p class="card-text mb-2">
              <Span class="fw-bold">Category: </Span>
              ${productsContainer[i].productCat}
              </p>
                <p class="card-text">
                  <Span class="fw-bold">Description: </Span>
                  ${productsContainer[i].productDesc}
                  </p>
                <h3 class="h6 card-subtitle mb-2 text-muted"><Span class="fw-bold">Price: </Span> $${productsContainer[i].productPrice}</h3>
              </div>
              <div class="btns mb-4 d-flex justify-content-center align-items-center">
                <button href="#" class="btn btn-warning m-2 py-2 px-3 d-flex justify-content-center align-items-center" onclick="updateItem(${i})"><i class="fa-solid fa-pen-to-square me-2"></i>Update</button>
                <button href="#" class="btn btn-danger m-2 py-2 px-3 d-flex justify-content-center align-items-center" onclick="deleteItem(${i})"><i class="fa-solid fa-trash me-2"></i> Delete</button>
              </div>
            </div>
          </div>
    `;
}

// [ 1 ]
function addProduct() {
  let product = {
    productName: productNameInput.value
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" "),
    productPrice: productPriceInput.value
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    productCat: productCatInput.value
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    productDesc: productDescInput.value
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    image: imageInput.files[0]
      ? `images/${imageInput.files[0]?.name}`
      : `images/1.jpg`,
  };
  productsContainer.push(product);
  localStorage.setItem("products", JSON.stringify(productsContainer));
  clearInputs();
  display();
  location.reload();
}

// [ 2 ]
function clearInputs() {
  productNameInput.value = null;
  productPriceInput.value = null;
  productCatInput.value = null;
  productDescInput.value = null;
  imageInput.value = null;
}

// [ 3 ]
function display() {
  let products = ``;
  for (let i = 0; i < productsContainer.length; i++) {
    products += appendProductCard(i);
  }
  document.getElementById("productsData").innerHTML = products;
}

// [ 4 ]
function updateItem(index) {
  productIndex = index;
  beforeDeleted = productsContainer[index];
  productNameInput.value = productsContainer[index].productName;
  productPriceInput.value = productsContainer[index].productPrice;
  productCatInput.value = productsContainer[index].productCat;
  productDescInput.value = productsContainer[index].productDesc;
  productsContainer.splice(index, 1);
  display();
  confirmUpdateBtn.classList.remove("d-none");
  cancelUpdateBtn.classList.remove("d-none");
  addItemBtn.classList.add("d-none");
  getCategory();
}

// [ 4.1 ]
function confirmUpdate() {
  productsContainer.splice(productIndex, 0, beforeDeleted);
  productsContainer[productIndex].productName = productNameInput.value;
  productsContainer[productIndex].productPrice = productPriceInput.value;
  productsContainer[productIndex].productCat = productCatInput.value;
  productsContainer[productIndex].productDesc = productDescInput.value;
  productsContainer[productIndex].image = imageInput.files[0]
    ? `images/${imageInput.files[0]?.name}`
    : `images/1.jpg`;
  localStorage.setItem("products", JSON.stringify(productsContainer));
  display();
  clearInputs();
  confirmUpdateBtn.classList.add("d-none");
  cancelUpdateBtn.classList.add("d-none");
  addItemBtn.classList.remove("d-none");
  location.reload();
  getCategory();
}

// [ 5 ]
function deleteItem(index) {
  productsContainer.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(productsContainer));
  display();
  location.reload();
  getCategory();
}

// [ 6 ]
function search() {
  let products = ``;
  for (let i = 0; i < productsContainer.length; i++) {
    if (
      productsContainer[i].productName
        .toLowerCase()
        .includes(searchInput.value.toLowerCase())
    ) {
      products += appendProductCard(i);
    }
  }
  if (products == "") {
    products += `
        <div id="notFound">
          <div class="container mt-5 text-center">
          <div class="not-found-card">
            <h2 class="text-primary">Product Not Found</h2>
            <p class="lead text-secondary text-capitalize">we couldn't find the product you're looking for.</p>
          </div>
        </div>
          `;
  }

  document.getElementById("productsData").innerHTML = products;
}

function appendCategory() {
  let cat = ``,
    uniqueCategory = [];
  for (let i = 0; i < productsContainer.length; i++) {
    if (uniqueCategory.indexOf(productsContainer[i].productCat) == -1) {
      uniqueCategory.push(productsContainer[i].productCat);
      cat += `
      <option id="opt" class="opt" value="${productsContainer[i].productCat}">${productsContainer[i].productCat}</option>
      `;
    }
  }
  selectCategory.innerHTML += cat;
}

function getCategory() {
  let products = ``;
  for (let i = 0; i < productsContainer.length; i++) {
    if (selectCategory.value === productsContainer[i].productCat) {
      products += appendProductCard(i);
    } else if (selectCategory.value === "all") {
      products += appendProductCard(i);
    }
  }

  document.getElementById("productsData").innerHTML = products;
}

/*
=================================
- Important Function
- To Custom Disabled Confirm BTN
=================================
*/

// function visibleUpdateButton(input) {
//   console.log(beforeDeleted.productName);
//   if (input.value !== beforeDeleted.productName) {
//     confirmUpdateBtn.disabled = false;
//   } else {
//     confirmUpdateBtn.disabled = true;
//   }
// }