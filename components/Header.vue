<script setup lang="ts">
interface HeaderItem {
    text: string;
    link: string | null;
    children: HeaderItem[];
}

interface StackItem {
    indentSpaces: number;
    node: HeaderItem;
}

const constants = await useConstants();
const { data: text } = await useAsyncData("header-text", async () => {
    return (await getFile("general", "header", "text")) as string;
});

function parseHeader(markdownString: string): HeaderItem[] {
    const lines = markdownString
        .trim()
        .split("\n")
        .filter((line: string) => line.trim() !== "");
    const resultTree: HeaderItem[] = [];
    const stack: StackItem[] = [];

    for (const originalLine of lines) {
        const lineContentStripped = originalLine.trimStart();

        if (!lineContentStripped.startsWith("- ")) {
            continue;
        }

        const leadingSpaces = originalLine.length - lineContentStripped.length;
        const itemFullContent = lineContentStripped.substring(2).trim();
        const parts = itemFullContent.split(":", 1);
        let text: string;
        let link: string | null;

        if (itemFullContent.includes(":")) {
            const firstColonIndex = itemFullContent.indexOf(":");
            text = itemFullContent.substring(0, firstColonIndex).trim();
            link = itemFullContent.substring(firstColonIndex + 1).trim();
        } else {
            text = itemFullContent;
            link = null;
        }

        const currentNode: HeaderItem = {
            text: text,
            link: link,
            children: [],
        };

        while (
            stack.length > 0 &&
            leadingSpaces <= stack[stack.length - 1].indentSpaces
        ) {
            stack.pop();
        }

        if (stack.length === 0) {
            resultTree.push(currentNode);
        } else {
            const parentNodeData = stack[stack.length - 1];
            parentNodeData.node.children.push(currentNode);
        }

        stack.push({ indentSpaces: leadingSpaces, node: currentNode });
    }

    return resultTree;
}

const header = computed(() => (text.value ? parseHeader(text.value) : []));

const handleScroll = () => {
    const scrolled = window.scrollY > 20;
    const headerElement = document.querySelector(".header-container");

    if (scrolled) {
        document.documentElement.classList.add("scrolled");
        headerElement?.classList.add("scrolled");
    } else {
        document.documentElement.classList.remove("scrolled");
        headerElement?.classList.remove("scrolled");
    }
};

onMounted(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});

const handleLinkClick = (link: string | null, event: Event) => {
    if (link) {
        event.preventDefault();
        window.location.href = link;
    }
};

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
};

