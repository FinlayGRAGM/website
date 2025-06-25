<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
  to?: string;
  tags?: string[];
  date?: string;
}

const props = withDefaults(defineProps<Props>(), {
  description: "",
  to: "",
  tags: () => [],
  date: "",
});
</script>

<template>
  <NuxtLink
    :to="to"
    class="group flex items-center justify-between gap-2 animated-dashed-border rounded-md bg-base-100 hover:border-primary transition-[border-color,transform] duration-150 px-4 py-3 min-h-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/60 focus:outline-none select-none group-hover:scale-[1.005] active:scale-[0.995]"
    tabindex="0"
  >
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <div
          class="text-base font-medium text-base-content group-hover:text-primary transition-colors truncate"
        >
          {{ title }}
        </div>
        <div v-if="tags.length > 0" class="flex gap-1 flex-shrink-0">
          <span
            v-for="tag in tags"
            :key="tag"
            class="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
          >
            {{ tag }}
          </span>
        </div>
      </div>
      <div class="flex gap-3 text-xs text-base-content/70 flex-col items-start mt-3">
        <div class="truncate flex-1">
          {{ description }}
        </div>
        <div v-if="props.date" class="flex items-center gap-1 flex-shrink-0">
          <Icon name="ph:calendar" class="w-3 h-3" />
          <span>{{ props.date ? new Date(props.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
          }) : '' }}</span>
        </div>
      </div>
    </div>
    <Icon
      name="ph:arrow-right"
      class="w-5 h-5 text-primary transition-transform duration-200 group-hover:translate-x-1"
    />
  </NuxtLink>
</template>
