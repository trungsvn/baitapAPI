/*---------- UTILITIES ----------*/

// format giá ra tiền Việt
function formatPrice(price) {
  const formattedPrice = parseFloat(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  return formattedPrice;
}


/*---------- INITIALIZES  ----------*/

// load sản phẩm từ API (kết hợp Bootpag)
let products = [];

function getProductList() {
  let promise = axios({
    url: 'https://649d36a19bac4a8e669d62a2.mockapi.io/product',
    method: 'GET',
  });

  promise
    .then(function (result) {
      console.log('result: ', result.data);
      products = result.data;
      renderProductList(products, 1);
      renderPagination();
    })
    .catch(function (error) {
      console.log(error);
    });
}

getProductList();

// load giỏ hàng từ local storage
function loadCart() {
  const data = localStorage.getItem('cart');
  if (data) {
    const items = JSON.parse(data);
    cart = new Cart();
    cart.items = items;
  } else {
    cart = new Cart();
  }
  renderCartItems();
  renderCartTotal();
}

loadCart();


/*---------- CONTROLLERS ----------*/

// reset toàn bộ select về mặc định
$(document).ready(function () {
  $("select").val("");
});


// đóng mở bảng filter
$("#toggleFilterTable").on("click", function () {
  $("#filterTable").toggleClass("d-none");
});


//đổi icon nút filter
$("#toggleFilterTable").on("click", function () {
  $(this).toggleClass("fa-angles-down fa-angles-up");
});


// đóng mở giỏ hàng
$(document).ready(function () {
  // giỏ hàng tự đóng khi click bên ngoài ngoại trừ click vào những vùng này:
  $(document).on('click', function (e) {
    if (!$(e.target).closest('#cartZone').length && !$(e.target).closest('#cartIcon').length && !$(e.target).closest('#cartAccordion').length && !$(e.target).hasClass('btn-add-to-cart') && !$(e.target).hasClass('btnRemoveOrder')) {
      $('#cartZone').hide();
    }
  });
  // đóng mở bằng icon giỏ hàng
  $('#cartIcon, #cartIcon .fa-shopping-cart').on('click', function () {
    cart = Cart.localStorageLoad();
    renderCartItems();
    renderCartTotal();
    $('#cartZone').toggle();
  });
});


// xóa sản phẩm khỏi giỏ hàng
function deleteCartItem() {
  const productId = $(this).data('productId');
  const index = cart.items.findIndex((item) => item.id === productId);
  if (index !== -1) {
    cart.items.splice(index, 1);
    cart.localStorageSave();
    renderCartItems();
    renderCartTotal();
  }
}


// thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
  const product = products.find((product) => product.id === productId);
  if (product) {
    const productName = product.name;
    const price = parseFloat(product.price);
    const quantity = parseInt($('#quantity-input').val());
    const image = product.image;
    // nếu có sản phẩm trùng tên và status thì cộng dồn số lượng
    const existingCartItem = cart.items.find(
      (item) => item.name === productName && item.status === 'chưa đặt hàng'
    );
    if (isNaN(quantity)) {
      alert('Số lượng không hợp lệ');
      return;
    }
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      const newItem = new CartItem(productName, price, quantity, image);
      cart.addItem(newItem);
    }
    renderCartItems();
    // đóng modal thêm sản phẩm và mở modal / accordion giỏ hàng 
    const productDiv = $(`.product[data-name="${productName}"]`);
    productDiv.addClass('product-saved');
    $('#cartZone').show();
    cart.localStorageSave();
    $('#addProductModal').modal('hide');
    $('#cartAddCollapse').collapse('show');

  } else {
    console.error('error');
  }
}


//gắn chức năng cho nút thêm vào giỏ hàng
$(document).on('click', '.btn-add-to-cart', function (event) {
  const productId = $(this).data('productId');
  addToCart(productId);
  event.preventDefault();
  event.stopPropagation();
});


//reset animation của icon giỏ hàng
function resetIconAnimation() {
  const cartIcon = $('#cartIcon');
  cartIcon.removeClass('ani-tumbler');
  cartIcon.addClass('paused');
  $('#exclamation').remove();
}

//nút reset toàn bộ giỏ hàng
$('#btnReset').click(function () {
  if (confirm('Xác nhận reset?')) {
    cart.items = [];
    cart.localStorageSave();
    renderCartItems();
    resetIconAnimation();
  }
});


