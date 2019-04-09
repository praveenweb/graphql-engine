<template>
  <div>
    <div class="todoListwrapper">
      <div class="loadMoreSection" v-if="showNew" v-on:click="loadMoreClicked">
        You have {{ newTodosLength }} new todo
      </div>
      <TodoItem 
        v-bind:todos="filteredTodos" 
        v-bind:type="type" 
        v-bind:deletePublicTodoClicked="deletePublicTodoClicked" 
        v-bind:completePublicTodoClicked="completePublicTodoClicked" 
      />
      <div class="loadMoreSection" v-if="showOlder" v-on:click="loadOlderClicked">
        Load Older Todos
      </div>
    </div>
    <TodoFilters 
      v-bind:remainingTodos="remainingTodos"  
      v-bind:filterResults="filterResults" 
      v-bind:filterType="filterType"
    />

  </div>
</template>

<script>
import TodoItem from "../components/TodoItem";
import TodoFilters from "../components/TodoFilters";
import { QUERY_PUBLIC_TODO, QUERY_FEED_PUBLIC_TODO, QUERY_FEED_PUBLIC_OLD_TODO, SUBSCRIPTION_TODO_PUBLIC_LIST } from "../TodoQueries";
export default {
  components: {
    TodoItem, TodoFilters
  },
  data: function() {
    return {
      filterType: "all",
      showNew: false,
      showOlder: true,
      newTodosLength: 0,
      limit: 5,
      todos: [],
      type: "public"
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
  mounted() {
    const client = this.$apolloProvider.clients.defaultClient;
    const that = this;
    client
      .query({
        query: QUERY_PUBLIC_TODO,
        variables: { todoLimit: this.limit }
      })
      .then(data => {
        this.todos = data.data.todos;
        const latestTodoId = data.data.todos.length
          ? data.data.todos[0].id
          : null;
        // start a subscription
        client
          .subscribe({
            query: SUBSCRIPTION_TODO_PUBLIC_LIST,
            variables: { todoId: latestTodoId } // update subscription when todoId changes
          })
          .subscribe({
            next(data) {
              if (data.data.todos.length) {
                that.showNew = true;
                that.newTodosLength = that.newTodosLength + data.data.todos.length;
              }
            },
            error(err) {
              console.error("err", err);
            }
          });
      });

  },
  methods: {
    loadMoreClicked: function() {
      const client = this.$apolloProvider.clients.defaultClient;
      this.showNew = false;
      this.newTodosLength = 0;
      const that = this;
      client
        .query({
          query: QUERY_FEED_PUBLIC_TODO,
          variables: {
            todoId: that.todos.length ? that.todos[0].id : null
          }
        })
        .then(data => {
          if (data.data.todos.length) {
            const mergedTodos = data.data.todos.concat(that.todos);
            // update state with new todos
            this.todos = mergedTodos;
          }
        });
    },
    loadOlderClicked: function() {
      const client = this.$apolloProvider.clients.defaultClient;
      const that = this;
      client
        .query({
          query: QUERY_FEED_PUBLIC_OLD_TODO,
          variables: {
            todoId: that.todos.length
              ? that.todos[that.todos.length - 1].id
              : null
          }
        })
        .then(data => {
          if (data.data.todos.length) {
            const mergedTodos = that.todos.concat(data.data.todos);
            // update state with new todos
            that.todos = mergedTodos;
          } else {
            that.showOlder = false;
          }
        });
    },
    deletePublicTodoClicked(deletedTodo) {
      const finalTodos = this.todos.filter(t => {
        return t.id !== deletedTodo.id;
      });
      this.todos = finalTodos;
    },
    completePublicTodoClicked(completedTodo) {
      const finalTodos = this.todos.filter(t => {
        if (t.id === completedTodo.id) {
          t.is_completed = !t.is_completed;
          return t;
        }
        return t;
      });
      this.todos = finalTodos;
    },
    filterResults: function(type) {
      if(type === 'active') {
        this.filterType = "active";
      } else if(type === 'completed') {
        this.filterType = "completed";
      } else {
        this.filterType = "all";
      }
    }
  }
}
</script>
