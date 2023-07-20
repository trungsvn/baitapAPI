function renderProductList(result) {
    var content = '';
    for (let i = 0; i < result.data.length; i++) {
      let product = result.data[i];
      let formattedPrice = product.price.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
      content += `
        <tr class="product-row">
          <td class="product-group-avatar">
            <h4 style="font-weight: 700;">${product.name}</h4>
            <div class="product-img-container">
              <img class="product-img my-2" src=${product.image}>
            </div>
            <h4 style="color: red; font-weight: 600;"><span>${formattedPrice}</span></h4>
          </td>
          <td class="product-group-detail text-start">
            <h4>Hãng: <span>${product.branch}</span></h4>
            <h4>Tốc độ in: <span>${product.speed} ppm</span></h4>
            <h4>Loại: <span>${product.type}</span></h4>
            <h4>Màu In: <span>${product.color}</span></h4>
            <h4>Khổ giấy: <span>${product.paper}</span></h4>
          </td>
          <td class="product-group-desc">
            <h4 style="color:red;font-weight: 600;" class="mb-2">${product.title}</h4>
            <h4 style="font-weight:400">${product.description}</h4>
          </td>
          <td class="product-group-manage">
            <a onclick="editProduct('${product.id}')" id="btn-modal-edit" class="me-4" data-bs-toggle="modal" data-bs-target="#product-modal" href="" title="sửa"><i class="fa-solid fa-file-pen"></i></a>
            <a onclick="deleteProduct('${product.id}','${product.name}', window.event)" id="btnDelete" href="" title="xóa"><i class="fa-solid fa-trash"></i></a>
          </td>
        </tr>
      `;
    }
    document.getElementById('product-table-admin').innerHTML = content;
  }
  