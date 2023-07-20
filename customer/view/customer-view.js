// render danh sách sản phẩm (kết hợp Bootpag)
function renderProductList(products, currentPage) {
  //chỉnh thông số cho bootpag pagination
  const productsPerPage = 12;
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productShow = $('.product-show');
  const content = products
    .slice(startIndex, endIndex)
    .map((product) => {
      const saved = cart.items.some(
        (item) => item.name === product.name && item.saved
      );
      const productClass = saved ? 'product product-saved' : 'product';
      const formattedPrice = formatPrice(product.price);
      return `
      <div class="${productClass} p-2" data-name="${product.name}">
        <div class="product-img">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info p-2">
          <h3>${product.title}</h3>
          <p class="mb-2">${formattedPrice}</p>
          <button class="btn btn-purchase text-white" data-name="${product.name}">ĐẶT HÀNG NGAY</button>
        </div>
      </div>
      `;
    })
    .join('');
  productShow.html(content);
  // lấy thông tin sản phẩm và load lên modal 
  productShow.on('click', '.btn-purchase', function () {
    const productName = $(this).data('name');
    const product = products.find((product) => product.name === productName);
    renderProductInfo(product);
  });
}


//render Pagination (Bootpag Plugin)
function renderPagination() {
  const productsPerPage = 12;
  const totalPages = Math.ceil(products.length / productsPerPage);
  $('#pagination').bootpag({
    total: totalPages,
    maxVisible: 10,
    page: 1,
  }).on('page', function (event, num) {
    renderProductList(products, num);
  });
}


// Render modal chứa thông tin sản phẩm
function renderProductInfo(product) {
  const { name, id, price, speed, branch, type, color, paper, image, description, spec, option } = product;
  const modal = $('#addProductModal');
  let specContent = '';
  for (const key in spec) {
    if (spec.hasOwnProperty(key)) {
      const value = spec[key];
      const displayName = changeKeyNames[key] || key;
      specContent += `
        <tr>
          <td>${displayName}</td>
          <td>${value}</td>
        </tr>
      `;
    }
  }
  let optionContent = '';
  for (const key in option) {
    if (option.hasOwnProperty(key)) {
      const value = option[key];
      const displayName = changeKeyNames[key] || key;
      optionContent += `
        <tr>
          <td>${displayName}</td>
          <td>${value}</td>
        </tr>
      `;
    }
  }
  modal.find('.product-info').html(`
    <table class="product-attributes">
      <tr>
        <td colspan="2" class="img-cell">
          <img src="${image}" alt="" class="product-img">
        </td>
      </tr>
      <tr>
        <td class="attribute">Model</td>
        <td>${name}</td>
      </tr>
      <tr>
        <td class="attribute">ID</td>
        <td>No. ${id}</td>
      </tr>
      <tr>
        <td class="attribute">Tốc độ in</td>
        <td>${speed}</td>
      </tr>
      <tr>
        <td class="attribute">Hãng</td>
        <td>${branch}</td>
      </tr>
      <tr>
        <td class="attribute">Loại</td>
        <td>${type}</td>
      </tr>
      <tr>
        <td class="attribute">Màu</td>
        <td>${color}</td>
      </tr>
      <tr>
        <td class="attribute">Khổ giấy</td>
        <td>${paper}</td>
      </tr>
      <tr>
        <td class="attribute">Mô tả</td>
        <td>${description}</td>
      </tr>
      <tr>
        <td class="attribute">Thông số</td>
        <td class="sub-attributes">
          <table class="sub-table">
            ${specContent}
          </table>
        </td>
      </tr>
      <tr>
        <td class="attribute">Tùy chọn</td>
        <td class="sub-attributes">
          <table class="sub-table">
            ${optionContent}
          </table>
        </td>
      </tr>
      <tr>
        <td class="attribute">Giá</td>
        <td class="price">${formatPrice(price)}</td>
      </tr>
    </table>
  `);

  modal.find('.btn-add-to-cart').data('productId', id);
  modal.modal('show');
}


// Render tổng tiền trong giỏ hàng
function renderCartTotal() {
  $('#cartTotal').text(formatPrice(cart.totalPrice()));
}


