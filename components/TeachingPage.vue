<script setup lang="ts">
import { ref, computed } from "vue";

const constants = await useConstants();

const selectedSubject = ref("Music Composition");

const subjects = computed(() => constants.value?.teaching?.subjects || []);
const philosophy = computed(() => constants.value?.teaching?.philosophy || {});
const lessonDetails = computed(
    () => constants.value?.teaching?.lessonDetails || {},
);
const contact = computed(() => constants.value?.contact || {});
</script>

<template>
    <div class="margin-block h-30 my-0 w-screen bg-primary/10"></div>
    <div class="min-h-screen bg-base-100">
        <!-- Hero Section -->
        <section class="relative pt-24 pb-16 md:py-32 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-b from-primary/10 via-accent/10 to-transparent"></div>

            <div class="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
                <h1 class="h1 mb-6">
                    {{ constants?.teaching?.section?.title }}
                </h1>
                <p class="text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
                    {{ constants?.teaching?.section?.description }}
                </p>
            </div>
        </section>
        <!-- Location & Contact Info -->
        <section class="py-16">
            <div class="max-w-6xl mx-auto px-4 md:px-6">
                <div
                    class="bg-base-100/80 shadow-2xl shadow-primary/20 border border-base-300 rounded-lg p-6 md:p-12 mb-12">
                    <h2 class="font-serif text-4xl font-light text-base-content mb-8 text-center">
                        {{ constants?.teaching?.studio?.title }}
                    </h2>
                    <div class="grid md:grid-cols-3 gap-8">
                        <div class="text-center">
                            <div class="studio-info-icon">
                                <Icon name="ph:map-pin-light" class="w-8 h-8" />
                            </div>
                            <h3 class="text-lg font-medium text-base-content mb-2">
                                Locations
                            </h3>
                            <div class="text-base-content/70 text-sm space-y-2">
                                <div v-for="location in contact.locations" :key="location.place">
                                    <div class="font-medium">
                                        {{ location.place }}
                                    </div>
                                    <div class="text-xs font-mono">
                                        {{ location.period }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="text-center">
                            <div class="studio-info-icon">
                                <Icon name="ph:clock-light" class="w-8 h-8" />
                            </div>
                            <h3 class="text-lg font-medium text-base-content mb-2">
                                Schedule
                            </h3>
                            <p class="text-base-content/70 text-sm">
                                {{ lessonDetails.lessonLength }}<br />
                                {{ lessonDetails.rate }}<br />
                                {{ lessonDetails.introSession }}
                            </p>
                        </div>

                        <div class="text-center">
                            <div class="studio-info-icon">
                                <Icon name="ph:monitor-light" class="w-8 h-8" />
                            </div>
                            <h3 class="text-lg font-medium text-base-content mb-2">
                                Format
                            </h3>
                            <p class="text-base-content/70 text-sm">
                                {{ lessonDetails.format }}<br />
                                {{ lessonDetails.ages }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Subjects & Curriculum -->
        <section class="py-16 border-t border-base-300 pattern-cross-dots-sm mask-b-from-[calc(100%-100px)]">
            <div class="max-w-6xl mx-auto px-4 md:px-6">
                <div class="">
                    <h2 class="text-4xl font-serif font-light text-base-content mb-8">
                        {{ constants?.teaching?.pickerTitle }}
                    </h2>

                    <ul class="flex flex-col gap-7">
                        <li v-for="subject in subjects" class="hover:pl-1 transition-all duration-150">
                            <h3 class="text-2xl font-light decor-underline decoration-2 text-primary-dark font-serif">
                                {{
                                    subject.title }}</h3>
                            <p class="text-base-content/70">{{ subject.description }}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- Teaching Philosophy -->
        <section class="py-16 bg-gradient-to-b from-transparent to-primary/10">
            <div class="max-w-4xl mx-auto px-4 md:px-6">
                <h2 class="font-serif text-3xl font-light text-base-content mb-8 text-center">
                    {{ philosophy.title }}
                </h2>
                <div class="grid md:grid-cols-2 gap-6">
                    <blockquote v-for="(statement, index) in philosophy.statements" :key="index"
                        class="text-base-content/80 italic border-l-4 border-primary pl-6 py-2">
                        "{{ statement }}"
                    </blockquote>
                </div>
            </div>
            <div class="flex justify-center mt-12">
                <a :href="`mailto:${contact.lessons}?subject=Lesson Booking Request&body=Hello,%0A%0AI would like to schedule a lesson consultation.%0A%0ASubject of interest: ${selectedSubject}%0A%0APlease let me know your availability.%0A%0AThank you!`"
                    class="cta-btn-primary gap-2 flex justify-center items-center hover:gap-3 transition-all duration-300">
                    <span>Book a Lesson</span>
                    <Icon name="ph:arrow-right" class="w-4 h-4" />
                </a>
            </div>
        </section>
    </div>
</template>

<style scoped>
@import "../assets/css/main.css";

.btn-lg {
    @apply px-8 py-4 text-base;
}
</style>