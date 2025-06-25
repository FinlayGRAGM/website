<script setup>
import { ref, computed } from "vue";

const { data: mediaItems } = await useAsyncData(
    "contactMedia",
    () => {
        return queryCollection("media").all();
    },
    { server: true, lazy: false },
);

const { data: pieces } = await useAsyncData(
    "contactPieces",
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
    const targetCount = 20;

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
    <div class="relative max-w-6xl mx-auto h-screen w-[calc(100vw-2rem)]">
        <!-- Masonry Layout - Full width, behind contact form -->
        <div
            class="absolute left-0 right-[40vw] xl:right-[10vw] top-0 bottom-0"
        >
            <!-- Loading state -->
            <div
                v-if="!imagePieceData || imagePieceData.length === 0"
                class="flex items-center justify-center h-full"
            >
                <div class="text-base-content/60">Loading gallery...</div>
            </div>

            <!-- Masonry grid -->
            <div
                v-else
                class="masonry-grid-contact relative h-full overflow-hidden masonry-section columns-2 lg:columns-3 xl:columns-4"
            >
                <div
                    v-for="(item, index) in imagePieceData"
                    :key="`${item.image}-${item.piece}-${index}`"
                    class="masonry-item-contact group cursor-pointer relative overflow-hidden rounded-lg bg-base-200/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300"
                    @click="handleImageClick(item)"
                    @mouseenter="handleImageHover(index)"
                    @mouseleave="handleImageLeave"
                >
                    <!-- Image -->
                    <div class="w-full relative overflow-hidden">
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

            <!-- Fade overlay that creates the transition to contact form -->
            <div class="absolute inset-0 contact-form-fade-overlay"></div>
        </div>

        <!-- Contact Form - Elevated above masonry -->
        <div class="relative z-10 ml-auto w-full lg:w-2/3 xl:w-1/2">
            <div class="w-full">
                <ContactForm />
            </div>
        </div>
    </div>
</template>

<style scoped>
.masonry-grid-contact {
    column-gap: 0.75rem;
    column-fill: auto;
    height: 100%;
    padding: 2rem;
}

.masonry-item-contact {
    break-inside: avoid;
    margin-bottom: 0.75rem;
    display: inline-block;
    width: 100%;
}

.masonry-item-contact:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(var(--color-primary), 0.3);
}

/* Fade overlay that creates smooth transition under contact form */
.contact-form-fade-overlay {
    background: linear-gradient(
        to right,
        transparent 0%,
        transparent 40%,
        rgba(var(--color-base-100), 0.3) 50%,
        rgba(var(--color-base-100), 0.7) 60%,
        rgba(var(--color-base-100), 0.95) 70%,
        var(--color-base-100) 80%
    );
    pointer-events: none;
}

@media (max-width: 1023px) {
    .contact-form-fade-overlay {
        background: linear-gradient(
            to right,
            transparent 0%,
            transparent 30%,
            rgba(var(--color-base-100), 0.3) 40%,
            rgba(var(--color-base-100), 0.7) 50%,
            rgba(var(--color-base-100), 0.95) 60%,
            var(--color-base-100) 70%
        );
    }
}

.masonry-section {
    mask-image: linear-gradient(to right, black, transparent);
}
</style>