defineProps({
    fixed: {
        type: Boolean,
        default: true,
    },
    noBackground: {
        type: Boolean,
        default: false,
    },
});
</script>
<template>
    <div
        :class="
            `header-container` +
            (fixed ? ' fixed' : '') +
            (noBackground ? ' no-background' : '')
        "
    >
        <div :class="`navbar` + (noBackground ? ' no-background' : '')">
            <div class="flex-1">
                <a href="/" class="header-brand">{{
                    constants?.contact.name
                }}</a>
            </div>

            <!-- Mobile Hamburger Button -->
            <div class="md:hidden">
                <button
                    @click="toggleMobileMenu"
                    class="hamburger-button"
                    :class="{ active: isMobileMenuOpen }"
                    aria-label="Toggle mobile menu"
                >
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                </button>
            </div>

            <!-- Desktop Navigation -->
            <div class="header-nav-container hidden md:block">
                <ul class="header-menu">
                    <template v-for="(item, idx) in header" :key="idx">
                        <li
                            v-if="!item.children || item.children.length === 0"
                            class="header-menu-item"
                        >
                            <a
                                v-if="item.link"
                                :href="item.link"
                                class="header-nav-link"
                                @click="handleLinkClick(item.link, $event)"
                                >{{ item.text }}</a
                            >
                            <span v-else class="header-nav-link">{{
                                item.text
                            }}</span>
                        </li>
                        <li v-else class="header-menu-item">
                            <details class="dropdown">
                                <summary
                                    :class="`header-nav-link cursor-pointer ${item.link ? 'has-link' : ''}`"
                                    @click="
                                        item.link && $event.preventDefault()
                                    "
                                >
                                    {{ item.text }}
                                </summary>
                                <ul
                                    class="header-dropdown dropdown-content menu p-3 shadow bg-base-100 rounded-box w-52 mt-2"
                                >
                                    <template
                                        v-for="(child, cidx) in item.children"
                                        :key="cidx"
                                    >
                                        <li
                                            v-if="
                                                !child.children ||
                                                child.children.length === 0
                                            "
                                        >
                                            <a
                                                v-if="child.link"
                                                :href="child.link"
                                                class="header-dropdown-item"
                                                @click="
                                                    handleLinkClick(
                                                        child.link,
                                                        $event,
                                                    )
                                                "
                                                >{{ child.text }}</a
                                            >
                                            <span
                                                v-else
                                                class="header-dropdown-item"
                                                >{{ child.text }}</span
                                            >
                                        </li>
                                        <li v-else>
                                            <details class="dropdown">
                                                <summary
                                                    class="header-dropdown-item cursor-pointer"
                                                >
                                                    <span v-if="child.link">
                                                        <a
                                                            :href="child.link"
                                                            @click="
                                                                handleLinkClick(
                                                                    child.link,
                                                                    $event,
                                                                )
                                                            "
                                                            >{{ child.text }}</a
                                                        >
                                                    </span>
                                                    <span v-else>{{
                                                        child.text
                                                    }}</span>
                                                    <Icon
                                                        name="ph:caret-down"
                                                        class="w-3 h-3 ml-1"
                                                    />
                                                </summary>
                                                <ul
                                                    class="header-dropdown dropdown-content menu p-2 shadow bg-base-100 rounded-box w-48 mt-1"
                                                >
                                                    <li
                                                        v-for="(
                                                            grandchild, gcidx
                                                        ) in child.children"
                                                        :key="gcidx"
                                                    >
                                                        <a
                                                            v-if="
                                                                grandchild.link
                                                            "
                                                            :href="
                                                                grandchild.link
                                                            "
                                                            class="header-dropdown-item text-xs"
                                                            @click="
                                                                handleLinkClick(
                                                                    grandchild.link,
                                                                    $event,
                                                                )
                                                            "
                                                            >{{
                                                                grandchild.text
                                                            }}</a
                                                        >
                                                        <span
                                                            v-else
                                                            class="header-dropdown-item text-xs"
                                                            >{{
                                                                grandchild.text
                                                            }}</span
                                                        >
                                                    </li>
                                                </ul>
                                            </details>
                                        </li>
                                    </template>
                                </ul>
                            </details>
                        </li>
                    </template>
                </ul>
            </div>

            <!-- Mobile Navigation Menu -->
            <div
                class="mobile-menu md:hidden"
                :class="{ active: isMobileMenuOpen }"
            >
                <div class="mobile-menu-content">
                    <ul class="mobile-menu-list">
                        <template v-for="(item, idx) in header" :key="idx">
                            <li class="mobile-menu-item">
                                <a
                                    v-if="item.link"
                                    :href="item.link"
                                    class="mobile-menu-link"
                                    @click="
                                        handleLinkClick(item.link, $event);
                                        closeMobileMenu();
                                    "
                                    >{{ item.text }}</a
                                >
                                <span v-else class="mobile-menu-link">{{
                                    item.text
                                }}</span>

                                <!-- Mobile submenu -->
                                <ul
                                    v-if="
                                        item.children &&
                                        item.children.length > 0
                                    "
                                    class="mobile-submenu"
                                >
                                    <li
                                        v-for="(child, cidx) in item.children"
                                        :key="cidx"
                                        class="mobile-submenu-item"
                                    >
                                        <a
                                            v-if="child.link"
                                            :href="child.link"
                                            class="mobile-submenu-link"
                                            @click="
                                                handleLinkClick(
                                                    child.link,
                                                    $event,
                                                );
                                                closeMobileMenu();
                                            "
                                            >{{ child.text }}</a
                                        >
                                        <span
                                            v-else
                                            class="mobile-submenu-link"
                                            >{{ child.text }}</span
                                        >
                                    </li>
                                </ul>
                            </li>
                        </template>
                    </ul>
                </div>
            </div>
        </div>
        <svg
            preserveAspectRatio="none"
            class="header-waves"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
        >
            <defs>
                <linearGradient
                    id="waveGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                >
                    <stop
                        offset="0%"
                        style="stop-color: var(--color-primary-header)"
                    />
                    <stop
                        offset="50%"
                        style="stop-color: var(--color-primary-header)"
                    />
                    <stop
                        offset="100%"
                        style="stop-color: var(--color-primary-header)"
                    />
                </linearGradient>
            </defs>
            <path
                fill="url(#waveGradient)"
                d="M0,64L34.3,96C68.6,128,137,192,206,213.3C274.3,235,343,213,411,224C480,235,549,277,617,277.3C685.7,277,754,235,823,224C891.4,213,960,235,1029,213.3C1097.1,192,1166,128,1234,96C1302.9,64,1371,64,1406,64L1440,64L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"
            ></path>
        </svg>
    </div>
