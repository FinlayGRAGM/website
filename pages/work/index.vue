<script setup>
definePageMeta({
    layout: "default",
});
const constants = await useConstants();

// Work page meta data
useSiteMeta({
    title: constants.value?.work?.hero?.title || "Work",
    description:
        "A collection of compositions and writing, each piece crafted to explore the intersection of tradition and innovation.",
    keywords: [
        "work",
        "compositions",
        "writing",
        "musical works",
        "portfolio",
        "creative works",
        "contemporary compositions",
        "classical compositions",
        "musical portfolio",
    ],
});

const { data: pieces } = await useAsyncData(
    "pieces",
    () => {
        return queryCollection("pieces").all();
    },
    { server: true, lazy: false },
);

const { data: writing } = await useAsyncData(
    "writing",
    () => {
        return queryCollection("writing").all();
    },
    { server: true, lazy: false },
);

const selectedCategory = ref("pieces");

const categories = [
    { id: "all", name: "All Works" },
    { id: "pieces", name: "Compositions" },
    { id: "writing", name: "Writing" },
];

const colorVariants = [
    "--color-primary",
    "--color-secondary",
    "--color-accent",
];

const getRandomColor = (idx) => {
    return colorVariants[idx % colorVariants.length];
};

const allWorks = computed(() => {
    const piecesData =
        pieces.value?.map((item, idx) => ({
            ...item,
            path: "/work/pieces" + item.path,
            category: "pieces",
            type: item.type || "Composition",
            description:
                item.description ||
                "A musical composition exploring themes of expression and creativity.",
            year: item.date
                ? new Date(item.date).getFullYear().toString()
                : "2024",
            duration: item.duration || "~12:00",
            colorVar: getRandomColor(idx),
        })) || [];

    const writingData =
        writing.value?.map((item, idx) => ({
            ...item,
            path: "/work/writing" + item.path,
            category: "writing",
            type: item.type || "Writing",
            description:
                item.description ||
                "A written exploration of language, emotion, and human experience.",
            year: item.date
                ? new Date(item.date).getFullYear().toString()
                : "2024",
            duration: item.duration || "~5 min read",
            colorVar: getRandomColor(idx + 1000),
        })) || [];

    // Sort compositions first, then writing
    return [...piecesData, ...writingData].sort((a, b) => {
        if (a.category === "pieces" && b.category === "writing") return -1;
        if (a.category === "writing" && b.category === "pieces") return 1;
        return 0;
    });
});

const filteredWorks = computed(() => {
    if (selectedCategory.value === "all") {
        return allWorks.value;
    }
    return allWorks.value.filter(
        (work) => work.category === selectedCategory.value,
    );
});
</script>

<template>
    <div class="min-h-screen font-sans">
        <!-- Hero Section -->
        <section class="work-hero">
            <div class="work-hero-bg"></div>
            <div class="absolute inset-0">
                <div class="absolute top-10 left-4 w-16 h-16 rounded-full bg-primary/20"></div>
                <div class="absolute bottom-20 right-8 w-12 h-12 rounded-full bg-accent/30" style="animation-delay: 2s">
                </div>
            </div>

            <div class="work-hero-content">
                <h1 class="work-hero-title">
                    {{ constants?.work?.hero?.title || "Work" }}
                </h1>
                <p class="work-hero-subtitle">
                    {{
                        constants?.work?.hero?.subtitle ||
                        "A collection of compositions and writing, exploring the intersection of tradition and innovation."
                    }}
                </p>
            </div>
        </section>

        <div class="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
            <!-- Category Filter -->
            <div class="category-filter">
                <h2 class="text-2xl font-serif font-light grad-text mb-6 text-center">
                    Browse by Category
                </h2>
                <div class="flex flex-wrap justify-center gap-4">
                    <button v-for="(category, index) in categories" :key="category.id"
                        @click="selectedCategory = category.id" :style="{
                            '--btn-accent': `var(${getRandomColor(index)})`,
                            '--btn-accent-content': `var(--color-accent-content)`,
                        }" :class="selectedCategory === category.id
                            ? 'category-btn-active'
                            : 'category-btn-inactive'
                            ">
                        {{ category.name }}
                    </button>
                </div>
            </div>

            <!-- Works Grid -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FancyCard v-for="(work, index) in filteredWorks" :key="index" :title="work.title" :type="work.type"
                    :description="work.description" :year="work.year" :duration="work.duration" :icon="work.category === 'writing'
                        ? 'ph:pen-nib'
                        : 'ph:music-notes'
                        " :color-var="work.colorVar" :to="work.path" />
            </div>
        </div>
    </div>
</template>
