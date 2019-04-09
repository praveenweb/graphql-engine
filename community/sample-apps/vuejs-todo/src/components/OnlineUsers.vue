<template>
  <div class="sliderMenu grayBgColor">
    <div class="sliderHeader">
      Online users - {{ online_list.length }}
    </div>
    <div class="userInfo" v-for="user in online_list" v-bind:key="user.name">
      <div class="userImg">
        <i class="far fa-user" />
      </div>
      <div class="userName">
        {{ user.name }}
      </div>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag'
  const SUBSCRIPTION_ONLINE_USERS = gql`
    subscription {
      online_users(order_by: { name: asc }) {
        name
      }
    }
  `;
  export default {
    data() {
      return {
        online_list: [],
        loading: true
      };
    },
    apollo: {
    // Subscriptions
      $subscribe: {
        // When a user is added
        online_users: {
          query: SUBSCRIPTION_ONLINE_USERS,
          // Reactive variables
          // Result hook
          result (data) {
            // Let's update the local data
            console.log(data) // eslint-disable-line
            this.online_list = data.data.online_users
            this.loading = false
          },
        },
      },
    },
  }

</script>
