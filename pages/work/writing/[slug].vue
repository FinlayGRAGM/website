<script setup>
definePageMeta({
    layout: "padding",
});

const constants = await useConstants();
const COLLECTION = `writing`;

const slug = useRoute().params.slug;
const { data: post } = await useAsyncData(
    `${COLLECTION}-${slug}`,
    () => {
        return queryCollection(COLLECTION).path(`/${slug}`).first();
    },
    { server: true, lazy: false },
);

// Writing page meta data
useSiteMeta({
    title: post.value?.title,
    description:
        post.value?.description ||
        `A written piece by ${constants.value?.contact?.name || "Finlay Graham"}.`,
    type: "article",
    publishedTime: post.value?.date
        ? new Date(post.value?.date).toISOString()
        : undefined,
    articleSection: "Writing",
    articleTags: ["writing", "creative writing", "literature"],
    keywords: [
        "writing",
        "creative writing",
        "literature",
        "prose",
        "poetry",
        post.value?.title?.toLowerCase(),
    ].filter(Boolean),
});

// Determine if content is long (more than 800 characters)
const isLongContent = computed(() => {
    return post?.value?.rawbody && post.value.rawbody.length > 800;
});
</script>

<template>
    <div class="font-sans py-4 pt-10 flex-1 max-w-4xl h-full mx-auto px-4 md:px-6 flex flex-col">
            <!-- Header Section -->
            <div class="text-center">
                <h1 class="text-4xl md:text-5xl font-serif font-light text-base-content mb-6 leading-tight decor-underline">
                    {{ post?.title }}
                </h1>
                
                <!-- Author and Date -->
                <div class="flex items-center justify-center gap-4 text-base-content/70 mb-8">
                    <div class="flex items-center gap-2">
                        <Icon name="ph:user" class="w-4 h-4" />
                        <span class="font-medium">{{ constants?.contact?.name || "Finlay Graham" }}</span>
                    </div>
                    <div class="w-1 h-1 rounded-full bg-base-content/40"></div>
                    <div class="flex items-center gap-2" v-if="post?.date">
                        <Icon name="ph:calendar" class="w-4 h-4" />
                        <span>{{ new Date(post.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        }) }}</span>
                    </div>
                </div>

                <!-- Description for long content -->
                <div v-if="isLongContent && post?.description" class="max-w-2xl mx-auto mb-12">
                    <p class="text-lg text-base-content/70 leading-relaxed italic">
                        {{ post.description }}
                    </p>
                </div>
            </div>

            <!-- Content Section -->
            <article class="max-w-3xl mx-auto flex-1">
                <div class="writing-content prose prose-sm md:prose-md prose-primary prose-base-content max-w-none text-center">
                    <ContentRenderer :value="post" />
                </div>
            </article>
            <!-- Description for short content (bottom aligned) -->
            <div v-if="!isLongContent && post?.description" class="mt-4 py-2 border-t border-base-content/20">
                <p class="text-center text-base-content/70 italic leading-relaxed max-w-2xl mx-auto">
                    {{ post.description }}
                </p>
            </div>
    </div>
</template>

<style scoped>
@import '../../../assets/css/main.css';

.writing-content {
    line-height: 1.8;
}

.writing-content :deep(p) {
    @apply text-lg md:text-xl leading-relaxed mb-6;
}

.writing-content :deep(h1),
.writing-content :deep(h2),
.writing-content :deep(h3) {
    @apply font-serif font-light text-center;
}

.writing-content :deep(blockquote) {
    @apply border-l-4 border-primary/30 pl-6 italic text-base-content/80;
}

.writing-content :deep(em) {
    @apply text-base-content/80;
}

.writing-content :deep(strong) {
    @apply text-base-content font-semibold;
}

/* Poetry-specific styling for verse layout */
.writing-content :deep(br) {
    @apply block my-2;
}
</style>
