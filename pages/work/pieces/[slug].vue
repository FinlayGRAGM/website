<script setup>
definePageMeta({
    layout: "padding",
});

const COLLECTION = `pieces`;
const slug = useRoute().params.slug;

const { data: post } = await useAsyncData(
    `${COLLECTION}-${slug}`,
    () => {
        return queryCollection(COLLECTION).path(`/${slug}`).first();
    },
    { server: true, lazy: false },
);

const options = await useConstants();

console.log("post:", post.value);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const audioRef = ref(null);

const updateTime = () => {
    if (audioRef.value) {
        currentTime.value = audioRef.value.currentTime;
    }
};

const updateDuration = () => {
    if (audioRef.value) {
        duration.value = audioRef.value.duration;
    }
};

const handleEnded = () => {
    isPlaying.value = false;
};

const togglePlayPause = () => {
    if (!audioRef.value) return;

    if (isPlaying.value) {
        audioRef.value.pause();
    } else {
        audioRef.value.play();
    }
    isPlaying.value = !isPlaying.value;
};

const handleSeek = (event) => {
    if (!audioRef.value) return;

    const newTime = (parseFloat(event.target.value) / 100) * duration.value;
    audioRef.value.currentTime = newTime;
    currentTime.value = newTime;
};

const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Setup audio event listeners
onMounted(() => {
    if (audioRef.value) {
        audioRef.value.addEventListener("timeupdate", updateTime);
        audioRef.value.addEventListener("loadedmetadata", updateDuration);
        audioRef.value.addEventListener("ended", handleEnded);
    }
});

onUnmounted(() => {
    if (audioRef.value) {
        audioRef.value.removeEventListener("timeupdate", updateTime);
        audioRef.value.removeEventListener("loadedmetadata", updateDuration);
        audioRef.value.removeEventListener("ended", handleEnded);
    }
});

// If no post found, handle error
if (!post.value) {
    throw createError({
        statusCode: 404,
        statusMessage: "Piece not found",
    });
}

// Composition page meta data
useSiteMeta({
    title: post.value?.title,
    description:
        post.value?.description ||
        `A musical composition by ${post.value?.composer || "Finlay Graham"}.`,
    type: "article",
    publishedTime: post.value?.date
        ? new Date(post.value?.date).toISOString()
        : undefined,
    articleSection: "Compositions",
    articleTags: [
        "composition",
        "music",
        "classical music",
        post.value?.meta?.type?.toLowerCase(),
    ].filter(Boolean),
    keywords: [
        "composition",
        "music",
        "classical music",
        "contemporary music",
        post.value?.meta?.type?.toLowerCase(),
        post.value?.title?.toLowerCase(),
        "musical score",
        "sheet music",
    ].filter(Boolean),
});

// Structured data for music composition
useStructuredData({
    type: "MusicComposition",
    data: {
        name: post.value?.title,
        description: post.value?.description,
        composer: post.value?.composer || "Finlay Graham",
        dateCreated: post.value?.date,
        genre: post.value?.meta?.type || "Contemporary Classical",
        duration: post.value?.meta?.duration,
    },
});
</script>

