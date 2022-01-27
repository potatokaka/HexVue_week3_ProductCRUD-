import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js";

let productModal = "";
let deleteModal = "";

const app = createApp({
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io",
      apiPath: "filter117",
      products: [],
      editState: "",
      tempProduct: {
        imagesUrl: [],
      },
    };
  },
  methods: {
    // 檢查是否登入
    checkLogin() {
      axios
        .post(`${this.apiUrl}/v2/api/user/check`)
        .then((res) => {
          this.getProducts();
        })
        .catch((err) => {
          console.log(err.response.data);
          window.location = "index.html";
        });
    },
    // 取得所有產品資料
    getProducts() {
      axios
        .get(`${this.apiUrl}/v2/api/${this.apiPath}/admin/products`)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },

    //　新增或修改 產品
    updateProduct() {
      // 預設是新增模式，指定網址、post 方法
      // 設定　url 和 http 方法
      let url = `${this.apiUrl}/v2/api/${this.apiPath}/admin/product`;
      let httpMethod = "post";

      // 如果是 修改 狀態, 則換成對應的 url 和 http 方法
      if (this.editState == "edit") {
        url = `${this.apiUrl}/v2/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        httpMethod = "put";
      }

      axios[httpMethod](url, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message);
          productModal.hide();
          this.getProducts();
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },
    // 刪除單一產品
    deleteProuct() {
      axios
        .delete(
          `${this.apiUrl}/v2/api/${this.apiPath}/admin/product/${this.tempProduct.id}`
        )
        .then((res) => {
          this.getProducts();
          deleteModal.hide();
          alert(res.data.message);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },
    // Modal 開關
    openModal(state, item) {
      if (state === "create") {
        this.editState = "create";
        // 把 tempProduct 的資料清空
        this.tempProduct = {
          imagesUrl: [],
        };
        productModal.show();
      } else if (state === "edit") {
        this.editState = "edit";
        // 將 tempProduct 的資料，設為傳入的該筆資料。
        // 注意：這裡是使用解構的方式，因為要避免改動資料時，一併將畫面的資料一起改掉
        this.tempProduct = { ...item };
        productModal.show();
      } else if (state === "delete") {
        this.editState = "delete";
        this.tempProduct = item;
        deleteModal.show();
      }
    },
    // 新增圖片資料
    createImage() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
  },
  mounted() {
    // 1. 取出 token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    //２.存入 Axios Header 裡面
    axios.defaults.headers.common.Authorization = token;

    // ３. 確認是否有登入
    this.checkLogin();

    // Bootstrap modal 實體化
    productModal = new bootstrap.Modal(document.querySelector("#productModal"));
    deleteModal = new bootstrap.Modal(
      document.querySelector("#delProductModal")
    );
  },
});

app.mount("#app");
