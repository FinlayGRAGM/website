<script setup>
import { ref, onMounted, computed } from "vue";

const { data: mediaItems } = await useAsyncData(
    "homeContactMedia",
    () => {
        return queryCollection("media").all();
    },
    { server: true, lazy: false },
);

const { data: pieces } = await useAsyncData(
    "homeContactPieces",
    () => {
        return queryCollection("pieces").all();
    },
    { server: true, lazy: false },
);

const hoveredItem = ref(null);

const imagePieceData = computed(() => {
    if (
        !mediaItems.value ||
        !pieces.value ||
        mediaItems.value.length === 0 ||
        pieces.value.length === 0
    ) {
        return [];
    }

    const combinations = [];
    const targetCount = 30;

    for (let i = 0; i < targetCount; i++) {
        const randomMedia =
            mediaItems.value[
                Math.floor(Math.random() * mediaItems.value.length)
            ];
        const randomPiece =
            pieces.value[Math.floor(Math.random() * pieces.value.length)];

        combinations.push({
            image: randomMedia.path.replace("/media/", ""),
            piece: randomPiece.path.replace("/pieces/", "").replace(/^\/+/, ""),
            title: randomPiece.title || "Untitled",
            description: randomPiece.description || "",
            mediaItem: randomMedia,
            pieceItem: randomPiece,
        });
    }

    return combinations;
});

function getRandomPiece() {
    if (!pieces.value || pieces.value.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * pieces.value.length);
    return pieces.value[randomIndex];
}

function handleImageClick(item) {
    navigateTo(`/work/pieces/${item.piece}`);
}

function handleImageHover(index) {
    hoveredItem.value = index;
}

function handleImageLeave() {
    hoveredItem.value = null;
}
</script>

<template>
    <Section
        id="contact"
        className="bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 relative overflow-hidden h-screen"
    >
        <div class="container mx-auto px-6 py-16 h-full flex flex-col">
            <div class="grid lg:grid-cols-2 gap-12 relative flex-1 min-h-0">
                <!-- Masonry Layout - Left Side -->
                <div class="relative h-full overflow-hidden">
                    <!-- Fade overlay -->
                    <div
                        class="absolute inset-0 bg-gradient-to-r from-transparent via-base-100/20 to-base-100 z-10 pointer-events-none"
                    ></div>

                    <!-- Loading state -->
                    <div
                        v-if="!imagePieceData || imagePieceData.length === 0"
                        class="flex items-center justify-center h-full"
                    >
                        <div class="text-base-content/60">
                            Loading gallery...
                        </div>
                    </div>

                    <!-- Masonry grid -->
                    <div
                        v-else
                        class="masonry-grid-home relative h-full overflow-y-auto overflow-x-hidden"
                    >
                        <div
                            v-for="(item, index) in imagePieceData"
                            :key="`${item.image}-${item.piece}-${index}`"
                            class="masonry-item-home group cursor-pointer relative overflow-hidden rounded-lg bg-base-200/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300"
                            @click="handleImageClick(item)"
                            @mouseenter="handleImageHover(index)"
                            @mouseleave="handleImageLeave"
                        >
                            <!-- Image -->
                            <div class="w-full relative overflow-hidden">
                                <!-- Use the Image component like in media.vue -->
                                <Image
                                    :imgid="item.image"
                                    :alt="item.title"
                                    :aspect-ratio="
                                        item.mediaItem?.metadata?.width &&
                                        item.mediaItem?.metadata?.height
                                            ? `${item.mediaItem.metadata.width}/${item.mediaItem.metadata.height}`
                                            : '4/3'
                                    "
                                    class="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
                                />

                                <!-- Hover overlay with piece info -->
                                <Transition
                                    enter-active-class="transition-all duration-300 ease-out"
                                    enter-from-class="opacity-0 scale-95"
                                    enter-to-class="opacity-100 scale-100"
                                    leave-active-class="transition-all duration-200 ease-in"
                                    leave-from-class="opacity-100 scale-100"
                                    leave-to-class="opacity-0 scale-95"
                                >
                                    <div
                                        v-if="hoveredItem === index"
                                        class="absolute inset-0 bg-primary/80 backdrop-blur-sm flex flex-col justify-center items-center p-4 text-center"
                                    >
                                        <h3
                                            class="text-primary-content font-serif text-lg mb-2 transform transition-transform duration-300"
                                        >
                                            {{ item.title }}
                                        </h3>
                                        <p
                                            class="text-primary-content/80 text-sm mb-3 transform transition-transform duration-300 delay-75"
                                            v-if="item.description"
                                        >
                                            {{ item.description }}
                                        </p>
                                        <div
                                            class="text-primary-content/60 text-xs transform transition-transform duration-300 delay-150"
                                        >
                                            Click to view piece
                                        </div>
                                    </div>
                                </Transition>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contact Form - Right Side -->
                <div class="relative z-20 flex flex-col items-center">
                    <div class="text-center mb-12">
                        <h2
                            class="text-4xl font-serif font-light bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4"
                        >
                            Let's Create Something Together
                        </h2>
                        <p
                            class="text-xl text-base-content/70 max-w-2xl mx-auto"
                        >
                            Explore my work and get in touch to discuss your
                            next project
                        </p>
                    </div>
                    <ContactForm :compact="true" />
                </div>
            </div>
        </div>

        <!-- Bottom fade effect -->
        <div
            class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-base-200 to-transparent pointer-events-none"
        ></div>
    </Section>
</template>

<style scoped>
.masonry-grid-home {
    column-count: 2;
    column-gap: 0.75rem;
    column-fill: auto;
    height: 100%;
}

@media (min-width: 768px) {
    .masonry-grid-home {
        column-count: 3;
    }
}

.masonry-item-home {
    break-inside: avoid;
    margin-bottom: 0.75rem;
    display: inline-block;
    width: 100%;
}

.masonry-item-home:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(var(--color-primary), 0.3);
}

/* Custom scrollbar for masonry grid */
.masonry-grid-home::-webkit-scrollbar {
    width: 6px;
}

.masonry-grid-home::-webkit-scrollbar-track {
    background: transparent;
}

.masonry-grid-home::-webkit-scrollbar-thumb {
    background-color: rgba(var(--color-primary), 0.3);
    border-radius: 3px;
}

.masonry-grid-home::-webkit-scrollbar-thumb:hover {
    background-color: rgba(var(--color-primary), 0.5);
}
</style>
