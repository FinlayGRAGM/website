<template>
    <div class="parallax-container" ref="container">
        <div class="parallax-inner" ref="inner">
            <slot />
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
    name: "ParallaxWrapper",
    props: {
        /**
         * Depth factor:
         * 0 = fixed in place
         * 1 = normal scroll speed
         * >1 = scrolls faster (stronger parallax)
         */
        depth: {
            type: Number,
            default: 1,
            validator: (n) => n >= 0,
        },
    },
    setup(props) {
        const container = ref(null);
        const inner = ref(null);
        let stInstance = null;

        onMounted(() => {
            if (!container.value || !inner.value) return;

            stInstance = ScrollTrigger.create({
                trigger: container.value,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                onUpdate: (self) => {
                    const scrollY = window.scrollY || window.pageYOffset;
                    const rect = container.value.getBoundingClientRect();
                    const elemCenterY = scrollY + rect.top + rect.height / 2;
                    const viewportCenterY = scrollY + window.innerHeight / 2;

                    // Compute offset: difference between element center and viewport center
                    // times (depth - 1). If depth=1 → offset=0 at any time.
                    const delta =
                        (elemCenterY - viewportCenterY) * (props.depth - 1);

                    gsap.set(inner.value, {
                        y: -delta,
                    });
                },
            });
        });

        onBeforeUnmount(() => {
            if (stInstance) {
                stInstance.kill();
                stInstance = null;
            }
        });

        return { container, inner };
    },
});
</script>

<style scoped>
.parallax-container {
    position: relative;
    overflow: hidden;
}

.parallax-inner {
    will-change: transform;
}
</style>
