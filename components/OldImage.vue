<template>
    <div class="relative overflow-hidden" :style="containerStyle">
        <!-- AIDEV-NOTE: Shimmer only shows when loading and no blurhash available -->
        <div
            v-if="shouldShowShimmer"
            class="absolute inset-0 shimmer-gradient animate-shimmer"
            :style="shimmerStyle"
        />

        <!-- AIDEV-NOTE: UnLazyImage with proper blurhash integration and event handling -->
        <UnLazyImage
            v-if="resolvedSrc"
            :src="resolvedSrc"
            :alt="alt"
            :blurhash="resolvedBlurhash || undefined"
            :ssr="true"
            :lazy-load="true"
            :class="imageClass"
            :style="imageStyle"
            v-bind="$attrs"
            @loaded="handleLoad"
            @error="handleError"
        />

        <!-- Fallback for missing images -->
        <div
            v-else-if="!resolvedSrc && !isLoading"
            class="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary/50"
            :style="containerStyle"
        >
            <Icon name="heroicons:photo" class="w-12 h-12" />
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    src?: string;
    imgid?: string;
    alt: string;
    width?: number | string;
    height?: number | string;
    aspectRatio?: string;
    class?: string;
    cover?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    class: "",
    cover: false,
});

const isLoading = ref(true);

const { data: mediaItem, pending } = await useAsyncData(
    () => (props.imgid ? `media-${props.imgid}` : "media-none"),
    async () => {
        if (!props.imgid) return null;
        return await queryCollection("media").path(props.imgid).first();
    },
    {
        server: true,
        default: () => null,
        watch: [() => props.imgid],
    },
);

watch(
    [() => props.imgid, pending],
    ([newImgid, newPending]) => {
        if (newImgid && newPending) {
            isLoading.value = true;
        } else if (!newImgid) {
            isLoading.value = false;
        }
    },
    { immediate: true },
);

const resolvedSrc = computed(() => {
    if (mediaItem.value) {
        return `/media/${mediaItem.value.path}/${mediaItem.value.image}`;
    }
    return props.src || "";
});

const resolvedBlurhash = computed(() => mediaItem.value?.blurhash || "");

const imageDimensions = computed(() => {
    if (mediaItem.value?.metadata?.width && mediaItem.value?.metadata?.height) {
        return {
            width: mediaItem.value.metadata.width,
            height: mediaItem.value.metadata.height,
        };
    }
    return {
        width: props.width,
        height: props.height,
    };
});

const containerStyle = computed(() => {
    if (props.cover) {
        return {
            width: "100%",
            height: "100%",
        };
    }

    const dims = imageDimensions.value;
    return {
        aspectRatio:
            props.aspectRatio ||
            (dims.width && dims.height
                ? `${dims.width}/${dims.height}`
                : "auto"),
        width: props.width ? `${props.width}px` : "100%",
        height: props.height ? `${props.height}px` : "auto",
    };
});

const imageClass = computed(
    () =>
        `w-full h-full object-cover transition-opacity duration-300 ${props.class}`,
);

const imageStyle = computed(() => ({
    opacity: isLoading.value ? 0 : 1,
}));

const shimmerStyle = computed(() => ({
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
}));

const shouldShowShimmer = computed(
    () => isLoading.value && !resolvedBlurhash.value,
);

const handleLoad = () => {
    isLoading.value = false;
};

const handleError = (event: Event) => {
    console.error("Image failed to load:", resolvedSrc.value);
    isLoading.value = false;
};
</script>

<style scoped>
@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
}

.shimmer-gradient {
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.1) 25%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0.1) 75%
    );
    background-size: 200% 100%;
}

.animate-shimmer {
    animation: shimmer 1.5s ease-in-out infinite;
}
</style>
