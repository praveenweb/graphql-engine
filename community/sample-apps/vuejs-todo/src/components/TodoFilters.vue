<template>
<div class="footerList">
  <span>{{ remainingTodos }} items left </span>
  <ul>
    <li v-on:click="filterResults('all')">
      <a v-if="filterType === 'all' " class="selected">All</a>
      <a v-else>All</a>
    </li>
    <li v-on:click="filterResults('active')">
      <a
        class="removePaddLeft selected"
        v-if="filterType === 'active' "
      >
        Active
      </a>
      <a
        class="removePaddLeft"
        v-else
      >
        Active
      </a>

    </li>
    <li v-on:click="filterResults('completed')">
      <a
        class="removePaddLeft selected"
        v-if="filterType === 'completed' "
      >
        Completed
      </a>
      <a
        class="removePaddLeft"
        v-else
      >
        Completed
      </a>
    </li>
  </ul>
    <button v-if="type === 'private'" class="clearComp" v-on:click="clearCompleted">
      Clear Completed
    </button>
</div>
</template>

<script>
  export default {
    props: ['type', 'remainingTodos', 'filterResults', 'filterType', 'clearCompleted'],
  }
</script>
