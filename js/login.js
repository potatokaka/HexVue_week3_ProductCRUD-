import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js";

const app = createApp({
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      const apiUrl = "https://vue3-course-api.hexschool.io/v2/admin/signin";

      axios
        .post(apiUrl, this.user)
        .then((res) => {
          //１. 取得 token, expired 資料
          const { token, expired } = res.data;

          // 2. 存入 cookie，記得把 expires 設置有效時間
          document.cookie = `hexToken=${token}; expires=${new Date(
            expired
          )}; path=/`;

          // 3. 轉址
          window.location = "products.html";
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
});

app.mount("#app");
