<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const breadcrumbs = computed(() => {
  const pathSegments = route.path
    .split("/")
    .filter((segment) => segment !== "");

  const items = [
    {
      text: "Home",
      path: "/",
    },
  ];

  let currentPath = "";
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;

    const displayText =
      segment.replace(/_/g, " ").charAt(0).toUpperCase() +
      segment.replace(/_/g, " ").slice(1);

    items.push({
      text: displayText,
      path: currentPath,
    });
  });

  return items;
});

const shouldDisplay = computed(() => breadcrumbs.value.length > 2);
</script>

<template>
  <div v-if="shouldDisplay" class="breadcrumbs mb-5">
    <ul>
      <li v-for="(item, index) in breadcrumbs" :key="index">
        <NuxtLink
          class="breadcrumb-link"
          v-if="index < breadcrumbs.length - 1"
          :to="item.path"
        >
          {{ item.text }}
        </NuxtLink>
        <span v-else class="breadcrumb-link active">{{ item.text }}</span>
      </li>
    </ul>
  </div>
</template>
