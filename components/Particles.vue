<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Props {
    count?: number;
    colors?: string[];
    size?: number;
    speed?: number;
    mouseForce?: number;
}

const props = withDefaults(defineProps<Props>(), {
    count: 20,
    colors: () => [
        "var(--color-primary)",
        "var(--color-secondary)",
        "var(--color-accent)",
    ],
    size: 4,
    speed: 0.5,
    mouseForce: 0,
});

class Particle {
    id: number;
    x: number;
    y: number;
    angle: number;
    radius: number;
    speed: number;
    color: string;
    opacity: number;
    size: number;
    mouseAttraction: number;
    opacityDirection: number;
    sizeDirection: number;
    angleSpeed: number;

    constructor(
        id: number,
        colors: string[],
        maxSize: number,
        baseSpeed: number,
    ) {
        this.id = id;
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.angle = Math.random() * Math.PI * 2;
        this.radius = Math.random() * 3 + 1;
        this.speed = baseSpeed * (Math.random() * 2 + 0.5); // 0.5x to 2.5x base speed
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.6 + 0.2; // 0.2 to 0.8
        this.size = Math.random() * maxSize + 1;
        this.mouseAttraction = Math.random() * 0.3 + 0.1; // Individual mouse attraction strength
        this.opacityDirection = Math.random() > 0.5 ? 1 : -1;
        this.sizeDirection = Math.random() > 0.5 ? 1 : -1;
        this.angleSpeed = Math.random() * 0.01 + 0.005;
    }

    update(mouseX: number, mouseY: number, mouseForce: number) {
        // Polar coordinate movement
        this.x += Math.cos(this.angle) * this.radius * this.speed;
        this.y += Math.sin(this.angle) * this.radius * this.speed;
        this.angle += this.angleSpeed;

        // Loop around edges instead of bouncing
        if (this.x < -50) this.x = window.innerWidth + 50;
        if (this.x > window.innerWidth + 50) this.x = -50;
        if (this.y < -50) this.y = window.innerHeight + 50;
        if (this.y > window.innerHeight + 50) this.y = -50;

        // Mouse attraction with individual strength
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            const attractionForce = this.mouseAttraction * mouseForce;
            this.x += (dx / distance) * attractionForce;
            this.y += (dy / distance) * attractionForce;
        }

        // Animate opacity and size for more dynamic feel
        this.opacity += this.opacityDirection * 0.005;
        if (this.opacity <= 0.1 || this.opacity >= 0.8) {
            this.opacityDirection *= -1;
        }

        this.size += this.sizeDirection * 0.02;
        if (this.size <= 1 || this.size >= props.size + 2) {
            this.sizeDirection *= -1;
        }
    }
}

const particles = ref<Particle[]>([]);
const mouseX = ref(0);
const mouseY = ref(0);
const containerRef = ref<HTMLElement>();

const initParticles = () => {
    particles.value = Array.from(
        { length: props.count },
        (_, i) => new Particle(i, props.colors, props.size, props.speed),
    );
};

const updateParticles = () => {
    particles.value.forEach((particle) => {
        particle.update(mouseX.value, mouseY.value, props.mouseForce);
    });
};

const handleMouseMove = (event: MouseEvent) => {
    if (containerRef.value) {
        const rect = containerRef.value.getBoundingClientRect();
        mouseX.value = event.clientX - rect.left;
        mouseY.value = event.clientY - rect.top;
    }
};

let animationFrame: number;

const animate = () => {
    updateParticles();
    animationFrame = requestAnimationFrame(animate);
};

onMounted(() => {
    initParticles();
    animate();

    if (containerRef.value) {
        containerRef.value.addEventListener("mousemove", handleMouseMove);
    }
});

onUnmounted(() => {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }

    if (containerRef.value) {
        containerRef.value.removeEventListener("mousemove", handleMouseMove);
    }
});
</script>

<template>
    <div
        ref="containerRef"
        class="absolute inset-0 overflow-hidden pointer-events-none"
    >
        <svg class="w-full h-full">
            <circle
                v-for="particle in particles"
                :key="particle.id"
                :cx="particle.x"
                :cy="particle.y"
                :r="particle.size"
                :fill="particle.color"
                :opacity="particle.opacity"
                class="transition-all duration-100 ease-out"
            />
        </svg>
    </div>
</template>
