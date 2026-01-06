<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const constants = await useConstants();

const ctaRef = ref(null);
const isInView = ref(false);

onMounted(() => {
    if (ctaRef.value) {
        const observer = new IntersectionObserver(
            ([entry]) => {
                isInView.value = entry.isIntersecting;
            },
            {
                threshold: 0,
                rootMargin: "50px",
            },
        );

        observer.observe(ctaRef.value);

        onUnmounted(() => {
            observer.disconnect();
        });
    }
});
</script>

<template>
    <div
        ref="ctaRef"
        class="flex items-center justify-center py-16 md:py-24 relative w-screen overflow-hidden h-full"
    >
        <!-- Intense gradient background -->
        <div
            class="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/20"
        ></div>

        <!-- Particles - only animate when in view -->
        <Particles v-if="isInView" :count="30" :mouseForce="1.5" :speed="0.2" />

        <div class="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
            <!-- Main CTA Section -->
            <div class="text-center mb-16">
                <h2
                    class="text-2xl md:text-4xl font-serif font-light grad-text mb-4 decor-underline"
                >
                    {{ constants?.homepage?.cta?.title }}
                </h2>
                <p
                    class="text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed"
                >
                    {{ constants?.homepage?.cta?.subtitle }}
                </p>
            </div>

            <!-- CTA Cards -->
            <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <!-- Teaching CTA -->
                <div
                    class="glass-card rounded-xl p-8 md:p-10 shadow-2xl hover:shadow-3xl transition-all duration-300 group hover:-translate-y-1 hover:ring-4 hover:ring-primary/20 border border-base-300/50 hover:border-primary/30"
                >
                    <div class="text-center">
                        <!-- Icon -->
                        <div
                            class="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/30 transition-colors duration-300"
                        >
                            <Icon
                                :name="constants?.homepage?.cta?.primary?.icon"
                                class="w-10 h-10 text-primary"
                            />
                        </div>

                        <!-- Content -->
                        <h3
                            class="text-2xl font-serif font-medium text-base-content mb-4 group-hover:text-primary transition-colors"
                        >
                            {{ constants?.homepage?.cta?.primary?.title }}
                        </h3>
                        <p class="text-base-content/70 mb-8 leading-relaxed">
                            {{ constants?.homepage?.cta?.primary?.description }}
                        </p>

                        <!-- CTA Button -->
                        <NuxtLink
                            :to="constants?.homepage?.cta?.primary?.link"
                            class="cta-btn-primary flex items-center justify-center gap-3 hover:gap-4 transition-all duration-300 group/btn"
                        >
                            <span>{{
                                constants?.homepage?.cta?.primary?.buttonText
                            }}</span>
                            <Icon
                                name="ph:arrow-right"
                                class="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300"
                            />
                        </NuxtLink>
                    </div>
                </div>

                <!-- Contact CTA -->
                <div
                    class="glass-card rounded-xl p-8 md:p-10 shadow-2xl hover:shadow-3xl transition-all duration-300 group hover:-translate-y-1 hover:ring-4 hover:ring-secondary/20 border border-base-300/50 hover:border-secondary/30"
                >
                    <div class="text-center">
                        <!-- Icon -->
                        <div
                            class="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/30 transition-colors duration-300"
                        >
                            <Icon
                                :name="
                                    constants?.homepage?.cta?.secondary?.icon
                                "
                                class="w-10 h-10 text-secondary"
                            />
                        </div>

                        <!-- Content -->
                        <h3
                            class="text-2xl font-serif font-medium text-base-content mb-4 group-hover:text-secondary transition-colors"
                        >
                            {{ constants?.homepage?.cta?.secondary?.title }}
                        </h3>
                        <p class="text-base-content/70 mb-8 leading-relaxed">
                            {{
                                constants?.homepage?.cta?.secondary?.description
                            }}
                        </p>

                        <!-- CTA Button -->
                        <NuxtLink
                            :to="constants?.homepage?.cta?.secondary?.link"
                            class="cta-btn-secondary flex items-center justify-center gap-3 hover:gap-4 transition-all duration-300 group/btn"
                        >
                            <span>{{
                                constants?.homepage?.cta?.secondary?.buttonText
                            }}</span>
                            <Icon
                                name="ph:arrow-right"
                                class="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300"
                            />
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.shadow-3xl {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}
</style>