// Render sản phẩm trong giỏ hàng
function renderCartItems() {
  const cartZone = $('.cart-item');
  const orderZone = $('.order-item');
  const cartPrice = $('.cart-total');
  const orderPrice = $('.cart-total-order');
  const cartIcon = $('#cartIcon');
  const exclamation = $('#exclamation');
  const cartItemAddTable = $('.cart-table-add');
  // làm sạch giỏ hàng trước khi render dữ liệu cập nhật
  cartZone.empty();
  orderZone.empty();
  let totalCartPrice = 0;
  let totalOrderPrice = 0;
  for (const cartItem of cart.items) {
    const row = `
      <tr>
        <td>
          <h5>${cartItem.name}</h5>
          <div><img class="" src="${cartItem.image}"></div>
        </td>
        <td class="price">${formatPrice(cartItem.price)}</td>
        <td>${cartItem.quantity}</td>
        <td>${cartItem.status}</td>
        <td>
          ${cartItem.status === 'chưa đặt hàng'
            ? `<i class="btnRemoveAdd fa-solid fa-trash" data-name="${cartItem.name}"></i>`
            : `<i class="btnRemoveOrder fa-solid fa-trash" data-name="${cartItem.name}"></i>`
          }
        </td>
      </tr>
    `;
    // tính riêng tổng tiền của sản phẩm chưa đặt hàng / sản phẩm đã đặt hàng 
    if (cartItem.status === 'chưa đặt hàng') {
      cartZone.append(row);
      totalCartPrice += cartItem.price * cartItem.quantity;
    } else if (cartItem.status === 'đã đặt hàng') {
      orderZone.append(row);
      totalOrderPrice += cartItem.price * cartItem.quantity;
    }
  }
  // trigger animation cho icon khi có sản phẩm trong giỏ hàng
  if (cartItemAddTable.find('.btnRemoveAdd').length === 0) {
    cartIcon.removeClass('ani-tumbler');
    cartIcon.addClass('paused');
    exclamation.remove();
  } else {
    cartIcon.addClass('ani-tumbler');
    if (exclamation.length === 0) {
      cartIcon.append('<div id="exclamation">!</i></div>');
    } else {
      exclamation.show();
    }
  }
  // gắn 2 nút xóa cho sản phẩm chưa đặt hàng và sản phẩm đã đặt hàng
  $('.btnRemoveAdd').click(deleteCartItemAdd);
  $('.btnRemoveOrder').click(deleteCartItemOrder);
  cartPrice.text(formatPrice(totalCartPrice));
  orderPrice.text(formatPrice(totalOrderPrice));
}



// Xóa sản phẩm chưa đặt hàng
function deleteCartItemAdd() {
  const productName = $(this).data('name');
  const index = cart.items.findIndex((item) => item.name === productName && item.status === 'chưa đặt hàng');
  if (index !== -1) {
    cart.items.splice(index, 1);
    cart.localStorageSave();
    renderCartItems();
    renderCartTotal();
  }
}


// Xóa sản phẩm đã đặt hàng
function deleteCartItemOrder() {
  const productName = $(this).data('name');
  const index = cart.items.findIndex((item) => item.name === productName && item.status === 'đã đặt hàng');
  if (index !== -1) {
    cart.items.splice(index, 1);
    cart.localStorageSave();
    renderCartItems();
    renderCartTotal();
  }
}


// Render sản phẩm đã đặt hàng
function renderOrderItems() {
  const orderZone = $('.cart-table-order tbody');
  orderZone.empty();
  for (const cartItem of cart.items) {
    if (cartItem.status === 'đã đặt hàng') {
      const row = `
        <tr>
          <td>
            <h5>${cartItem.name}</h5>
            <div><img class="" src="${cartItem.image}"></div>
          </td>
          <td class=price>${formatPrice(cartItem.price)}</td>
          <td>${cartItem.quantity}</td>
          <td>${cartItem.status}</td>
          <td>
            <i class="btnRemoveOrder fa-solid fa-trash" data-name="${cartItem.name}"</i>
          </td>
        </tr>
      `;
      orderZone.append(row);
    }
  }
}


// Đổi tên hiển thị thuộc tính API
const changeKeyNames = {
  RAM: 'RAM',
  HDD: 'HDD',
  DPI: 'DPI',
  tray: 'Khay giấy',
  warmUpTime: 'Thời gian khởi động',
  DSPF: 'DSPF',
  RSPF: 'RSPF',
  finisher: 'finisher',
  fax: 'Fax',
  solution: 'Solution',
  addHDD: 'Thêm HDD',
  addRam: 'Thêm RAM',
  addStand: 'Thêm stand',
};