<template>
    <div v-if="!post" class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-2xl font-serif grad-text mb-4">Piece Not Found</h1>
            <button @click="$router.back()"
                class="px-6 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 transition-colors">
                Go Back
            </button>
        </div>
    </div>

    <div v-else class="min-h-screen font-sans">
        <div class="max-w-4xl mx-auto px-4 md:px-6 py-6">
            <!-- Hero Section -->
            <div class="glass-card rounded-lg p-6 md:p-12 shadow-lg mb-8">
                <div class="text-center mb-8">
                    <h1 class="text-4xl md:text-6xl font-serif font-light grad-text mb-4">
                        {{ post.title }}
                    </h1>
                    <div class="flex flex-wrap justify-center gap-4 text-base-content/70 mb-6">
                        <span v-if="post.meta?.type" class="flex items-center">
                            <Icon name="ph:music-note" size="16" class="mr-2" />
                            {{ post.meta.type }}
                        </span>
                        <span v-if="post.meta?.year" class="flex items-center">
                            <Icon name="ph:calendar" size="16" class="mr-2" />
                            {{ post.meta.year }}
                        </span>
                        <span v-if="post.meta?.duration" class="flex items-center">
                            <Icon name="ph:clock" size="16" class="mr-2" />
                            {{ post.meta.duration }}
                        </span>
                    </div>
                    <p class="text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
                        {{ post.description }}
                    </p>
                </div>

                <!-- Audio Player -->
                <div v-if="post.meta?.audio" class="bg-three-grad-dark rounded-lg p-6 text-accent-content">
                    <audio ref="audioRef" :src="post.meta?.audio" preload="metadata" />

                    <div class="flex items-center gap-4 mb-4">
                        <button @click="togglePlayPause"
                            class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm">
                            <Icon v-if="isPlaying" name="ph:pause" size="24" />
                            <Icon v-else name="ph:play" size="24" />
                        </button>

                        <div class="flex-1">
                            <input type="range" min="0" max="100" :value="duration
                                ? (currentTime / duration) * 100
                                : 0
                                " @input="handleSeek"
                                class="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider" />

                            <div class="flex justify-between text-sm mt-1 opacity-90">
                                <span>{{ formatTime(currentTime) }}</span>
                                <span>{{ formatTime(duration) }}</span>
                            </div>
                        </div>
                    </div>

                    <p v-if="post.meta?.premiere" class="text-center text-sm opacity-90">
                        Premiere: {{ post.meta.premiere }}
                    </p>
                </div>
            </div>

            <!-- Content Sections -->
            <div class="space-y-8">
                <!-- Program Notes -->
                <div v-if="post?.rawbody" class="glass-card rounded-lg p-6 md:p-8 shadow-lg">
                    <h2 class="text-2xl md:text-3xl font-serif font-light grad-text mb-6">
                        Program Notes
                    </h2>
                    <div class="text-base-content/70 leading-relaxed prose prose-primary max-w-none">
                        <ContentRenderer :value="post" />
                    </div>
                </div>

                <!-- Technical Details -->
                <div class="grid md:grid-cols-2 gap-6">
                    <div v-if="post.meta?.instrumentation" class="glass-card rounded-lg p-6 shadow-lg">
                        <h3 class="text-xl font-serif font-semibold text-primary mb-4">
                            Instrumentation
                        </h3>
                        <template v-if="Array.isArray(post.meta.instrumentation)">
                            <ul class="text-base-content/70 space-y-2">
                                <li v-for="(instrument, index) in post.meta
                                    .instrumentation" :key="index" class="text-sm">
                                    {{ instrument }}
                                </li>
                            </ul>
                        </template>
                        <p v-else class="text-base-content/70">
                            {{ post.meta.instrumentation }}
                        </p>
                    </div>

                    <div v-if="post.meta?.movements" class="glass-card rounded-lg p-6 shadow-lg">
                        <h3 class="text-xl font-serif font-semibold text-primary mb-4">
                            Movements
                        </h3>
                        <ul class="text-base-content/70 space-y-2">
                            <li v-for="(movement, index) in post.meta.movements" :key="index" class="text-sm">
                                {{ movement }}
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Performance Information -->
                <div v-if="options?.pieces?.performanceInfo"
                    class="glass-card rounded-lg p-6 md:p-8 shadow-lg bg-three-grad">
                    <h2 class="text-2xl md:text-3xl font-serif font-light grad-text mb-6">
                        {{ options.pieces.performanceInfo.title }}
                    </h2>
                    <div class="secondary-bg rounded-lg p-6 border border-white/20">
                        <p class="text-base-content/70 mb-4">
                            {{ options.pieces.performanceInfo.description }}
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4">
                            <NuxtLink v-if="post.meta?.score" :to="post.meta.score" class="cta-btn-primary">
                                {{
                                    options.pieces.performanceInfo.buttons.score
                                        .label
                                }}
                            </NuxtLink>
                            <NuxtLink :to="options.pieces.performanceInfo.buttons
                                .contact.link
                                " class="cta-btn-secondary">
                                {{
                                    options.pieces.performanceInfo.buttons
                                        .contact.label
                                }}
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "../../../assets/css/main.css";

.glass-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.musical-gradient {
    background: linear-gradient(135deg,
            oklch(var(--color-primary)) 0%,
            oklch(var(--color-secondary)) 100%);
}

.secondary-bg {
    background: oklch(var(--color-secondary) / 0.1);
}

/* Custom slider styles */
.slider::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.prose {
    color: inherit;
}

.prose p {
    margin-bottom: 1rem;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
    color: oklch(var(--color-primary));
    font-family: serif;
    font-weight: 600;
    margin-bottom: 0.5rem;
    margin-top: 1.5rem;
}

.prose h1:first-child,
.prose h2:first-child,
.prose h3:first-child {
    margin-top: 0;
}
</style>
