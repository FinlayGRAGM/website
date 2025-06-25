<script setup>
defineProps({
  className: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "",
  },
  border: {
    type: Boolean,
    default: true,
  }
});
</script>
<template>
  <div
    :id="id"
    :class="[
      `section min-h-screen w-screen ${border ? 'border-b border-t border-dashed border-base-300' : ''}`,
      className,
    ]"
    style="scroll-snap-align: start"
  >
    <slot />
  </div>
</template>
