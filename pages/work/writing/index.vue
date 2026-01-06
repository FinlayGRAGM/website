<script setup>
definePageMeta({
  layout: "padding",
});
const { data } = await useAsyncData(
  "writing",
  () => {
    return queryCollection("writing").all();
  },
  { server: true, lazy: false },
);
</script>

<template>
  <LinkSection :items="data" pathPrefix="/work/writing">
    <template #default> Writing </template>
    <template #subheading> A collection of written works exploring language, emotion, and human experience </template>
  </LinkSection>
</template>
