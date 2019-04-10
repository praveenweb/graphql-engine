<template>
  <div>
    <nav class="navbar navbar-expand-md navbar-light bg-light removeMarBottom">
      <div class="navbar-brand navBrand">Vuejs Todo App</div>
      <div class="collapse navbar-collapse navBarAlign" id="navbarNav">
        <button class="login-btn">Log in</button>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  beforeCreate() {
    this.$auth.renewTokens();
  },
  methods: {
    login() {
      this.$auth.login();
    },
    logout() {
      this.$auth.logOut();
      this.$router.push({ path: "/" });
    },
    handleLoginEvent(data) {
      this.isAuthenticated = data.loggedIn;
      this.profile = data.profile;
    }
  },
  data() {
    return {
      isAuthenticated: false,
      profile: {}
    };
  }
};
</script>
