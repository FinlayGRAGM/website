<script setup>
const constants = await useConstants();

definePageMeta({
  layout: "nothing",
});

// Homepage meta data
useSiteMeta({
  title: '', // Use default site title
  description: constants.value?.homepage?.description,
  type: 'website',
  keywords: [
    'homepage',
    'portfolio',
    'music portfolio',
    'composer portfolio',
    'contemporary music',
    'musical works',
    'compositions'
  ]
});

// Structured data for homepage
useStructuredData({
  type: 'WebPage',
  data: {
    name: `${constants.value?.contact?.name} - Composer & Educator`,
    description: constants.value?.homepage?.description,
    author: constants.value?.contact?.name,
    image: constants.value?.homepage?.smallPhoto
  }
});
</script>
<template>
  <HomePage></HomePage>
  <Footer />
</template>
