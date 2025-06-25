<script setup>
const constants = await useConstants();

const { data: pieces } = await useAsyncData(
    "recentPieces",
    () => {
        return queryCollection("pieces").all();
    },
    { server: true, lazy: false },
);

const { data: writing } = await useAsyncData(
    "recentWriting",
    () => {
        return queryCollection("writing").all();
    },
    { server: true, lazy: false },
);

const recentWorks = computed(() => {
    const allWorks = [];

    if (pieces.value) {
        allWorks.push(
            ...pieces.value.map((piece) => ({
                ...piece,
                type: "composition",
                pathPrefix: "/work/pieces",
            })),
        );
    }

    if (writing.value) {
        allWorks.push(
            ...writing.value.map((writing) => ({
                ...writing,
                type: "writing",
                pathPrefix: "/work/writing",
            })),
        );
    }

    return allWorks
        .sort((a, b) => {
            if (a.date && b.date) {
                return new Date(b.date) - new Date(a.date);
            }
            return 0;
        })
        .slice(0, 6); // Show only first 6 recent works
});
</script>

<template>
    <div class="py-16 md:py-24">
        <div class="max-w-5xl mx-auto px-4 md:px-6">
            <!-- Section Header -->
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-serif font-light grad-text mb-4 decor-underline hover-underline">
                    {{ constants?.homepage?.recentAndUpcoming?.title }}
                </h2>
                <p class="text-xl text-base-content/70 max-w-3xl mx-auto">
                    Discover the latest compositions and upcoming projects
                </p>
            </div>
            <div class="flex gap-12 flex-col lg:flex-row">
                <!-- Recent Work Section -->
                <section class="mb-20">
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <h3
                                class="text-2xl md:text-3xl font-serif font-light text-base-content mb-2 decor-underline">
                                {{
                                    constants?.homepage?.recentAndUpcoming?.recent
                                        ?.title
                                }}
                            </h3>
                            <p class="text-base-content/60">
                                {{
                                    constants?.homepage?.recentAndUpcoming?.recent
                                        ?.subtitle
                                }}
                            </p>
                        </div>
                        <NuxtLink to="/work" class="btn btn-ghost btn-md gap-2 hover:gap-3 transition-all duration-300">
                            View All
                            <Icon name="ph:arrow-right" class="w-4 h-4" />
                        </NuxtLink>
                    </div>

                    <!-- Recent Works Grid -->
                    <div class="grid lg:grid-cols-2 gap-6">
                        <FancyCard v-for="work in recentWorks" :key="work.path" :title="work.title" :type="work.type === 'composition'
                            ? 'Composition'
                            : 'Writing'
                            " :description="work.description ||
                                'A new work exploring musical possibilities'
                                " :year="work.date
                                    ? new Date(work.date).getFullYear().toString()
                                    : ''
                                    " :icon="work.type === 'composition'
                                        ? 'ph:music-notes'
                                        : 'ph:pen-nib'
                                        " :color-var="work.type === 'composition'
                                            ? '--color-primary'
                                            : '--color-secondary'
                                            " :to="`${work.pathPrefix}/${work.path.split('/').pop()}`" />
                    </div>
                </section>
                <hr class="my-6 border-base-content/60 border-dashed" />
                <!-- Upcoming Work Section -->
                <section>
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <h3
                                class="text-2xl md:text-3xl font-serif font-light text-base-content mb-2 decor-underline">
                                {{
                                    constants?.homepage?.recentAndUpcoming?.upcoming
                                        ?.title
                                }}
                            </h3>
                            <p class="text-base-content/60">
                                {{
                                    constants?.homepage?.recentAndUpcoming?.upcoming
                                        ?.subtitle
                                }}
                            </p>
                        </div>
                    </div>

                    <!-- Upcoming Works Grid -->
                    <div class="flex flex-col gap-6">
                        <!-- <FancyCard v-for="work in upcomingWorks" :key="work.title" :title="work.title" :subtle="true"
            :type="work.type === 'composition' ? 'Composition' : 'Writing'" :description="work.description"
            :year="work.expectedDate" :icon="work.type === 'composition' ? 'ph:music-notes' : 'ph:pen-nib'"
            :color-var="work.type === 'composition' ? '--color-primary' : '--color-secondary'" /> -->
                        <div class="item border-y-1 transition-all duration-300 border-accent/90 border-dotted hover:my-2 hover:py-2 py-4 flex gap-3 flex-col"
                            v-for="work in constants?.homepage?.recentAndUpcoming?.upcomingWorks" :key="work.title">
                            <h4 class="text-md font-semibold">{{ work.title }}</h4>
                            <p class="text-base-content/80">
                                {{ work.description }}
                            </p>
                            <p class="text-base-content/80 text-sm">
                                {{ work.expectedDate }}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<style scoped>
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
