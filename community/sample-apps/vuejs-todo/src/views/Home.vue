<template>
  <div class="overlay">
    <div class="overlay-content">
      <div class="overlay-heading">
        Welcome to the GraphQL tutorial app
      </div>
      <div class="overlay-message">
        Please login to continue
      </div>
      <div class="overlay-action">
        <button class="login-btn">Log in</button>
      </div>
    </div>

  </div>
</template>



<script>
export default {
  name: "home",
  methods: {
    handleLoginEvent(data) {
      this.isAuthenticated = data.loggedIn;
      this.isLoading = false;
    }
  },
  beforeCreate() {
    this.isLoading = true;
  },
  mounted() {
    this.isLoading = false;
  },
  data() {
    return {
      isAuthenticated: false,
      isLoading: true
    };
  },
};
</script>

<style lang="scss" scoped>
.next-steps {
  .fa-link {
    margin-right: 5px;
  }
}
.spinner {
  position: absolute;
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: white;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
