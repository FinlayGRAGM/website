<script setup>
const constants = await useConstants();

definePageMeta({
    layout: "default",
});

// Teaching page meta data
useSiteMeta({
    title: constants.value?.teaching?.section?.title || "Teaching",
    description:
        constants.value?.teaching?.section?.description ||
        `${constants.value?.contact?.name} offers music composition, theory, and piano lessons both online and in-person.`,
    keywords: [
        "teaching",
        "music lessons",
        "composition lessons",
        "music theory",
        "piano lessons",
        "songwriting",
        "private lessons",
        "online lessons",
        "music education",
        "conservatory preparation",
        "music teacher",
        "composition teacher",
    ],
});
</script>
<template>
    <TeachingPage />
</template>
