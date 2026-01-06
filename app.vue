<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 300ms ease-in-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
