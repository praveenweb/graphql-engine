<template>
  <div class="formInput">
    <input 
	class="input" 
	placeholder="What needs to be done?" 
	v-model="newTodo"
	@keyup.enter="addTodo"
    />
    <i class="downArrow fa fa-angle-down" />
  </div>
</template>

<script>
  import { MUTATION_TODO_ADD, QUERY_PRIVATE_TODO } from "../TodoQueries"
  export default {
    props: ['type'],
    data() {
      return {
        newTodo: '',
        editedTodo: null,
        visibility: 'all'
      }
    },
    methods: {
      addTodo: function () {
        const value = this.newTodo && this.newTodo.trim()
        if (!value) {
          return
        }
        const client = this.$apolloProvider.clients.defaultClient;
        const isPublic = this.type === "public" ? true : false;
        const userId = this.$auth.profile.sub;
        client.mutate({
          mutation: MUTATION_TODO_ADD,
          variables: {
            objects: [{
              text: value,
              user_id: userId,
              is_completed: false,
              is_public: isPublic
            }]
          },
          update: (store, { data: { insert_todos } }) => {
            // Read the data from our cache for this query.
            const query = QUERY_PRIVATE_TODO;
            try {
              if (this.type === "private") {
                const data = store.readQuery({
                  query: query,
                  variables: { userId: userId }
                });
                const insertedTodo = insert_todos.returning;
                data.todos.splice(0, 0, insertedTodo[0]);
                store.writeQuery({
                  query: query,
                  variables: {userId: userId},
                  data
                });
              }
            } catch (e) {
              console.error(e);
            }
          },
        });
        this.newTodo = ''
      },
    }

  }

</script>