// xóa sản phẩm trong giỏ hàng
$(document).on('click', '.btnRemoveAdd', function (e) {
  e.stopPropagation();
  const productName = $(this).data('name');
  const itemToRemove = cart.items.find((item) => item.name === productName && item.status === 'chưa đặt hàng');
  if (itemToRemove) {
    cart.deleteItem(itemToRemove);
    renderCartItems();
  }
});

// xóa sản phẩm đã đặt hàng 
$(document).on('click', '.btnRemoveOrder', function () {
  const productName = $(this).data('name');
  const index = cart.items.findIndex((item) => item.name === productName && item.status === 'đã đặt hàng');
  if (index !== -1) {
    cart.items.splice(index, 1);
    cart.localStorageSave();
    renderCartItems();
    renderCartTotal();
  }
});

// chức năng đặt hàng
$('#btnOrder').click(function () {
  const addedItems = $('.cart-item');
  const orderedItems = $('.order-item');
  const orderTable = $('.cart-table-order');
  if (addedItems.children().length === 0) {
    alert('Không có sản phẩm trong giỏ hàng');
    return;
  }
  if (confirm('Xác nhận đặt hàng?')) {
    const itemsToMove = cart.items.filter((item) => item.status === 'chưa đặt hàng');
    for (const item of itemsToMove) {
      item.status = 'đã đặt hàng';
    }
    renderCartItems();
    renderOrderItems();
    //chỉnh tổng tiền cho riêng các sản phẩm đã đặt hàng
    let totalOrderPrice = 0;
    for (const orderItem of cart.items) {
      if (orderItem.status === 'đã đặt hàng') {
        totalOrderPrice += orderItem.price * orderItem.quantity;
      }
    }
    $('.order-total').text(formatPrice(totalOrderPrice));
    addedItems.empty();
    orderTable.show();
    $('#cartOrderHeading > button').click();
    cart.localStorageSave();
    resetIconAnimation();
  }
});


//search sản phẩm trong trong ô input
$("#searchTool-index").on("input", function () {
  let searchValue = $("#searchTool-index").val().toLowerCase().replace(/[\.,]/g, "");
  let searchNumber = parseFloat(searchValue);
  let filteredProducts = products.filter(product => {
    let productInfo = Object.values(product).join(" ").toLowerCase().replace(/[\.,]/g, "");
    if (productInfo.includes(searchValue)) {
      return true;
    } else if (!isNaN(searchNumber)) {
      let numbersInProduct = productInfo.match(/\d+(\.\d+)?/g);
      if (numbersInProduct) {
        return numbersInProduct.some(num => {
          num = parseFloat(num);
          return num >= searchNumber * 0.9 && num <= searchNumber * 1.1;
        });
      }
    }
    return false;
  });
  renderProductList(filteredProducts, 1);
});


//filter sản phẩm 
function filterProducts() {
  let branchValue = $("#branchSelect").val();
  let priceValue = $("#priceSelect").val();
  let typeValue = $("#typeSelect").val();
  let speedValue = $("#speedSelect").val();
  let colorValue = $("#colorSelect").val();
  let paperValue = $("#paperSelect").val();
  let filteredProducts = products.filter(product => {
    if (branchValue) {
      if (branchValue === "other") {
        if (["SHARP", "RICOH", "HP"].includes(product.branch)) {
          return false;
        }
      } else if (product.branch !== branchValue) {
        return false;
      }
    }
    if (priceValue) {
      switch (priceValue) {
        case "under 30":
          if (product.price > 30e+6) {
            return false;
          }
          break;
        case "30 to 60":
          if (product.price < 30e+6 || product.price > 60e+6) {
            return false;
          }
          break;
        case "60 to 100":
          if (product.price < 60e+6 || product.price > 100e+6) {
            return false;
          }
          break;
        case "above 100":
          if (product.price < 100e+6) {
            return false;
          }
          break;
      }
    }
    if (typeValue && product.type !== typeValue) {
      return false;
    }
    if (speedValue) {
      let [minSpeed, maxSpeed] = speedValue.split("-");
      if (minSpeed && product.speed < minSpeed) {
        return false;
      }
      if (maxSpeed && product.speed > maxSpeed) {
        return false;
      }
    }
    if (colorValue && product.color !== colorValue) {
      return false;
    }
    if (paperValue && product.paper !== paperValue) {
      return false;
    }
    return true;
  });
  if (filteredProducts.length === 0) {
    $(".product-show").html("<p>Không có sản phẩm nào phù hợp với tiêu chí đã chọn.</p>");
    return;
  }
  else {
    renderProductList(filteredProducts, 1);
  }
}

$("select").on("change", filterProducts);