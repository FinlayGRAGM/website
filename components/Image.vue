<template>
    <NuxtLink
        :to="noLink ? '' : imageSrc"
        @click="handleClick"
        target="_blank"
        rel="noopener"
        class="relative overflow-hidden"
        :style="containerStyle"
        tabindex="-1"
        aria-label="Open image in new tab"
    >
        <!-- AIDEV-NOTE: UnLazyImage with blurhash integration - add loading state to prevent unlazy errors -->
        <UnLazyImage
            v-if="imageSrc && !pending"
            :src="imageSrc"
            :alt="alt"
            :blurhash="mediaItem?.blurhash || undefined"
            :ssr="true"
            :lazy-load="true"
            :class="imageClass"
            v-bind="$attrs"
            @loaded="handleLoad"
            @error="handleError"
        />

        <!-- Loading state while fetching new image data -->
        <div
            v-else-if="pending"
            class="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center"
            :style="containerStyle"
        >
            <Icon
                name="heroicons:arrow-path"
                class="w-8 h-8 animate-spin text-primary/50"
            />
        </div>

        <!-- Fallback for missing images -->
        <div
            v-else
            class="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary/50"
            :style="containerStyle"
        >
            <Icon name="heroicons:photo" class="w-12 h-12" />
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
    imgid: string;
    alt: string;
    width?: number | string;
    height?: number | string;
    aspectRatio?: string;
    class?: string;
    cover?: boolean;
    noLink?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    class: "",
    cover: false,
});

const { data: mediaItem, pending } = await useAsyncData(
    `media-${props.imgid}`,
    async () => {
        const transformedId = props.imgid.replace(/^\//, "");
        console.log("transformedId", transformedId);
        let out = await queryCollection("media")
            .path("/" + transformedId)
            .first();
        console.log("mediaItem", out);
        if (!out) {
            console.error("Media item not found", transformedId);
            return null;
        }
        return out;
    },
    {
        server: true,
        watch: [() => props.imgid],
    },
);

const imageSrc = computed(() => {
    if (!mediaItem.value) return "";
    return `/media${mediaItem.value.path}/${mediaItem.value.image}`;
});

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
        height: props.height ? `${props.height}px` : "100%",
    };
});

const imageClass = computed(
    () =>
        `w-full h-full object-cover transition-opacity duration-300 ${props.class}`,
);

const handleLoad = () => {};

const handleError = (event: Event) => {
    console.error("Image failed to load:", imageSrc.value);
};

const handleClick = () => {
    if (props.noLink) {
        return;
    }
};
</script>

<style scoped>
/* AIDEV-NOTE: Removed shimmer animation - UnLazyImage + blurhash handles loading states */
</style>
