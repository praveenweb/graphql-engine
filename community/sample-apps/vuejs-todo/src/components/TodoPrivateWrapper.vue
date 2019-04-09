<template>
  <div class="todoWrapper">
    <TodoInput type="private" />
    <TodoPrivateList type="private" v-bind:userId="userId" />
  </div>
</template>

<script>
import TodoInput from "../components/TodoInput";
import TodoPrivateList from "../components/TodoPrivateList";
export default {
  components: {
    TodoInput, TodoPrivateList
  },
  props: ['userId'],
  data() {
   return {
     type: "private"
   }
  }
}
</script>
