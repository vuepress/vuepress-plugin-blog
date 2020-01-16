<template>
  <ul id="default-layout">
    <li v-for="item in $frontmatterKey.list">
      <router-link class="page-link" :to="item.path">{{ item.name }}</router-link>
    </li>
  </ul>
</template>