</template>
<style scoped>
@import "../assets/css/main.css";

.header-brand {
    @apply font-medium tracking-wide px-3 py-2 rounded-md transition-colors duration-200 hover:bg-base-content/10;
}

.dropdown:hover .dropdown-content,
.dropdown-open .dropdown-content {
    @apply visible opacity-100 scale-100;
}

.dropdown .dropdown-content {
    @apply invisible opacity-0 scale-95 transition-all duration-200 ease-out;
}

@media (max-width: 768px) {
    .header-brand {
        @apply text-xs tracking-wide;
    }

    .header-nav-link {
        @apply text-xs;
    }

    .navbar {
        @apply px-2 py-1;
    }
}

:deep(.header-nav-link.has-link) {
    cursor: pointer;
}

:deep(.header-nav-link.has-link:hover) {
    color: var(--color-primary);
}

/* AIDEV-NOTE: Animated hamburger menu styles */
.hamburger-button {
    @apply relative w-8 h-8 flex flex-col justify-center items-center bg-transparent border-none cursor-pointer;
}

.hamburger-line {
    @apply w-6 h-0.5 bg-base-content transition-all duration-300 ease-in-out;
    transform-origin: center;
}

.hamburger-line:not(:last-child) {
    @apply mb-1;
}

.hamburger-button.active .hamburger-line:nth-child(1) {
    transform: translateY(6px) rotate(45deg);
}

.hamburger-button.active .hamburger-line:nth-child(2) {
    opacity: 0;
}

.hamburger-button.active .hamburger-line:nth-child(3) {
    transform: translateY(-6px) rotate(-45deg);
}

/* Mobile menu styles */
.mobile-menu {
    @apply absolute top-full left-0 right-0 bg-base-100 border-t border-base-300/20 shadow-lg;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease-in-out;
    z-index: 50;
}

.mobile-menu.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
}

.mobile-menu-content {
    @apply p-4;
}

.mobile-menu-list {
    @apply space-y-2;
}

.mobile-menu-item {
    @apply border-b border-base-300/10 pb-2;
}

.mobile-menu-link {
    @apply block py-2 px-3 text-base-content hover:text-primary transition-colors duration-200 font-medium;
}

.mobile-submenu {
    @apply mt-2 ml-4 space-y-1;
}

.mobile-submenu-item {
    @apply border-l-2 border-base-300/20 pl-3;
}

.mobile-submenu-link {
    @apply block py-1 text-sm text-base-content/70 hover:text-primary transition-colors duration-200;
}
</style>
