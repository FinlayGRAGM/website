<template>
    <div class="min-h-screen bg-base-100 text-base-content">
        <!-- Media Grid -->
        <div class="container mx-auto px-6 py-32">
            <div class="masonry-grid" :class="{ 'grid-sidebar': showModal }">
                <div
                    v-for="(item, index) in mediaItems"
                    :key="item.path"
                    class="masonry-item group cursor-pointer relative overflow-hidden rounded bg-base-200/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300"
                    @click="openModal(item, index)"
                >
                    <!-- Use the new Image component -->
                    <Image
                        :imgid="
                            item.path.replace('/media/', '').replace(/^\//, '')
                        "
                        :alt="item.title"
                        class="w-full h-auto"
                    />

                    <!-- Hover overlay -->
                    <div
                        class="absolute inset-0 bg-base-content/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
                    >
                        <h3 class="text-base-100 font-semibold text-lg mb-2">
                            {{ item.title }}
                        </h3>
                        <p class="text-base-100/80 text-sm">
                            {{ item.description }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <Teleport to="body">
            <div
                v-if="showModal"
                class="fixed inset-0 z-50 flex"
                @keydown.esc="closeModal"
                @keydown.left="previousImage"
                @keydown.right="nextImage"
                tabindex="0"
                ref="modalRef"
            >
                <!-- Backdrop -->
                <div
                    class="absolute inset-0 bg-base-content/95 backdrop-blur-sm"
                    @click="closeModal"
                ></div>

                <!-- Sidebar -->
                <div
                    class="relative z-10 w-96 bg-base-100 border-r border-primary/20 overflow-y-auto pt-20"
                >
                    <!-- Close button -->
                    <div class="absolute top-6 right-6">
                        <button
                            @click="closeModal"
                            class="btn btn-ghost btn-sm btn-circle"
                        >
                            <Icon name="heroicons:x-mark" class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Metadata -->
                    <div class="p-8" v-if="selectedItem">
                        <h2 class="text-2xl font-bold text-base-content mb-4">
                            {{ selectedItem.title }}
                        </h2>

                        <div class="space-y-4">
                            <div v-if="selectedItem.description">
                                <h3
                                    class="font-semibold text-base-content/80 mb-2"
                                >
                                    Description
                                </h3>
                                <p class="text-base-content/70">
                                    {{ selectedItem.description }}
                                </p>
                            </div>

                            <div v-if="selectedItem.metadata">
                                <h3
                                    class="font-semibold text-base-content/80 mb-2"
                                >
                                    Metadata
                                </h3>
                                <div class="space-y-2 text-sm">
                                    <div
                                        v-if="
                                            selectedItem.metadata.width &&
                                            selectedItem.metadata.height
                                        "
                                        class="flex justify-between"
                                    >
                                        <span class="text-base-content/70"
                                            >Dimensions:</span
                                        >
                                        <span class="text-base-content"
                                            >{{ selectedItem.metadata.width }} ×
                                            {{
                                                selectedItem.metadata.height
                                            }}</span
                                        >
                                    </div>
                                    <div
                                        v-if="selectedItem.metadata.format"
                                        class="flex justify-between"
                                    >
                                        <span class="text-base-content/70"
                                            >Format:</span
                                        >
                                        <span
                                            class="text-base-content uppercase"
                                            >{{
                                                selectedItem.metadata.format
                                            }}</span
                                        >
                                    </div>
                                    <div
                                        v-if="selectedItem.metadata.size"
                                        class="flex justify-between"
                                    >
                                        <span class="text-base-content/70"
                                            >Size:</span
                                        >
                                        <span class="text-base-content">{{
                                            formatFileSize(
                                                selectedItem.metadata.size,
                                            )
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Download button -->
                        <div class="mt-6">
                            <a
                                :href="getImageUrl(selectedItem)"
                                :download="selectedItem.title"
                                class="btn btn-primary w-full"
                            >
                                <Icon
                                    name="heroicons:arrow-down-tray"
                                    class="w-4 h-4"
                                />
                                Download Image
                            </a>
                        </div>

                        <!-- Navigation -->
                        <div
                            class="flex justify-between items-center mt-8 pt-6 border-t border-primary/20"
                        >
                            <button
                                @click="previousImage"
                                :disabled="currentIndex === 0"
                                class="btn btn-primary btn-sm"
                                :class="{ 'btn-disabled': currentIndex === 0 }"
                            >
                                <Icon
                                    name="heroicons:chevron-left"
                                    class="w-4 h-4"
                                />
                                Previous
                            </button>

                            <span class="text-sm text-base-content/70">
                                {{ currentIndex + 1 }} of
                                {{ mediaItems.length }}
                            </span>

                            <button
                                @click="nextImage"
                                :disabled="
                                    currentIndex === mediaItems.length - 1
                                "
                                class="btn btn-primary btn-sm"
                                :class="{
                                    'btn-disabled':
                                        currentIndex === mediaItems.length - 1,
                                }"
                            >
                                Next
                                <Icon
                                    name="heroicons:chevron-right"
                                    class="w-4 h-4"
                                />
                            </button>
                        </div>
                    </div>

                    <!-- Thumbnail grid -->
                    <div class="p-6 border-t border-primary/20">
                        <h3 class="font-semibold text-base-content/80 mb-3">
                            All Images
                        </h3>
                        <div class="grid grid-cols-3 gap-2">
                            <div
                                v-for="(item, index) in mediaItems"
                                :key="item.path"
                                class="aspect-square rounded cursor-pointer border-2 transition-colors duration-200 overflow-hidden"
                                :class="{
                                    'border-primary': index === currentIndex,
                                    'border-transparent hover:border-primary/50':
                                        index !== currentIndex,
                                }"
                                @click="selectImage(index)"
                            >
                                <Image
                                    :cover="true"
                                    :noLink="true"
                                    :imgid="
                                        item.path
                                            .replace('/media/', '')
                                            .replace(/^\//, '')
                                    "
                                    :alt="item.title"
                                    :width="item.metadata?.width"
                                    :height="item.metadata?.height"
                                    class="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main image area -->
                <div class="flex-1 flex items-center justify-center p-8">
                    <div
                        v-if="selectedItem"
                        class="w-[90%] h-[90%] grid place-items-center relative z-20"
                    >
                        {{ selectedItem.path }}
                        <!-- Use Image component in modal -->
                        <Image
                            :imgid="selectedItem.path.replace('/media/', '')"
                            :alt="selectedItem.title"
                            class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            :style="`max-width: min(80vw, 800px); aspect-ratio: ${selectedItem.metadata?.width || 4}/${selectedItem.metadata?.height || 3}`"
                        />
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
// Load media items using the new collection structure
const { data: mediaItems } = await useAsyncData(
    "mediaItems",
    () => {
        return queryCollection("media")
            .all()
            .then((i) => i.filter((i) => i.metadata.ignore !== true));
    },
    { server: true, lazy: false },
);

const showModal = ref(false);
const selectedItem = ref(null);
const currentIndex = ref(0);
const modalRef = ref(null);

const constants = await useConstants();

// Media page meta data
useSiteMeta({
    title: "Media",
    description: `Explore the visual media and photography from ${constants.value?.contact?.name}'s musical journey and performances.`,
    keywords: [
        "media",
        "photos",
        "gallery",
        "performance photos",
        "concert photos",
        "music photography",
        "composer photos",
        "visual media",
        "behind the scenes",
    ],
});

function openModal(item, index) {
    selectedItem.value = item;
    currentIndex.value = index;
    showModal.value = true;

    nextTick(() => {
        modalRef.value?.focus();
    });
}

function closeModal() {
    showModal.value = false;
    selectedItem.value = null;
}

function nextImage() {
    if (currentIndex.value < mediaItems.value.length - 1) {
        currentIndex.value++;
        selectedItem.value = mediaItems.value[currentIndex.value];
    }
}

function previousImage() {
    if (currentIndex.value > 0) {
        currentIndex.value--;
        selectedItem.value = mediaItems.value[currentIndex.value];
    }
}

function selectImage(index) {
    currentIndex.value = index;
    selectedItem.value = mediaItems.value[index];
}

function formatFileSize(bytes) {
    if (!bytes) return "Unknown";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function getImageUrl(item) {
    return `${item.path}/${item.image}`;
}
</script>

<style scoped>
@import "../assets/css/main.css";

.masonry-grid {
    column-count: 1;
    column-gap: 0.75rem;
    @apply w-full;
}

@media (min-width: 768px) {
    .masonry-grid {
        column-count: 2;
    }
}

@media (min-width: 1024px) {
    .masonry-grid {
        column-count: 3;
    }
}

@media (min-width: 1280px) {
    .masonry-grid {
        column-count: 4;
    }
}

.masonry-grid.grid-sidebar {
    column-count: 1;
}

@media (min-width: 768px) {
    .masonry-grid.grid-sidebar {
        column-count: 1;
    }
}

@media (min-width: 1024px) {
    .masonry-grid.grid-sidebar {
        column-count: 2;
    }
}

@media (min-width: 1280px) {
    .masonry-grid.grid-sidebar {
        column-count: 2;
    }
}

.masonry-item {
    @apply break-inside-avoid mb-3;
    display: inline-block;
    width: 100%;
}

.masonry-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(var(--color-primary), 0.3);
}
</style>
