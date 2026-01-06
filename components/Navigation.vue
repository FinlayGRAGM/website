<template>
    <div class="flex w-full gap-6 md:gap-12 relative">
        <!-- Navigation Sidebar -->
        <aside
            v-if="visibleItems.length > 0"
            class="navigation-sidebar hidden md:block"
            :class="sidebarClasses"
        >
            <div class="navigation-container">
                <nav class="navigation-nav">
                    <!-- Internal Navigation -->
                    <button
                        v-for="item in visibleItems.filter((i) => !i.external)"
                        :key="item.selector"
                        @click="scrollToSection(item)"
                        class="navigation-btn"
                        :class="getButtonClasses(item)"
                        :title="item.title"
                    >
                        <!-- Title (hidden on mobile) -->
                        <span class="navigation-title">
                            {{ item.title }}
                        </span>
                    </button>

                    <!-- External Link -->
                    <a
                        v-for="item in visibleItems.filter((i) => i.external)"
                        :key="item.title"
                        :href="item.link"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="navigation-btn"
                        :class="getExternalButtonClasses()"
                        :title="item.title"
                    >
                        <!-- Title (hidden on mobile) -->
                        <span class="navigation-title">
                            {{ item.title }}
                        </span>
                        <!-- External Icon -->
                        <span class="ml-2 hidden md:inline">
                            <Icon name="ph:arrow-square-out" size="16" />
                        </span>
                    </a>
                </nav>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="navigation-content">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
interface NavigationItem {
    selector?: string;
    container?: string;
    title: string;
    icon?: string;
    external?: boolean;
    link?: string;
}

interface Props {
    items: NavigationItem[];
}

const props = defineProps<Props>();

const activeSection = ref<string>("");
const visibleItems = ref<NavigationItem[]>([]);

const sidebarClasses = computed(() => [
    "left-8 mt-12 w-[300px] sticky top-32 mb-12 h-fit",
    "transition-all duration-300 ease-out",
]);

const getButtonClasses = (item: NavigationItem) => [
    "flex items-center w-full text-left transition-all duration-300",
    "px-4 py-3 rounded-md text-sm",
    "justify-start",
    activeSection.value === item.selector
        ? "bg-primary/20 text-primary shadow-md transform scale-105 border border-primary/30"
        : "text-base-content/60 hover:text-base-content hover:bg-base-200/50 hover:scale-105",
];

const getExternalButtonClasses = () => [
    "flex items-center w-full text-left transition-all duration-300",
    "px-4 py-3 rounded-md text-sm",
    "justify-start",
    "text-base-content/60 hover:text-base-content hover:bg-base-200/50 hover:scale-105",
];

const updateVisibleItems = () => {
    const newVisibleItems: NavigationItem[] = [];

    props.items.forEach((item) => {
        if (item.external) {
            newVisibleItems.push(item);
            return;
        }

        if (item.selector && item.container) {
            const selector = `${item.container} ${item.selector}`;
            const element = document.querySelector(selector);
            if (element) {
                newVisibleItems.push(item);
            }
        }
    });

    visibleItems.value = newVisibleItems;
};

const getElementVisibility = (element: Element): number => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    if (rect.bottom < 0 || rect.top > windowHeight) {
        return 0;
    }
    const visibleTop = Math.max(0, rect.top);
    const visibleBottom = Math.min(windowHeight, rect.bottom);
    const visibleHeight = visibleBottom - visibleTop;
    const elementHeight = rect.height;

    return elementHeight > 0 ? (visibleHeight / elementHeight) * 100 : 0;
};

const updateActiveSection = () => {
    const candidates: {
        item: NavigationItem;
        element: Element;
        visibility: number;
        distanceFromCenter: number;
    }[] = [];

    visibleItems.value.forEach((item) => {
        if (item.external || !item.selector || !item.container) {
            return;
        }

        const selector = `${item.container} ${item.selector}`;
        const element = document.querySelector(selector);

        if (element) {
            const visibility = getElementVisibility(element);
            if (visibility > 30) {
                const rect = element.getBoundingClientRect();
                const distanceFromCenter = Math.abs(
                    (rect.top + rect.bottom) / 2 - window.innerHeight / 2,
                );

                candidates.push({
                    item,
                    element,
                    visibility,
                    distanceFromCenter,
                });
            }
        }
    });

    if (candidates.length > 0) {
        candidates.sort((a, b) => a.distanceFromCenter - b.distanceFromCenter);
        activeSection.value = candidates[0].item.selector!;
    }
};

const scrollToSection = (item: NavigationItem) => {
    if (item.external || !item.selector || !item.container) {
        return;
    }

    const selector = `${item.container} ${item.selector}`;
    const element = document.querySelector(selector);

    if (element) {
        const headerHeight = window.innerHeight / 2;
        const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
        });
    }
};

let scrollTimeout: NodeJS.Timeout | null = null;
const handleScroll = () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
        updateActiveSection();
    }, 50);
};

onMounted(() => {
    updateVisibleItems();
    updateActiveSection();

    window.addEventListener("scroll", handleScroll, { passive: true });

    const observer = new MutationObserver(() => {
        updateVisibleItems();
        updateActiveSection();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    onUnmounted(() => {
        window.removeEventListener("scroll", handleScroll);
        observer.disconnect();
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
    });
});

watch(
    () => props.items,
    () => {
        updateVisibleItems();
        updateActiveSection();
    },
    { deep: true },
);
</script>

<style scoped>
@import "../assets/css/main.css";

.navigation-sidebar {
    @apply transition-all duration-300 ease-out;
}

.navigation-container {
    @apply glass-card p-4 md:p-6 shadow-lg;
}

.navigation-nav {
    @apply space-y-2 md:space-y-3;
}

.navigation-btn {
    @apply focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2;
    @apply active:scale-95;
}

.navigation-title {
    @apply hidden md:block md:ml-3 font-mono font-medium;
    @apply truncate;
}

.navigation-content {
    @apply flex-1;
}

/* Mobile optimizations */
@media (max-width: 768px) {
    .navigation-sidebar {
        @apply w-12;
    }

    .navigation-container {
        @apply p-2;
    }

    .navigation-btn {
        @apply px-2 py-2;
    }

    .navigation-nav {
        @apply space-y-1;
    }
}

/* Smooth scroll behavior */
html {
    scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
    html {
        scroll-behavior: auto;
    }

    .navigation-btn,
    .navigation-sidebar {
        @apply transition-none;
    }
}
</style>
