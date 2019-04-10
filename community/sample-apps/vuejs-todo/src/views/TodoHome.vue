<template>
  <div>
    <div class="col-xs-12 col-md-12 col-lg-9 col-sm-12 noPadd">
      <div>
        <div class="col-md-6 col-sm-12">
          <div class="wd95 addPaddTopBottom">
            <div class="sectionHeader">Personal todos</div>
            <TodoPrivateWrapper v-bind:userId="getUserId" />
          </div>
        </div>
        <div class="col-xs-12 col-md-6 col-sm-12 grayBgColor todoMainWrapper commonBorRight">
          <div class="wd95 addPaddTopBottom">
            <div class="sectionHeader">Public feed (realtime)</div>
            <TodoPublicWrapper />
          </div>
        </div>
      </div>
    </div>
    <div class="col-xs-12 col-lg-3 col-md-12 col-sm-12 noPadd">
      <OnlineUsers />
    </div>
  </div>
</template>

<script>
import TodoPrivateWrapper from "../components/TodoPrivateWrapper";
import TodoPublicWrapper from "../components/TodoPublicWrapper";
import OnlineUsers from "../components/OnlineUsers";
import gql from "graphql-tag";
import moment from "moment"

export default {
  components: {
    TodoPrivateWrapper, TodoPublicWrapper, OnlineUsers
  },
  computed: {
    getUserId: function() {
      return this.profile ? this.profile.sub : null
    }
  },
  data() {
    return {
      profile: this.$auth.profile
    };
  },
  methods: {
    handleLoginEvent(data) {
      this.profile = data.profile;
      const userId = data.profile.sub;

      const client = this.$apolloProvider.clients.defaultClient;
      setInterval(function() {
        const timestamp = moment().format();
        client
          .mutate({
            mutation: gql`
              mutation($userId: String!, $timestamp: timestamptz!) {
                update_users(
                  where: { auth0_id: { _eq: $userId } }
                  _set: { auth0_id: $userId, last_seen: $timestamp }
                ) {
                  affected_rows
                }
              }
            `,
            variables: {
              userId: userId,
              timestamp: timestamp
            }
          })
          .then(() => {
            // handle response if required
          })
          .catch(error => {
            console.error(error);
          });

      }.bind(this),5000);
    }
  }
};
</script>
