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
  addItemBtn = document.getElementById("addItem");

let productIndex, beforeDeleted;

let productsContainer = [];

if (localStorage.getItem("products") !== null) {
  productsContainer = JSON.parse(localStorage.getItem("products"));
  appendCategory();
  display();
}

// [ 1 ]
function addProduct() {
  let product = {
    productName: productNameInput.value
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
    image: `images/sam_m54.webp`,
  };
  productsContainer.push(product);
  localStorage.setItem("products", JSON.stringify(productsContainer));
  clearInputs();
  display();
  console.log(productsContainer);
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
    products += `
    <div class="col-md-6 col-lg-4 align-items-center py-4">
    <div class="card product-card shadow-lg rounded">
              <picture>
                <img src="${productsContainer[i].image}" class="card-img-top" alt="Product Image w-100">
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
              <div class="btns mb-4 d-flex justify-content-evenly align-items-center">
                <button href="#" class="btn btn-success m-2 py-2 px-5 w-75" onclick="updateItem(${i})">Update</button>
                <button href="#" class="btn btn-danger m-2 py-2 px-5 w-75" onclick="deleteItem(${i})">Delete</button>
              </div>
            </div>
          </div>
    `;
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
  localStorage.setItem("products", JSON.stringify(productsContainer));
  display();
  clearInputs();
  confirmUpdateBtn.classList.add("d-none");
  addItemBtn.classList.remove("d-none");
  location.reload();
  getCategory();
}

// [ 5 ]
function deleteItem(index) {
  productsContainer.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(productsContainer));
  display();
  console.log(productsContainer[index]);
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
      products += `
      <div class="col-md-6 col-lg-4 align-items-center py-4">
      <div class="card product-card shadow-lg rounded">
          <picture>
            <img src="${productsContainer[i].image}" class="card-img-top" alt="Product Image w-100">
          </picture>
          <div class="card-body">
          <h5 class="card-title"><Span class="fw-bold">Type: </Span> ${productsContainer[i].productName}</h5>
          <p class="card-text mb-2">
          <Span class="fw-bold">Category: </Span>
          ${productsContainer[i].productCat}
            </p>
            <p class="card-text">
              <Span class="fw-bold">Description: </Span>
              ${productsContainer[i].productDesc}
            </p>
            <h6 class="card-subtitle mb-2 text-muted"><Span class="fw-bold">Price: </Span> ${productsContainer[i].productPrice}</h6>
          </div>
          <div class="btns mb-4 d-flex justify-content-evenly align-items-center">
          <button href="#" class="btn btn-primary m-2 py-2 px-5" onclick="updateItem(${i})">Update</button>
            <button href="#" class="btn btn-danger m-2 py-2 px-5" onclick="deleteItem(${i})">Delete</button>
          </div>
        </div>
      </div>
      `;
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
      console.log(selectCategory.value);
      console.log(productsContainer[i].productCat);
      products += `
      <div class="col-md-6 col-lg-4 align-items-center py-4">
      <div class="card product-card shadow-lg rounded">
        <picture>
          <img src="${productsContainer[i].image}" class="card-img-top" alt="Product Image w-100">
        </picture>
          <div class="card-body">
            <h5 class="card-title"><Span class="fw-bold">Type: </Span> ${productsContainer[i].productName}</h5>
            <p class="card-text mb-2">
            <Span class="fw-bold">Category: </Span>
            ${productsContainer[i].productCat}
              </p>
              <p class="card-text">
                <Span class="fw-bold">Description: </Span>
                ${productsContainer[i].productDesc}
              </p>
              <h6 class="card-subtitle mb-2 text-muted"><Span class="fw-bold">Price: </Span> ${productsContainer[i].productPrice}</h6>
          </div>
          <div class="btns mb-4 d-flex justify-content-evenly align-items-center">
          <button href="#" class="btn btn-primary py-2 px-5" onclick="updateItem(${i})">Update</button>
            <button href="#" class="btn btn-danger py-2 px-5" onclick="deleteItem(${i})">Delete</button>
          </div>
        </div>
      </div>
      `;
    }
  }
  document.getElementById("productsData").innerHTML = products;
}
