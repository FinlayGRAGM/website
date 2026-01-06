<script setup>
import { ref, computed, watch, onMounted } from "vue";

const constants = await useConstants();
console.log("Constants: ", constants.value);

const images = ref([]);

onMounted(() => {
    console.log("Images: ", images.value);
});

watch(
    constants,
    (newConstants) => {
        if (newConstants?.teaching?.images) {
            images.value = newConstants.teaching.images.map((img) => ({
                ...img,
            }));
        }
    },
    { immediate: true },
);

const bringToTop = (clickedId) => {
    if (!images.value.length) return;

    const clickedIndex = images.value.findIndex((img) => img.id === clickedId);
    if (clickedIndex > -1) {
        const clickedImage = images.value[clickedIndex];
        images.value.splice(clickedIndex, 1);
        images.value.unshift(clickedImage);
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center p-4 md:p-8">
        <div
            class="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center"
        >
            <!-- Left side - Content -->
            <div class="space-y-6 lg:space-y-8 order-2 lg:order-1">
                <div class="space-y-4 lg:space-y-6">
                    <h1 class="h1">{{ constants?.teaching?.section?.title }}</h1>
                    <p class="hero-text">
                        {{ constants?.teaching?.section?.description }}
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row gap-3 lg:gap-4">
                    <button
                        class="btn btn-primary btn-hero gap-2 hover:gap-3 transition-all duration-300"
                        :href="constants?.teaching?.section?.buttons?.primaryLink"
                    >
                        <span>{{
                            constants?.teaching?.section?.buttons?.primary
                        }}</span>
                        <svg
                            class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                    <button
                        class="btn btn-hero btn-outline"
                        :href="
                            constants?.teaching?.section?.buttons?.secondaryLink
                        "
                    >
                        {{ constants?.teaching?.section?.buttons?.secondary }}
                    </button>
                </div>
            </div>

            <div class="order-1 lg:order-2 relative">
                <div class="relative w-52 h-64 lg:w-64 lg:h-80 mx-auto">
                    <template v-for="(image, index) in images" :key="image.id">
                        <div
                            @click="bringToTop(image.id)"
                            :style="{
                                zIndex: images.length - index,
                                transform: `rotate(${index * 3}deg) translateX(${index * 8}px)`,
                            }"
                            class="absolute inset-0 w-full h-full cursor-pointer transition-all duration-300 hover:scale-105"
                            :class="[
                                index === 0
                                    ? 'hover:scale-110 hover:rotate-1'
                                    : '',
                            ]"
                        >
                            <div class="relative group">
                                <NuxtImg
                                    :src="image.src"
                                    :alt="image.alt"
                                    class="w-52 h-64 lg:w-64 lg:h-80 object-cover rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl border-2 border-white/30"
                                />

                                <div
                                    class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                />

                                <div
                                    class="absolute bottom-3 left-3 text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    {{ image.alt }}
                                </div>
                            </div>
                        </div>
                    </template>
                </div>

                <div
                    class="text-base-content/50 text-xs lg:text-sm font-mono text-center mt-5 border-t border-base-300 pt-3 rounded-lg"
                >
                    {{ constants?.teaching?.section?.pictureCaption }}
                </div>
            </div>
        </div>
    </div>
</template>
