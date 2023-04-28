category = "";
productList = [];
productNumber = 0;
function getData() {
  return fetch("/static/Data/products.json").then((response) => response.json());
}

function generateCartList() {
  const cartList = JSON.parse(sessionStorage.getItem("cartList")) || [];
  let itemList = "";
  let totalPrice = 0.00;
  cartList.forEach((product) => {
    totalPrice += (product.offer? parseFloat(product.offer) : parseFloat(product.price)) * parseFloat(product.count).toFixed(2);
    itemList += `
    <div class="row cart-item">
      <div class="d-flex justify-content-end mt-2">
        <button type="button" class="btn-close" aria-label="Close" onclick="removeItem(${product.productId})"></button>
      </div>
      <img src=${
        product.imgSrc
      } alt="lipstick" title="lipstick" class="image col-5 p-3">
      <div class="dialog-product-info col-5 mt-4 ml-2">
        <p class="name">${product.product}</p>
        <p class="info-title">${product.productInfo}</p>
        <p>
            Rating: 
            <img src="/static/images/star.png" alt="star" title="star" class="review">
            <img src="/static/images/star.png" alt="star" title="star" class="review">
            <img src="/static/images/star.png" alt="star" title="star" class="review">
        </p>
        <p>Price: $${product.price}</p>

        ${
          product.offer
            ? `<p class="offer">offer Price: $${product.offer}</p>`
            : ""
        }
        <p>Item Count: ${product.count}</p>                    
      </div>
    </div>`;
  });
  const totalPriceHTML = `
    <div class="row total align-items-center">
      <p class="col-5 mb-0">Total Price:</p>
      <p class="col-5 mb-0 py-2">$ ${totalPrice.toFixed(2)}</p> 
    </div>
  `;
  const noItems = `
    <div class="d-flex align-items-center justify-content-center py-3">
      <p>No items in the cart</p>
    </div>`;
  document.querySelector('#myCartBody').innerHTML = cartList.length ? itemList + totalPriceHTML : noItems;
}
function generateProductList(data) {
  let prodListHtml = "";
  data.forEach((product) => {
    const offerString = `<div class="clearance">
                                <p class="price">$ ${product.price}</p>
                                <p> Offer $ ${product.offer}</p>
                            </div>`;
    const noOfferString = `<p>$ ${product.price}</p>`;
    prodListHtml =
      prodListHtml +
      `
                    <div class="product-wrapper">
                        <img src=${
                          product.imgSrc
                        } alt="lipstick" title="lipstick" class="image">
                        <div class="product-info">
                            <p class="name">${product.product}</p>
                            <p class="info-title">${product.productInfo}</p>
                            <p>
                                <img src="/static/images/star.png" alt="star" title="star" class="review">
                                <img src="/static/images/star.png" alt="star" title="star" class="review">
                                <img src="/static/images/star.png" alt="star" title="star" class="review">
                            </p>
                            ${
                              product.offer ? offerString : noOfferString
                            }                    
                        </div>
                        <div class="w-100 d-flex justify-content-end px-3 my-2">
                          <button type="button" class="btn btn-primary pink-btn w-100" data-bs-toggle="modal" data-bs-target="#productModal${
                            product.productId
                          }">
                            Buy
                          </button>
                        </div> 
                    </div>
                    <div class="modal fade" id="productModal${
                      product.productId
                    }" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                      <div class="modal-dialog modal-dialog-centered" role="document">
                          <div class="modal-content">
                              <div class="modal-body py-0">
                                <div class="row">
                                  <img src=${
                                    product.imgSrc
                                  } alt="lipstick" title="lipstick" class="image col-5 p-3">
                                  <div class="dialog-product-info col-5 mt-4 ml-2">
                                    <p class="name">${product.product}</p>
                                    <p class="info-title">${
                                      product.productInfo
                                    }</p>
                                    <p>
                                        Rating: 
                                        <img src="/static/images/star.png" alt="star" title="star" class="review">
                                        <img src="/static/images/star.png" alt="star" title="star" class="review">
                                        <img src="/static/images/star.png" alt="star" title="star" class="review">
                                    </p>
                                    <p>Price: ${product.price}</p>

                                    ${
                                      product.offer
                                        ? `<p class="offer">offer Price: ${product.offer}</p>`
                                        : ""
                                    }                    
                                  </div>
                                </div>
                              </div>
                              <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="close-btn-${
                                  product.productId
                                }">Close</button>
                                <button type="button" class="btn btn-danger" id="${
                                  product.productId
                                }" onclick="buyProduct(event.target.attributes.id.value)">Add to Cart</button>
                              </div>
                          </div>
                      </div>  
                    </div>
                  `;
    //const btn = document.querySelector()
  });
  const element = document.querySelector("#products");
  element.innerHTML = prodListHtml;
}
function setDropdownValue(category) {
  let text = "";
  switch (category) {
    case "All": {
      text = "All Category";
      break;
    }
    case "Hair": {
      text = "Hair Care";
      break;
    }
    case "lotion": {
      text = "Body Care";
      break;
    }
    case "lipcare": {
      text = "Lip Care";
      break;
    }
    case "eyecare": {
      text = "Eye Care";
      break;
    }
  }
  const dropdownElement = document.querySelector(".dropdown-toggle");
  if (dropdownElement) {
    dropdownElement.innerHTML = text;
  }
}
function createProdListHTML(value, name) {
  category = value || category;
  setProductNumber(0);
  if (category) {
    setDropdownValue(category);
  }
  getData().then((data) => {
    productList = data;
    const prodList = data
      .filter(
        (data) => !category || category === "All" || category === data.category
      )
      .filter(
        (data) =>
          !name || data.product.toLowerCase().includes(name.toLowerCase())
      );
    generateProductList(prodList);
  });
}
function setProductNumber(newValue) {
  const currentCart = JSON.parse(sessionStorage.getItem("cartList")) || [];
  const cartElement = document.querySelector("#productNumber");
  productNumber = currentCart.length + newValue;
  if (cartElement) {
    cartElement.innerHTML = productNumber;
  }
}
function buyProduct(id) {
  const product = productList.find((product) => product.productId === id);
  const currentCart = JSON.parse(sessionStorage.getItem("cartList")) || [];
  const prodIndex = currentCart.findIndex(
    (item) => item.productId === product.productId
  );
  let productWithCount = {
    ...product,
    count: 1,
  };
  const elemId = `#close-btn-${id}`;
  if (prodIndex > -1) {
    currentCart[prodIndex].count += 1;
  } else {
    currentCart.push(productWithCount);
  }
  setProductNumber(1);
  sessionStorage.setItem("cartList", JSON.stringify(currentCart));
  productNumber += 1;
  
  document.querySelector(elemId).click();
}

function removeItem(itemId) {
  const cartList = JSON.parse(sessionStorage.getItem("cartList")) || [];
  const newList = cartList.filter((item) => itemId.toString() !== item.productId);
  sessionStorage.setItem("cartList", JSON.stringify(newList));
  generateCartList();
  setProductNumber(0);
}
function clearCart() {
  sessionStorage.clear();
  generateCartList();
  setProductNumber(0);
}
