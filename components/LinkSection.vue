<script setup>
import { defineProps, ref, computed } from "vue";

const POSSIBLE_SORT_OPTIONS = ["title", "description"];

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  pathPrefix: {
    type: String,
    default: "",
  },
});

const searchQuery = ref("");
const selectedTags = ref([]);
const sortBy = ref(POSSIBLE_SORT_OPTIONS[0]);
const sortOrder = ref("asc");

const allTags = computed(() => {
  const tags = new Set();
  props.items.forEach((item) => {
    if (item.tags) {
      item.tags.forEach((tag) => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
});

const filteredItems = computed(() => {
  let filtered = props.items;
  console.log({filtered});
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(query)),
    );
  }

  if (selectedTags.value.length > 0) {
    filtered = filtered.filter((item) =>
      item.tags?.some((tag) => selectedTags.value.includes(tag)),
    );
  }

  filtered = [...filtered].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy.value) {
      case "date":
        aValue = new Date(a.meta?.date || 0);
        bValue = new Date(b.meta?.date || 0);
        break;
      case "relevance":
        aValue = getRelevanceScore(a);
        bValue = getRelevanceScore(b);
        break;
      default:
        aValue = a[sortBy.value?.toLowerCase()]?.toLowerCase() || "";
        bValue = b[sortBy.value?.toLowerCase()]?.toLowerCase() || "";
        break;
    }

    if (aValue < bValue) return sortOrder.value === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });

  return filtered;
});

const getRelevanceScore = (item) => {
  if (!searchQuery.value.trim()) return 0;

  const query = searchQuery.value.toLowerCase();
  let score = 0;

  if (item.title?.toLowerCase().includes(query)) score += 3;
  if (item.description?.toLowerCase().includes(query)) score += 2;
  if (item.tags?.some((tag) => tag.toLowerCase().includes(query))) score += 1;

  return score;
};

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
};

const clearFilters = () => {
  searchQuery.value = "";
  selectedTags.value = [];
  sortBy.value = POSSIBLE_SORT_OPTIONS[0];
  sortOrder.value = "asc";
};

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value.trim() || selectedTags.value.length > 0 /*||
        sortBy.value !== "title" ||
        sortOrder.value !== "asc"*/
  );
});
</script>

<template>
  <div class="pieces_container mx-auto w-5/6 max-w-2xl">
    <div class="prose mb-6">
      <h1 class="text-3xl h2 mb-1">
        <slot>Section Title</slot>
      </h1>
      <p class="subheading text-sm">
        <slot name="subheading">Section Subheading</slot>
      </p>
    </div>

    <div class="mb-6 space-y-4">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search items..."
          class="input input-bordered w-full pr-10 focus:outline-none"
        />
        <Icon
          name="ph:magnifying-glass"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
        />
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div
          v-if="allTags.length > 0"
          class="flex flex-wrap items-center gap-2"
        >
          <span class="text-sm font-medium text-base-content/70">Tags:</span>
          <button
            v-for="tag in allTags"
            :key="tag"
            @click="toggleTag(tag)"
            :class="[
              'btn btn-xs',
              selectedTags.includes(tag)
                ? 'btn-primary'
                : 'btn-outline btn-primary',
            ]"
          >
            {{ tag }}
          </button>
        </div>

        <div class="flex items-center gap-2 ml-auto">
          <div class="dropdown dropdown-end">
            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="btn btn-sm btn-ghost text-error"
              title="Clear all filters"
            >
              <Icon name="ph:x" class="w-4 h-4" />
            </button>
            <div tabindex="0" role="button" class="btn btn-sm btn-outline">
              Sort:
              {{ sortBy[0].toUpperCase() + sortBy.slice(1) }}
              <Icon name="ph:caret-down" class="w-4 h-4 ml-1" />
            </div>

            <ul
              tabindex="0"
              class="dropdown-content menu bg-base-100 rounded-box z-10 w-40 p-2 shadow-lg border border-base-300"
            >
              <li v-for="option in POSSIBLE_SORT_OPTIONS">
                <a
                  @click="sortBy = option"
                  :class="{ active: sortBy === option }"
                >
                  {{ option[0].toUpperCase() + option.slice(1) }}
                </a>
              </li>
              <li v-if="props.items.some((item) => item.meta?.date)">
                <a
                  @click="sortBy = 'date'"
                  :class="{ active: sortBy === 'date' }"
                >
                  Date
                </a>
              </li>
              <li v-if="searchQuery.trim()">
                <a
                  @click="sortBy = 'relevance'"
                  :class="{ active: sortBy === 'relevance' }"
                >
                  Relevance
                </a>
              </li>
            </ul>
          </div>

          <button
            @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
            class="btn btn-sm btn-ghost"
            :title="sortOrder === 'asc' ? 'Ascending' : 'Descending'"
          >
            <Icon
              :name="sortOrder === 'asc' ? 'ph:arrow-up' : 'ph:arrow-down'"
              class="w-4 h-4"
            />
          </button>
        </div>
      </div>

      <div
        v-if="hasActiveFilters"
        class="flex flex-wrap items-center gap-2 text-sm"
      >
        <span class="text-base-content/70">Active filters:</span>

        <div v-if="searchQuery.trim()" class="badge badge-outline gap-1">
          Search: "{{ searchQuery }}"
          <button
            @click="searchQuery = ''"
            class="btn btn-ghost btn-xs p-0 min-h-0 h-4 w-4"
          >
            <svg
              class="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div
          v-for="tag in selectedTags"
          :key="tag"
          class="badge badge-primary badge-outline gap-1"
        >
          {{ tag }}
          <button
            @click="toggleTag(tag)"
            class="btn btn-ghost btn-xs p-0 min-h-0 h-4 w-4"
          >
            <svg
              class="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <template v-if="filteredItems.length > 0">
        <Card
          v-for="(item, index) in filteredItems"
          :key="item.path || `item-${index}`"
          :title="item.title"
          :tags="item.tags"
          :description="item.description"
          :date="item.meta?.date"
          :to="props.pathPrefix + item.path"
        />
      </template>
      <div v-else class="text-center text-base-content/70 py-8">
        No items found matching your criteria.
      </div>
    </div>
  </div>
</template>
