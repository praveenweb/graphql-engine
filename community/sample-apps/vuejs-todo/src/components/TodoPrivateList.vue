<template>
  <div>
    <div class="todoListwrapper">
      <TodoItem 
        v-bind:todos="filteredTodos" 
        v-bind:type="type" 
      />
    </div>
    <TodoFilters 
      v-bind:remainingTodos="remainingTodos" 
      v-bind:filterResults="filterResults" 
      v-bind:filterType="filterType"
      v-bind:type="type"
      v-bind:clearCompleted="clearCompleted"
    />
  </div>
</template>

<script>
import gql from "graphql-tag";
import TodoItem from "../components/TodoItem";
import TodoFilters from "../components/TodoFilters";
import { QUERY_PRIVATE_TODO } from "../TodoQueries";
export default {
  components: {
    TodoItem, TodoFilters
  },
  props: ['userId'],
  data() {
    return {
      type: "private",
      filterType: "all"
    }
  },
  computed: {
    remainingTodos: function() {
      const activeTodos = this.todos !== undefined ? this.todos.filter((todo) => todo.is_completed !== true) : []
      return activeTodos.length
    },
    filteredTodos: function() {
      if (this.filterType === 'all') {
        return this.todos
      } else if(this.filterType === 'active') {
        return this.todos.filter((todo) => todo.is_completed !== true);
      } else if (this.filterType === 'completed') {
        return this.todos.filter((todo) => todo.is_completed === true);
      }
    }
  },
  methods: {
    filterResults: function(type) {
      if(type === 'active') {
        this.filterType = "active";
      } else if(type === 'completed') {
        this.filterType = "completed";
      } else {
        this.filterType = "all";
      }
    },
    clearCompleted: function() {
      const client = this.$apolloProvider.clients.defaultClient;
      const userId = this.$auth.profile.sub;
      const isOk = window.confirm("Are you sure?");
      if (isOk) {
        const isPublic = false;
        client
          .mutate({
            mutation: gql`
              mutation ($isPublic: Boolean!) {
                delete_todos (
                  where: { is_completed: {_eq: true}, is_public: {_eq: $isPublic}}
                ) {
                  affected_rows
                }
              }
            `,
            variables: {
              isPublic: isPublic
            },
            update: (store, { data: { delete_todos } }) => {
              const query = QUERY_PRIVATE_TODO;
              if (delete_todos.affected_rows) {
                const data = store.readQuery({
                  query: query,
                  variables: { userId: userId }
                });
                data.todos = data.todos.filter((todo) => todo.is_completed !== true);
                store.writeQuery({
                  query: query,
                  variables: {
                    userId: userId
                  },
                  data
                });
              }
            },

          })
          .then(() => {
            // handle response
          })
          .catch(error => {
            console.error(error);
          });
      }

    }

  },
  apollo: {
    todos: {
      // graphql query
      query: QUERY_PRIVATE_TODO,
      // reactive variables
      variables () {
        return {
          userId: this.userId,
        }
      },
    },
  },
}
</script>
