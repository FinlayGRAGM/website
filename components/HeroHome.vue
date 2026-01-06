<script setup lang="ts">
import { onMounted, ref } from "vue";

const constants = await useConstants();

const { data: headerText } = await useAsyncData("header-text", async () => {
    return await getFile("general", "header", "text");
});

function parseHeader(markdownString: string) {
    const lines = markdownString
        .trim()
        .split("\n")
        .filter((line) => line.trim() !== "");
    const resultTree = [];

    for (const originalLine of lines) {
        const lineContentStripped = originalLine.trimStart();

        if (!lineContentStripped.startsWith("- ")) {
            continue;
        }

        const itemFullContent = lineContentStripped.substring(2).trim();
        let text;
        let link;

        if (itemFullContent.includes(":")) {
            const firstColonIndex = itemFullContent.indexOf(":");
            text = itemFullContent.substring(0, firstColonIndex).trim();
            link = itemFullContent.substring(firstColonIndex + 1).trim();
        } else {
            text = itemFullContent;
            link = null;
        }

        if (originalLine.length - lineContentStripped.length === 0) {
            resultTree.push({ text, link });
        }
    }

    return resultTree;
}

const navigationItems = computed(() =>
    headerText.value ? parseHeader(headerText.value) : [],
);

const scrollToNextSection = () => {
    const nextSection = document.getElementById("another");
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
    }
};
</script>

<template>
    <Section id="home" className="hero-glassmorphism-container bg-three-grad">
        <!-- Hero Image -->
        <div class="hero-glassmorphism-image-container">
            <Image
                :noLink="true"
                imgid="hero-large"
                alt="Portfolio Hero Image"
                class="hero-glassmorphism-image"
                :cover="true"
            />
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 z-15 bg-three-grad opacity-80"></div>
            <!-- Fade Overlay -->
            <div class="hero-glassmorphism-fade-overlay"></div>
        </div>

        <!-- Glassmorphism Card with Tilt Effect -->
        <article ref="tiltCardRef" class="hero-glassmorphism-card">
            <ClientOnly>
                <Glass>
                    <!-- Profile Section -->
                    <div class="text-left mb-8">
                        <h1 class="hero-name-large up">
                            {{ constants?.contact.name }}
                        </h1>
                        <span
                            class="shortdescription font-light font-mono italic text-base-content/80"
                        >
                            {{ constants?.contact.shortDescription }}
                        </span>
                        <p class="hero-description-left mt-3">
                            {{ constants?.homepage.description }}
                        </p>
                    </div>

                    <!-- Social Icons -->
                    <div class="hero-social-row">
                        <a
                            v-for="(item, idx) in constants?.socials || []"
                            :key="idx"
                            :href="item.link"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="hero-social-icon-button up"
                            :title="item.name"
                        >
                            <Icon :name="item.icon" class="text-lg" />
                        </a>
                    </div>

                    <!-- Navigation Section -->
                    <div class="hero-nav-section">
                        <nav class="space-y-1">
                            <a
                                v-for="(item, idx) in navigationItems"
                                :key="idx"
                                :href="item.link || '#'"
                                class="hero-nav-link-animated"
                                @click="!item.link && $event.preventDefault()"
                            >
                                {{ item.text }}
                            </a>
                        </nav>
                    </div>

                    <div class="js-tilt-glare"></div>
                </Glass>
            </ClientOnly>
        </article>

        <!-- Scroll Down Button -->
        <button
            @click="scrollToNextSection"
            class="downChevron absolute left-[50%] bottom-6 -translate-x-[50%] w-12 h-12 cursor-pointer group z-30 grid place-items-center rounded-full transition-all duration-300 hover:bg-white/20 p-2 animate-bounce-gentle hover:animate-none"
            aria-label="Scroll to next section"
        >
            <Icon
                name="ph:caret-down"
                class="w-8 h-8 fill-accent opacity-70 group-hover:opacity-100 transition-all duration-300"
            />
        </button>
    </Section>
</template>

<style scoped>
.animate-bounce-gentle {
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

.group:hover .animate-bounce-gentle {
    animation: none;
    transform: scale(1.1);
}

/* AIDEV-NOTE: Enhanced glassmorphism styles for better visual effect */
.hero-glassmorphism-card {
    transform-style: preserve-3d;
    transform: perspective(1000px);
    overflow: hidden;
    backdrop-filter: blur(20px) saturate(200%) brightness(105%);
    -webkit-backdrop-filter: blur(20px) saturate(200%) brightness(105%);
    background-color: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) or (max-height: 768px) {
    .hero-glassmorphism-card {
        left: 1.5rem;
        right: 1.5rem;
        width: auto;
        max-width: clamp(20rem, calc(100vw - 3rem), 40rem);
        margin: 0 auto;
        padding: 2rem;
    }

    .hero-glassmorphism-fade-overlay {
        width: 70%;
    }
}

.up {
    transform: translateZ(100px);
}
</style>
