<template>
<div>
  <Content />
  <SimpleNewsletter v-if="$service.email.enabled"/>
</div>
</template>

