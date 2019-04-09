<template>
<div class="footerList">
  <span>{{ remainingTodos }} items left </span>
  <ul>
    <li v-on:click="filterResults('all')">
      <a class="selected">All</a>
    </li>
    <li v-on:click="filterResults('active')">
      <a
        class="removePaddLeft"
      >
        Active
      </a>
    </li>
    <li v-on:click="filterResults('completed')">
      <a
        class="removePaddLeft"
      >
        Completed
      </a>
    </li>
  </ul>
    <button class="clearComp">
      Clear Completed
    </button>
</div>
</template>

<script>
  export default {
    props: ['todoList', 'remainingTodos', 'filterResults'],
  }
</script>
