alert("There's an issue with the image because its path is set to static, which is why it's not working.")

let productNameInput = document.getElementById("productName"),
  productPriceInput = document.getElementById("productPrice"),
  productCatInput = document.getElementById("productCat"),
  productDescInput = document.getElementById("productDesc"),
  imageInput = document.getElementById("image");

var errorMsg;

let searchInput = document.getElementById("searchInput"),
  selectCategory = document.getElementById("selectCategory"),
  opt = document.getElementById("opt");

let confirmUpdateBtn = document.getElementById("confirmUpdate"),
  cancelUpdateBtn = document.getElementById("cancelUpdateBtn"),
  addItemBtn = document.getElementById("addItem");

let visibleLastDelete = document.getElementById("visible"),
  hideLastDelete = document.getElementById("hide"),
  deletedBox = document.getElementById("lastDelete");

var productIndex, beforeUpdate, beforeDeleted;

let productsContainer = [];
if (localStorage.getItem("products") !== null) {
  productsContainer = JSON.parse(localStorage.getItem("products"));
  appendCategory();
  display();
}

function appendProductCard(i) {
  return `
    <div class="col-md-6 col-lg-4 align-items-center py-4" style="user-select: none;">
    <div class="card product-card shadow-lg rounded" style="user-select: text;">
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
  if (
    validateInputs(productNameInput, "invalidNameMsg") &&
    validateInputs(productPriceInput, "invalidPriceMsg") &&
    validateInputs(productCatInput, "invalidCategoryMsg") &&
    validateInputs(imageInput, "invalidImgMsg") &&
    validateInputs(productDescInput, "invalidDescMsg")
  ) {
    let product = {
      productName: productNameInput.value
        .trim()
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
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
  beforeUpdate = productsContainer[index];
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
  if (
    validateInputs(productNameInput, "invalidNameMsg") &&
    validateInputs(productPriceInput, "invalidPriceMsg") &&
    validateInputs(productCatInput, "invalidCategoryMsg") &&
    validateInputs(imageInput, "invalidImgMsg") &&
    validateInputs(productDescInput, "invalidDescMsg")
  ) {
    productsContainer.splice(productIndex, 0, beforeUpdate);
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
}

// [ 4.2 ]
function cancelUpdate() {
  productsContainer.splice(productIndex, 0, beforeUpdate);
  display();
  clearInputs();
  confirmUpdateBtn.classList.add("d-none");
  cancelUpdateBtn.classList.add("d-none");
  addItemBtn.classList.remove("d-none");
}

// [ 5 ]
function deleteItem(index) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: "mx-4",
  });
  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      height: "100vh",
      text: "You won't be able to revert this!",
      imageWidth: "80%",
      imageUrl: productsContainer[index].image,
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "No, cancel",
      backdrop: `
    rgba(0,0,123,0.4)
    left top
    no-repeat
  `,
      reverseButtons: false,
    })
    .then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem(
          "productsDeleted",
          JSON.stringify(productsContainer[index])
        );
        productsContainer.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(productsContainer));
        display();
        location.reload();
        getCategory();
      }
    });
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
- Toggle Between Disabled { true OR false } For Confirm Update 
=================================
*/

function visibleUpdateButton(input) {
  if (addItemBtn.classList.contains("d-none")) {
    if (input.value !== beforeUpdate[input.id]) {
      confirmUpdateBtn.disabled = false;
    } else {
      confirmUpdateBtn.disabled = true;
    }
  }
}

/*
=================================
- Toggle Between Show And Hide Delete Box
=================================
*/

// function visibleDeleteBox() {
//   deletedBox.style.left = "0";
//   hideLastDelete.classList.remove("d-none");
//   visibleLastDelete.classList.add("d-none");
// }

// function hideDeleteBox() {
//   deletedBox.style.left = "-15.4%";
//   hideLastDelete.classList.add("d-none");
//   visibleLastDelete.classList.remove("d-none");
// }

// function viewProduct() {
//   const swalWithBootstrapButtons = Swal.mixin({
//     customClass: {
//       confirmButton: "btn btn-success",
//       cancelButton: "btn btn-danger",
//     },
//     buttonsStyling: "mx-4",
//   });
//   swalWithBootstrapButtons
//     .fire({
//       title: "Muhammed Essam Bek",
//       height: "100vh",
//       text: "You won't be able to revert this!",
//       imageWidth: "80%",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it",
//       cancelButtonText: "No, cancel",
//       backdrop: `
//     rgba(0,0,123,0.4)
//     left top
//     no-repeat
//   `,
//       reverseButtons: false,
//     })
//     .then((result) => {
//       if (result.isConfirmed) {
//         console.log("mo");
//       }
//     });
// }

function validateInputs(input, inputMsgId) {
  let re = {
    productName: /^[A-Z][a-zA-Z0-9]*( [A-Z0-9][a-z0-9]*)*$/,
    productPrice: /^\d{2,5}$/,
    productCat: /^([A-Z][a-zA-Z0-9]*)( [A-Z][a-z0-9]*)*$/,
    image: /^.{1,}\.(jpg|jpeg|svg|png|webp)$/,
    productDesc: /^.{3,}$/m,
  };
  errorMsg = document.getElementById(inputMsgId);
  console.log(errorMsg);
  if (re[input.id].test(input.value)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    errorMsg.classList.add("d-none");
    return true;
  } else {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    errorMsg.classList.remove("d-none");
    return false;
  }
}
