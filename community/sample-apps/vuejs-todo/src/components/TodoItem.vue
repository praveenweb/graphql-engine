<template>
  <ul>
    <li v-for="todo in todos" v-bind:key="todo.id">
      <div v-if="todo.is_public" class="userInfoPublic">
        {{ todo.user.name.charAt(0).toUpperCase() }}
      </div>
      <div class="view">
          <div v-if="todo.is_completed" class="round">
            <input
              type="checkbox"
              id="todo.id"
              checked="true"
            />
            <label 
              v-on:click="handleTodoToggle(todo)"
              htmlFor="todo.id"></label>
          </div>
          <div v-else class="round">
            <input
              type="checkbox"
              id="todo.id"
            />
            <label 
              v-on:click="handleTodoToggle(todo)"
              htmlFor="todo.id"></label>
          </div>
      </div>
      <div class="labelContent">
          <strike class="todoLabel" v-if="todo.is_completed">
            <div>
              {{ todo.text }}
            </div>
          </strike>
          <div v-else>
            {{ todo.text }}
          </div>
      </div>
      <button v-on:click="handleTodoDelete(todo)" class="closeBtn"> x </button>
    </li>
  </ul>
</template>

<script>
  import { MUTATION_TODO_UPDATE, MUTATION_TODO_DELETE, QUERY_PRIVATE_TODO, QUERY_PUBLIC_TODO } from "../TodoQueries"
  export default {
    props: ['todos', 'type', 'deletePublicTodoClicked', 'completePublicTodoClicked'],
    methods: {
      handleTodoToggle: function (todo) {
        const client = this.$apolloProvider.clients.defaultClient;
        const userId = this.$auth.profile.sub;
        const that = this;
        client.mutate({
          mutation: MUTATION_TODO_UPDATE,
          variables: {
           todoId: todo.id,
            set: { is_completed: !todo.is_completed } 
          },
          update: (store, { data: { update_todos } }) => {
            if (update_todos.affected_rows) {
              const query = this.type === "private" ? QUERY_PRIVATE_TODO : QUERY_PUBLIC_TODO;
              if (this.type === "private") {
                // Read the data from our cache for this query.
                const data = store.readQuery({
                  query: query,
                  variables: { userId: userId }
                });
                const toggledTodo = data.todos.find(t => t.id === todo.id);
                toggledTodo.is_completed = !todo.is_completed;
                store.writeQuery({
                  query: query,
                  variables: {
                    userId: userId
                  },
                  data
                });
              } else if (this.type === "public") {
                that.completePublicTodoClicked(todo);
              }
            }
          },
          // Optimistic UI
          // Will be treated as a 'fake' result as soon as the request is made
          // so that the UI can react quickly and the user be happy
          optimisticResponse: {
            __typename: 'update_todos',
            update_todos: {
              __typename: 'todo',
              id: todo.id,
              is_completed: !todo.is_completed,
              affected_rows: 1
            },
          },
        });
      },
      handleTodoDelete: function(todo) {
        const client = this.$apolloProvider.clients.defaultClient;
        const userId = this.$auth.profile.sub;
        const that = this;
        client.mutate({
          mutation: MUTATION_TODO_DELETE,
          variables: {
           todoId: todo.id,
          },
          update: (store, { data: { delete_todos } }) => {
            if (delete_todos.affected_rows) {
              const query = this.type === "private" ? QUERY_PRIVATE_TODO : QUERY_PUBLIC_TODO;
              if (this.type === "private") {
                const data = store.readQuery({
                  query: query,
                  variables: { userId: userId }
                });
                data.todos = data.todos.filter(t => {
                  return t.id !== todo.id;
                });
                store.writeQuery({
                  query: query,
                  variables: {
                    userId: userId
                  },
                  data
                });
              } else if (this.type === "public") {
                that.deletePublicTodoClicked(todo);
              }
            }
          },
        });
      }
    }
  }

</script>
