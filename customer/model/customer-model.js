//constructor giỏ hàng
class Cart {
  constructor() {
    this.items = [];
  }
  addItem(item) {
    this.items.push(item);
  }
  deleteItem(item) {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }
  totalPrice() {
    let total = 0;
    for (const item of this.items) {
      total += parseFloat(item.price) * parseFloat(item.quantity);
    }
    return total.toFixed(2);
  }
  localStorageSave() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }
  static localStorageLoad() {
    const data = localStorage.getItem('cart');
    if (data) {
      const items = JSON.parse(data);
      const cart = new Cart();
      cart.items = items;
      return cart;
    }
    return new Cart();
  }
}

//constructor sản phẩm trong giỏ hàng (chưa đặt hàng)
class CartItem {
  constructor(_name, _price, _quantity, _image, _saved = false, _status = "chưa đặt hàng") {
    this.name = _name;
    this.price = parseFloat(_price);
    this.quantity = _quantity;
    this.image = _image;
    this.saved = _saved;
    this.status = _status;
  }

  totalPrice() {
    return (parseFloat(this.price) * parseFloat(this.quantity)).toFixed(2);
  }
}

//constructor sản phẩm đã được đặt hàng
class OrderItem {
  constructor(_name, _price, _quantity, _image, _status = 'đã đặt hàng') {
    this.name = _name;
    this.price = parseFloat(_price);
    this.quantity = _quantity;
    this.image = _image;
    this.status = _status;
  }

  totalPrice() {
    return (parseFloat(this.price) * parseFloat(this.quantity)).toFixed(2);
  }
}

//constructor sản phẩm (không hiểu vì sao mình test trên Brave, Firefox không cho đọc file js module nên không import từ admin được)
class Product {
  constructor(_name, _title, _image, _price, _speed, _branch, _type, _color, _paper, _spec, _option, _description, _id) {
    this.name = _name;
    this.title = _title;
    this.image = _image;
    this.price = _price;
    this.speed = _speed;
    this.branch = _branch;
    this.type = _type;
    this.color = _color;
    this.paper = _paper;
    this.spec = _spec;
    this.option = _option;
    this.description = _description;
    this.id = _id;
  }
}
