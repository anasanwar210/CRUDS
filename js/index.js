let productNameInput = document.getElementById("productNameInput"),
  productPriceInput = document.getElementById("productPriceInput"),
  productCatInput = document.getElementById("productCatInput"),
  productDescInput = document.getElementById("productDescInput"),
  imageInput = document.getElementById("imageInput");

let confirmUpdateBtn = document.getElementById("confirmUpdate"),
  addItemBtn = document.getElementById("addItem");

let productsContainer = [];

if (localStorage.getItem("products") !== null) {
  productsContainer = JSON.parse(localStorage.getItem("products"));
  display();
}

// [ 1 ]
function addProduct() {
  let product = {
    productName: productNameInput.value,
    productPrice: productPriceInput.value,
    productCat: productCatInput.value,
    productDesc: productDescInput.value,
    image: "",
  };
  productsContainer.push(product);
  localStorage.setItem("products", JSON.stringify(productsContainer));
  clearInputs();
  display();
  console.log(productsContainer);
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
          <div class="col-md-4 align-items-center py-4">
            <div class="card product-card shadow-lg rounded">
              <img src="images/1.jpg" class="card-img-top" alt="Product Image">
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
  document.getElementById("productsData").innerHTML = products;
}

// [ 4 ]
let productIndex, beforeDeleted;
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
}

// [ 5 ]
function deleteItem(index) {
  productsContainer.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(productsContainer));
  display();
  console.log(productsContainer[index]);
}
