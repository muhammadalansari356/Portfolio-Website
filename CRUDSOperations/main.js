let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let btn = document.getElementById("btn");
let search = document.getElementById("search");

let btnMode = "create";
let tempIndex;
let dataArr = [];
if (localStorage.item != null) {
  dataArr = JSON.parse(localStorage.item);
} else {
  dataArr = [];
}
//get total
function getTotal() {
  total.innerHTML = `${
    +price.value + +taxes.value + +ads.value - +discount.value
  }`;
}
// Create product
btn.addEventListener("click", () => {
  const product = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };

  function showError(selector, condition, message) {
    document.querySelector(selector).innerHTML = condition ? message : "";
  }

  showError(".titleError", !product.title, "Title is required");
  showError(".priceError", !product.price, "Price is required");
  showError(".countError", product.count > 100, "Max 100 products");
  showError(".categoryError", !product.category, "Choose a category");

  if (
    product.title &&
    product.price &&
    product.count <= 100 &&
    product.category
  ) {
    if (btnMode === "create") {
      if (product.count > 1) {
        for (let i = 0; i < product.count; i++) {
          dataArr.push(product);
        }
      } else {
        dataArr.push(product);
      }
    } else {
      dataArr[tempIndex] = product;
      btnMode = "create";
      btn.innerHTML = "Create product";
      btn.className = "button is-link";
      count.style.display = "block";
    }
    localStorage.setItem("item", JSON.stringify(dataArr));
    clearAllInputs();
  }

  getAllData();
});
//clear inputs
function clearAllInputs() {
  title.value =
    price.value =
    taxes.value =
    ads.value =
    discount.value =
    total.innerHTML =
    count.value =
    category.value =
      "";
}
//show data
function getAllData() {
  const table = dataArr
    .map(
      (item, i) => `
      <tr>
        <th>${i + 1}</th>
        <td><strong>${item.title}</strong></td>
        <td>${item.price}</td>
        <td>${item.taxes}</td>
        <td>${item.ads}</td>
        <td>${item.discount}</td>
        <td>${item.total}</td>
        <td>${item.category}</td>
        <td><button class="button is-warning is-outlined">
            <span style="color: black;" onclick="updateItem(${i})">Update</span>
        </button></td>
        <td><button class="button is-danger is-outlined" onclick="deleteItem(${i})">
            <span>Delete</span>
        </button></td>
      </tr>`
    )
    .join("");

  const deleteAll = document.getElementById("deleteAll");
  deleteAll.innerHTML =
    dataArr.length > 0
      ? `
      <button class="button is-danger" style="width: 100%;" id="deleteAll" onclick="deleteAllItems()">DELETE All (${dataArr.length})</button>`
      : "";

  document.querySelector("tbody").innerHTML = table;
}
getAllData();

//delete item
function deleteItem(index) {
  dataArr.splice(index, 1);
  localStorage.item = JSON.stringify(dataArr);
  getAllData();
}
// delete All Items
function deleteAllItems() {
  dataArr = [];
  localStorage.item = JSON.stringify(dataArr);
  getAllData();
}

// update Item
function updateItem(index) {
  const fields = [
    "title",
    "price",
    "taxes",
    "ads",
    "discount",
    "total",
    "category",
  ];
  fields.forEach(
    (field) => (document.getElementById(field).value = dataArr[index][field])
  );
  getTotal();
  count.style.display = "none";
  btn.innerHTML = "Update product";
  btn.className = "button is-success";
  btnMode = "update";
  tempIndex = index;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

let searchMode = "title";
// get search mode
function getSearchMode(id) {
  searchMode = id === "searchByTitle" ? "title" : "category";
  document.getElementById("searchByTitle").className =
    searchMode === "title" ? "button is-link" : "button is-link is-light";
  document.getElementById("searchByCategory").className =
    searchMode === "category" ? "button is-link" : "button is-link is-light";
  search.placeholder = "Search By " + searchMode;
  search.focus();
}

function searchItems(value) {
  let table = "";
  for (let i = 0; i < dataArr.length; i++) {
    if (
      (searchMode == "title" &&
        dataArr[i].title.includes(value.toLowerCase())) ||
      (searchMode !== "title" &&
        dataArr[i].category.includes(value.toLowerCase()))
    ) {
      table += `<tr>
        <th>${i + 1}</th>
        <td><strong>${dataArr[i].title}</strong>
        </td>
        <td>${dataArr[i].price}</td>
        <td>${dataArr[i].taxes}</td>
        <td>${dataArr[i].ads}</td>
        <td>${dataArr[i].discount}</td>
        <td>${dataArr[i].total}</td>
        <td>${dataArr[i].category}</td>
        <td><button class="button is-warning  is-outlined">
            <span style="color: black;" onclick='updateItem(${i})'>Update</span>
            
          </button></td>
        <td><button onclick='deleteItem(${i}) ' class="button is-danger is-outlined">
            <span>Delete</span>
           
          </button></td>
        
      </tr>`;
    }
  }
  document.querySelector("tbody").innerHTML = table;
}
// select options
let optArr;
if (localStorage.options != null) {
  optArr = JSON.parse(localStorage.options);
} else {
  optArr = [];
}

function AddOptionsToSelectEllement() {
  let optionsEll = "";
  for (let i = 0; i < optArr.length; i++) {
    optionsEll += `<option value="${optArr[i]}">${optArr[i]}</option>`;
  }
  category.innerHTML = optionsEll;
}
AddOptionsToSelectEllement();

function addOption() {
  const newOptionText = document.getElementById("newOption").value;
  if (newOptionText.trim() === "") {
    return;
  }
  optArr.push(newOptionText.toLowerCase());
  localStorage.setItem("options", JSON.stringify(optArr));
  AddOptionsToSelectEllement();
  document.getElementById("newOption").value = "";
}

function removeOption() {
  const select = document.getElementById("category");
  const selectedIndex = select.selectedIndex;

  if (selectedIndex !== 0) {
    optArr.splice(selectedIndex, 1);
    localStorage.setItem("options", JSON.stringify(optArr));
    AddOptionsToSelectEllement();
  }
}
