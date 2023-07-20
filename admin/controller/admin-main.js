//lấy data từ mockAPI
function getProductList() {
  let promise = axios({
    url: 'https://649d36a19bac4a8e669d62a2.mockapi.io/product',
    method: 'GET',
  })
  promise
    .then(function (result) {
      console.log('result: ', result.data)
      renderProductList(result)
    })
    .catch(function (error) {
      console.log(error)
    })
}
getProductList();


//lấy thông tin từ người dùng
function getInput() {
  let id = "";
  let name = $("#name").val();
  let title = $("#title").val();
  let image = $("#image").val();
  let price = +$("#price").val();
  let speed = +$("#speed").val();
  let branch = "";
  let branchRadios = $(".branch:checked");
  if (branchRadios.length > 0) {
    branch = branchRadios.first().val();
  } else {
    branch = $("#branch_other").val();
  }
  let type = $(".type:checked").val();
  let color = $(".color:checked").val();
  let paper = $(".paper:checked").val();
  let spec = {};
  let option = {};
  let description = $("#description").val();
  spec["RAM"] = $("#spec_RAM").val();
  spec["HDD"] = $("#spec_HDD").val();
  spec["DPI"] = $("#spec_DPI").val();
  spec["tray"] = $("#spec_tray").val();
  spec["warmUpTime"] = $("#spec_warmUpTime").val();
  option["DSPF"] = $("#option_DSPF").val();
  option["RSPF"] = $("#option_RSPF").val();
  option["finisher"] = $("#option_finisher").val();
  option["fax"] = $("#option_fax").val();
  option["solution"] = $("#option_solution").val();
  option["addHDD"] = $("#option_addHdd").val();
  option["addRam"] = $("#option_addRam").val();
  option["addStand"] = $("#option_addStand").val();
  let product = new Product(name, title, image, price, speed, branch, type, color, paper, spec, option, description, id);
  console.log(product);
  return product;
}


// Tạo sản phẩm
$('#btnAdd').on('click', async function () {
  let product = getInput();
  const isValid = await validateInput(product.name, product.title, product.image, product.price, product.speed, product.branch, true);
  console.log(isValid);
  if (isValid) {
    let promise = axios({
      url: 'https://649d36a19bac4a8e669d62a2.mockapi.io/product',
      method: 'POST',
      data: product,
    });
    promise
      .then(function (result) {
        let createdProduct = result.data;
        console.log(createdProduct);
        getProductList();
        alert('Tạo sản phẩm thành công');
        $('#btnClose').click();
      })
      .catch(function () {
        alert('Tạo sản phẩm thất bại');
      });
  } else {
    alert('Vui lòng kiểm tra lại thông tin sản phẩm.');
  }
})


// Xóa sản phẩm
function deleteProduct(id, name, event) {
  event.preventDefault();

  if (confirm(`Xác nhận xóa sản phẩm ${name}?`)) {
    axios({
      url: `https://649d36a19bac4a8e669d62a2.mockapi.io/product/${id}`,
      method: 'DELETE',
    })
      .then(function () {
        getProductList();
        alert('Xóa sản phẩm thành công');
      })
      .catch(function () {
        alert('Xóa sản phẩm thất bại');
      });
  }
}


//sửa sản phẩm
$('#btnEdit').on('click', async function () {
  let product = getInput();
  const isValid = await validateInput(product.name, product.title, product.image, product.price, product.speed, product.branch, false);
  console.log(isValid)
  if (isValid) {
    product.id = idProduct;
    let promise = axios({
      url: `https://649d36a19bac4a8e669d62a2.mockapi.io/product/${product.id}`,
      method: 'PUT',
      data: product
    });
    promise
      .then(function () {
        getProductList();
        alert('Cập nhật sản phẩm thành công');
        $('#btnClose').click();
      })
      .catch(function () {
        alert('Cập nhật sản phẩm thất bại');
      });
  } else {
    alert('Vui lòng kiểm tra lại thông tin sản phẩm.');
  }
});


