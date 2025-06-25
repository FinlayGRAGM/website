<script setup>
definePageMeta({
  layout: "padding",
});
const { data } = await useAsyncData(
  "pieces",
  () => {
    return queryCollection("pieces").all();
  },
  { server: true, lazy: false },
);
</script>

<template>
  <LinkSection :items="data" pathPrefix="/work/pieces">
    <template #default> Pieces </template>
      <template #subheading> A selection of works: </template>
    </LinkSection>
</template>
