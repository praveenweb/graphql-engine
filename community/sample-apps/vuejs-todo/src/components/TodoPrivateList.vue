<template>
  <div>
    <div class="todoListwrapper">
      <TodoItem v-bind:todos="filteredTodos" v-bind:type="type" />
    </div>
    <TodoFilters v-bind:todoList="filteredTodos" v-bind:remainingTodos="remainingTodos" v-bind:filterResults="filterResults" />
  </div>
</template>

<script>
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
    }
  },
  computed: {
    remainingTodos: function() {
      const activeTodos = this.todos !== undefined ? this.todos.filter((todo) => todo.is_completed !== true) : []
      return activeTodos.length
    },
    filteredTodos: function() {
      return this.todos
    }
  },
  methods: {
    filterResults: function(type) {
      if(type === 'active') {
        this.todos = this.todos.filter((todo) => todo.is_completed !== true);
      } else if(type === 'completed') {
        this.todos = this.todos.filter((todo) => todo.is_completed === true);
      } else {
        this.todos = this.todos;
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
