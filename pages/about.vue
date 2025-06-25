<script setup>
const constants = await useConstants();

definePageMeta({
    layout: "default",
});

useSiteMeta({
    title: constants.value?.about?.page?.title,
    description: constants.value?.contact.sentenceAbout,
    type: "profile",
    keywords: constants.value?.about?.meta?.keywords?.split(", ") || [
        "about",
        "biography",
        "composer biography",
        "education",
        "achievements",
        "philosophy",
        "musical education",
        "composition teacher",
        "music philosophy",
    ],
});

// Structured data for person
useStructuredData({
    type: "Person",
    data: {
        name: constants.value?.contact?.name,
        jobTitle: constants.value?.contact?.shortDescription,
        description: constants.value?.contact.sentenceAbout,
        image: constants.value?.homepage?.smallPhoto,
        email: constants.value?.contact?.email,
        affiliation: constants.value?.contact?.college,
        alumniOf: constants.value?.about?.structuredData?.alumniOf || [],
        knowsAbout: constants.value?.about?.structuredData?.knowsAbout || [],
        sameAs: [
            constants.value?.socials?.github?.link,
            `mailto:${constants.value?.contact?.email}`,
        ].filter(Boolean),
    },
});

const { data: musicStatement } = await getFile(
    "general",
    "music_statement",
    "asyncdata",
);
const { data: longAbout } = await getFile("general", "long_about", "asyncdata");

const achievements = constants.value?.about?.achievements || [];
const education = constants.value?.about?.education || [];

const navigationItems = [
    {
        selector: "#biography-title",
        container: "#biography-container",
        title:
            constants.value?.about?.navigation?.biography?.title || "Biography",
    },
    {
        selector: "#education-title",
        container: "#education-container",
        title:
            constants.value?.about?.navigation?.education?.title || "Education",
    },
    {
        selector: "#achievements-title",
        container: "#achievements-container",
        title:
            constants.value?.about?.navigation?.achievements?.title ||
            "Achievements",
    },
    {
        selector: "#philosophy-title",
        container: "#philosophy-container",
        title:
            constants.value?.about?.navigation?.philosophy?.title ||
            "Philosophy",
    },
    {
        title: constants.value?.about?.navigation?.cv?.title || "CV",
        external: true,
        link: constants.value?.contact?.cv,
    },
];
</script>

<template>
    <div class="min-h-screen font-sans">
        <!-- Hero Section -->
        <section class="work-hero">
            <div class="work-hero-bg"></div>
            <div class="absolute inset-0">
                <div
                    class="absolute top-10 left-4 w-16 h-16 rounded-full bg-primary/20"
                ></div>
                <div
                    class="absolute bottom-20 right-8 w-12 h-12 rounded-full bg-secondary/30"
                    style="animation-delay: 2s"
                ></div>
            </div>

            <div class="work-hero-content">
                <div class="text-5xl mb-6">
                    <Icon
                        name="ph:user"
                        class="w-16 h-16 mx-auto text-primary"
                    />
                </div>
                <h1 class="work-hero-title">
                    {{
                        constants?.about?.hero?.title ||
                        `About ${constants?.contact?.name}`
                    }}
                </h1>
                <p class="work-hero-subtitle">
                    {{ constants?.contact?.sentenceAbout }}
                </p>
            </div>
        </section>
        <Navigation :items="navigationItems">
            <div class="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
                <div
                    class="glass-card p-8 md:p-12 shadow-lg mb-12"
                    id="biography-container"
                >
                    <h2
                        class="text-3xl font-serif font-light grad-text mb-8"
                        id="biography-title"
                    >
                        {{
                            constants?.about?.sections?.biography?.title ||
                            "Biography"
                        }}
                    </h2>
                    <div class="grid lg:grid-cols-3 gap-8">
                        <div
                            class="lg:col-span-2 space-y-6 text-base-content/70 leading-relaxed"
                        >
                            <ContentRenderer :value="longAbout" />
                        </div>
                        <div class="space-y-6">
                            <div
                                class="bg-three-grad rounded-lg aspect-[3/4] flex items-center justify-center shadow-lg overflow-hidden"
                            >
                                <Image
                                    imgid="headshot"
                                    :alt="
                                        'Photo of ' + constants?.contact?.name
                                    "
                                    class="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Education -->
                <div
                    class="glass-card p-8 md:p-12 shadow-lg mb-12"
                    id="education-container"
                >
                    <h2
                        class="text-3xl font-serif font-light grad-text mb-8"
                        id="education-title"
                    >
                        {{
                            constants?.about?.sections?.education?.title ||
                            "Education"
                        }}
                    </h2>
                    <div class="space-y-6">
                        <div
                            v-for="(edu, index) in education"
                            :key="index"
                            class="flex items-start gap-4 p-6 secondary-bg rounded-lg border border-white/20"
                        >
                            <div class="flex-1">
                                <h3
                                    class="font-serif text-xl font-semibold text-primary mb-1"
                                >
                                    {{ edu.institution }}
                                </h3>
                                <p
                                    class="font-mono text-sm text-secondary mb-2"
                                >
                                    {{ edu.degree }}
                                </p>
                                <div
                                    class="flex items-center gap-4 text-sm text-base-content/60"
                                >
                                    <div class="flex items-center gap-1">
                                        <Icon
                                            name="ph:map-pin"
                                            class="w-3.5 h-3.5"
                                        />
                                        <span>{{ edu.location }}</span>
                                    </div>
                                    <span>{{ edu.year }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Achievements -->
                <div
                    class="glass-card p-8 md:p-12 shadow-lg mb-12"
                    id="achievements-container"
                >
                    <h2
                        class="text-3xl font-serif font-light grad-text mb-8"
                        id="achievements-title"
                    >
                        {{
                            constants?.about?.sections?.achievements?.title ||
                            "Recent Achievements"
                        }}
                    </h2>
                    <div class="grid md:grid-cols-2 gap-6">
                        <div
                            v-for="(achievement, index) in achievements"
                            :key="index"
                            class="flex items-start gap-4 p-6 secondary-bg rounded-lg border border-white/20"
                        >
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-2">
                                    <h3
                                        class="font-serif text-lg font-semibold text-primary"
                                    >
                                        {{ achievement.title }}
                                    </h3>
                                    <span
                                        class="text-xs font-mono text-secondary bg-accent/20 px-2 py-1 rounded"
                                    >
                                        {{ achievement.year }}
                                    </span>
                                </div>
                                <p class="text-sm text-base-content/60">
                                    {{ achievement.description }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Music Statement / Philosophy -->
                <div
                    class="glass-card p-8 md:p-12 shadow-lg mb-12"
                    id="philosophy-container"
                >
                    <h2
                        class="text-3xl font-serif font-light grad-text mb-8"
                        id="philosophy-title"
                    >
                        {{
                            musicStatement.title ||
                            constants?.about?.sections?.philosophy?.title ||
                            "Compositional Philosophy"
                        }}
                    </h2>
                    <div
                        class="prose prose-lg max-w-none text-base-content/70 leading-relaxed"
                    >
                        <ContentRenderer :value="musicStatement" />
                    </div>
                </div>
            </div>
        </Navigation>
    </div>
</template>

<style scoped>
@import "../assets/css/main.css";

button:focus-visible {
    @apply outline-2 outline-offset-2 outline-gray-900;
}

.secondary-bg {
    @apply bg-secondary/10;
}
</style>