//lấy lại thông tin sản phẩm để hiện trên modal 
function editProduct(id) {
  // Ẩn nút thêm hiện nút cập nhật
  $("#btnEdit").css("display", "inline-block");
  $("#btnAdd").css("display", "none");
  let promise = axios({
    url: `https://649d36a19bac4a8e669d62a2.mockapi.io/product/${id}?_=${Math.random()}`,
    method: 'GET',
  });
  promise
    .then(function (result) {
      const product = result.data;
      idProduct = product.id;
      $("#name").val(product.name);
      $("#title").val(product.title);
      $("#image").val(product.image);
      $("#price").val(product.price);
      $("#speed").val(product.speed);
      let branchRadios = $(".branch");
      let branch = product.branch;
      let isOtherBranch = true;
      branchRadios.each(function () {
        if ($(this).val() === branch) {
          $(this).prop("checked", true);
          isOtherBranch = false;
        } else {
          $(this).prop("checked", false);
        }
      });
      if (isOtherBranch) {
        $("#branch_other").val(branch);
        $("#branch_other").prop("checked", true);
      } else {
        $("#branch_other").val("");
        $("#branch_other").prop("checked", false);
      }
      $(".type[value='" + product.type + "']").prop("checked", true);
      $(".color[value='" + product.color + "']").prop("checked", true);
      $(".paper[value='" + product.paper + "']").prop("checked", true);
      $("#description").val(product.description);
      $("#spec_RAM").val(product.spec.RAM);
      $("#spec_HDD").val(product.spec.HDD);
      $("#spec_DPI").val(product.spec.DPI);
      $("#spec_tray").val(product.spec.tray);
      $("#spec_warmUpTime").val(product.spec.warmUpTime);
      $("#option_DSPF").val(product.option.DSPF);
      $("#option_RSPF").val(product.option.RSPF);
      $("#option_finisher").val(product.option.finisher);
      $("#option_fax").val(product.option.fax);
      $("#option_solution").val(product.option.solution);
      $("#option_addHdd").val(product.option.addHDD);
      $("#option_addRam").val(product.option.addRam);
      $("#option_addStand").val(product.option.addStand);
    })
    .catch(function () {
      alert('Lỗi lấy thông tin sản phẩm');
    });
}


// điều chỉnh các input value của branch
$('.branch').on('click', function () {
  $('#branch_other').val('');
});
$('#branch_other').on('click', function () {
  $('.branch').prop('checked', false);
});


// ẩn nút cập nhật hiện nút thêm
$('#btn-modal').on('click', function () {
  $('#btnAdd').css('display', 'inline-block');
  $('#btnEdit').css('display', 'none');
});


// reset các đoạn text thông báo và input mỗi khi đóng modal
const modal = $("#product-modal")[0];
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.attributeName === "style" && $(modal).css("display") === "none") {
      $(".check", modal).html("");
      $("input[type='text'], input[type='number'], textarea", modal).val("");
    }
  });
});
observer.observe(modal, { attributes: true });


//tìm kiếm thông tin sản phẩm
$("#searchTool").on("input", function () {
  let searchName = $("#searchTool").val().toLowerCase().replace(/[\.,]/g, "");
  let searchNumber = parseFloat(searchName);
  let tableRows = $("tbody tr");
  for (let i = 0; i < tableRows.length; i++) {
    let productInfo = $(tableRows[i]).text().toLowerCase().replace(/[\.,]/g, "");
    if (productInfo.includes(searchName)) {
      $(tableRows[i]).show();
    } else if (!isNaN(searchNumber)) {
      //tìm giá sản phẩm gần giá nhập (+/-10% giá nhập)
      let numbersInRow = productInfo.match(/\d+(\.\d+)?/g);
      if (numbersInRow) {
        let foundCloseNumber = numbersInRow.some(function (num) {
          num = parseFloat(num);
          return num >= searchNumber * 0.9 && num <= searchNumber * 1.1;
        });
        if (foundCloseNumber) {
          $(tableRows[i]).show();
        } else {
          $(tableRows[i]).hide();
        }
      } else {
        $(tableRows[i]).hide();
      }
    } else {
      $(tableRows[i]).hide();
    }
  }
});


// nút back-to-top
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', function () {
  if (window.scrollY >= 800) {
    backToTop.style.display = 'block';
  } else {
    backToTop.style.display = 'none';
  }
});

