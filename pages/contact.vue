<script setup>
definePageMeta({
    layout: "default",
});

const constants = await useConstants();

// Contact page meta data
useSiteMeta({
    title: constants.value?.contact?.page?.title || "Contact",
    description:
        constants.value?.contact?.page?.subtitle ||
        `Get in touch with ${constants.value?.contact?.name} for commissions, collaborations, and inquiries.`,
    keywords: [
        "contact",
        "get in touch",
        "commissions",
        "collaborations",
        "music commissions",
        "composition commissions",
        "private lessons",
        "music lessons",
        "contact form",
        "inquiries",
    ],
});
</script>

<template>
    <div class="font-sans pt-24 md:bg-base-100 bg-three-grad">
        <div class="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
            <!-- Small screens: Only contact form -->
            <div class="lg:hidden">
                <ContactForm />
            </div>
            
            <!-- Large screens: Contact masonry with fade effect -->
            <div class="hidden lg:block">
                <ContactMasonry />
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes float {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}
</style>
