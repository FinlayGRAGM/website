<template>
    <footer class="footer bg-neutral w-full text-neutral-content">
        <!-- Main Footer Content -->
        <div class="bg-neutral text-neutral-content p-10 w-full">
            <div class="flex flex-col md:flex-row gap-8 w-full">
                <!-- Navigation Sections Container (flex-2) -->
                <div class="flex-2 flex flex-col md:flex-row gap-8">
                    <!-- About Section -->
                    <nav class="flex flex-col space-y-3 flex-1">
                        <h6 class="footer-title text-neutral-content/90 mb-2">
                            About
                        </h6>
                        <div class="space-y-2">
                            <h3 class="font-bold text-lg text-neutral-content">
                                {{ constants?.contact?.name }}
                            </h3>
                            <p
                                class="text-sm text-neutral-content/80 max-w-xs leading-relaxed"
                            >
                                {{ constants?.contact?.shortDescription }}
                            </p>
                            <p
                                v-if="constants?.contact?.college"
                                class="text-sm text-neutral-content/70"
                            >
                                {{ constants.contact.college }}
                            </p>
                        </div>
                    </nav>

                    <!-- Quick Links -->
                    <nav class="flex flex-col space-y-3 flex-1">
                        <h6 class="footer-title text-neutral-content/90 mb-2">
                            Navigate
                        </h6>
                        <NuxtLink to="/about" class="footer-nav-link">
                            About Me
                        </NuxtLink>
                        <NuxtLink to="/work" class="footer-nav-link">
                            My Work
                        </NuxtLink>
                        <NuxtLink to="/work/pieces" class="footer-nav-link">
                            Compositions
                        </NuxtLink>
                        <NuxtLink to="/work/writing" class="footer-nav-link">
                            Writing
                        </NuxtLink>
                        <NuxtLink to="/teaching" class="footer-nav-link">
                            Teaching
                        </NuxtLink>
                    </nav>

                    <!-- Contact & Location -->
                    <nav class="flex flex-col space-y-3 flex-1">
                        <h6 class="footer-title text-neutral-content/90 mb-2">
                            Contact
                        </h6>
                        <div class="space-y-2">
                            <a
                                v-if="constants?.contact?.email"
                                :href="`mailto:${constants.contact.email}`"
                                class="link link-hover text-neutral-content/80 hover:text-neutral-content transition-colors duration-200 flex items-center gap-2"
                                :aria-label="`Send email to ${constants.contact.email}`"
                            >
                                <Icon name="ph:envelope" size="16" />
                                {{ constants.contact.email }}
                            </a>

                            <div
                                v-if="constants?.contact?.locations"
                                class="space-y-2 pt-2"
                            >
                                <h6
                                    class="text-xs font-semibold text-neutral-content/70 uppercase tracking-wide"
                                >
                                    Locations
                                </h6>
                                <div
                                    v-for="(location, index) in constants
                                        .contact.locations"
                                    :key="index"
                                    class="text-sm text-neutral-content/80"
                                >
                                    <div class="font-medium">
                                        {{ location.place }}
                                    </div>
                                    <div
                                        class="text-xs text-neutral-content/60"
                                    >
                                        {{ location.period }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>

                <!-- Profile Image (flex-1) -->
                <div class="flex-1 flex justify-center items-start">
                    <div
                        class="w-64 h-64 rounded-lg overflow-hidden border-2 border-neutral-content/20"
                    >
                        <Image
                            imgid="headshot-small"
                            alt="Profile photo"
                            class="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-neutral-content/20"></div>

        <!-- Bottom Footer -->
        <div class="footer footer-center bg-neutral text-neutral-content p-6">
            <!-- Social Links -->
            <nav class="mb-4">
                <div class="grid grid-flow-col gap-6">
                    <template
                        v-for="(social, index) in constants?.socials"
                        :key="index"
                    >
                        <a
                            v-if="social?.link"
                            :href="social.link"
                            class="cursor-pointer link link-hover transition-all duration-300 hover:scale-110 hover:text-accent"
                            :title="social.name"
                            :aria-label="social.name"
                            :target="
                                social.link.startsWith('mailto:') ||
                                social.link.startsWith('tel:')
                                    ? '_self'
                                    : '_blank'
                            "
                            :rel="
                                social.link.startsWith('mailto:') ||
                                social.link.startsWith('tel:')
                                    ? ''
                                    : 'noopener noreferrer'
                            "
                        >
                            <Icon :name="social.icon" size="24" />
                        </a>
                    </template>
                </div>
            </nav>

            <!-- Copyright & Legal -->
            <aside class="text-center space-y-2">
                <p class="text-sm text-neutral-content/80">
                    © {{ new Date().getFullYear() }}
                    <span class="font-medium">{{
                        constants?.contact?.name || "Finlay Graham"
                    }}</span>
                    • All rights reserved
                </p>
            </aside>
        </div>
    </footer>
</template>

<script setup>
const constants = await useConstants();

const handleNewsletterSubmit = (event) => {
    console.log("Newsletter signup:", event.target.email.value);
};
</script>

<style scoped>
@import "../assets/css/main.css";

/* Enhanced focus styles for accessibility */
.link:focus-visible {
    @apply outline-2 outline-offset-2 outline-accent rounded-md;
}

.btn:focus-visible {
    @apply outline-2 outline-offset-2 outline-accent;
}

.input:focus-visible {
    @apply outline-2 outline-offset-2 outline-accent;
}

/* Smooth animations */
.link {
    @apply transition-all duration-200 ease-in-out;
}

/* Footer navigation links with animated underlines */
.footer-nav-link {
    @apply text-neutral-content/80 hover:text-neutral-content transition-all duration-300 relative;

    &::after {
        content: "";
        @apply absolute -bottom-0.5 left-0 w-0 h-0.5 block bg-white rounded-full transition-all duration-300;
    }

    &:hover::after {
        @apply w-full;
    }
}

/* Custom hover effects */
.footer-title {
    @apply relative;
}

.footer-title::after {
    content: "";
    @apply absolute -bottom-1 left-0 w-8 h-0.5 bg-accent rounded-full;
}

/* Custom flex utilities */
.flex-2 {
    flex: 2;
}

/* Mobile responsiveness improvements */
@media (max-width: 768px) {
    .grid-flow-col {
        @apply grid-flow-row gap-4;
    }
}
</style>
