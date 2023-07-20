async function validateInput(name, title, image, price, speed, branch, duplicateName) {
    let isValid = true;
    if (!name) {
        document.getElementById("check-name").innerHTML = "Không được để trống mã sản phẩm.";
        isValid = false;
    } else {
        const nameRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*-)[a-zA-Z\d-]+$/;
        if (!nameRegex.test(name)) {
            document.getElementById("check-name").innerHTML = "Mã sản phẩm phải bao gồm chữ, số và dấu gạch nối.";
            isValid = false;
        } else {
            document.getElementById("check-name").innerHTML = "";
        }
    }

    if (!title) {
        document.getElementById("check-title").innerHTML = "Không được để trống tiêu đề.";
        isValid = false;
    } else if (title.length > 200) {
        document.getElementById("check-title").innerHTML = "Tiêu đề không được quá 200 ký tự.";
        isValid = false;
    } else {
        document.getElementById("check-title").innerHTML = "";
    }

    if (!image) {
        document.getElementById("check-image").innerHTML = "Không được để trống url hình ảnh.";
        isValid = false;
    } else {
        const imageRegex = /(http(s?):)([/|.|\w|\s|-])*\/*(\?\S*)?$/g;
        if (!imageRegex.test(image)) {
            document.getElementById("check-image").innerHTML = "Vui lòng nhập url hợp lệ";
            isValid = false;
        } else {
            document.getElementById("check-image").innerHTML = "";
        }
    }

    if (!price) {
        document.getElementById("check-price").innerHTML = "Không được để trống giá sản phẩm.";
        isValid = false;
    } else if (isNaN(price) || price < 10000) {
        document.getElementById("check-price").innerHTML = "Giá sản phẩm ít nhất là 10.000 VNĐ";
        isValid = false;
    } else {
        document.getElementById("check-price").innerHTML = "";
    }

    if (!speed) {
        document.getElementById("check-speed").innerHTML = "Không được để trống tốc độ in";
        isValid = false;
    } else if (!Number.isInteger(speed) || speed <= 0) {
        document.getElementById("check-speed").innerHTML = "Tốc độ in phải là số nguyên dương";
        isValid = false;
    } else {
        document.getElementById("check-speed").innerHTML = "";
    }
    if (!branch) {
        document.getElementById("check-branch").innerHTML = "Không được để trống tên hãng sản xuất";
        isValid = false;
    } else {
        document.getElementById("check-branch").innerHTML = ""
    }
    // Check for duplicate name
    if (duplicateName) {
        const url = "https://649d36a19bac4a8e669d62a2.mockapi.io/product";
        try {
            const response = await axios.get(url);
            const data = response.data;
            const duplicateNameExists = data.some(product => product.name === name);
            if (duplicateNameExists) {
                document.getElementById("check-name").innerHTML = "Mã sản phẩm đã tồn tại";
                isValid = false;
            }
        } catch (error) {
            console.error(error);
        }
    }
    return isValid;
}
