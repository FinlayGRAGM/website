<script setup>
import { ref, computed } from "vue";

const constants = await useConstants();

const props = defineProps({
  compact: {
    type: Boolean,
    default: false
  }
});

const formData = ref({
  name: "",
  email: "",
  customSubject: "",
  message: "",
});

const isValid = computed(() => {
  return (
    formData.value.name.trim() !== "" &&
    formData.value.email.trim() !== "" &&
    formData.value.customSubject.trim() !== "" &&
    formData.value.message.trim() !== ""
  );
});

const handleSubmit = () => {
  const finalSubject = formData.value.customSubject;
  const mailtoLink = `mailto:${constants?.contact?.email}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(`Name: ${formData.value.name}\nEmail: ${formData.value.email}\n\nMessage:\n${formData.value.message}`)}`;
  window.location.href = mailtoLink;
};
</script>

<template>
  <div class="glass-card rounded-lg p-6 md:p-8 shadow-lg w-full md:w-[unset]" style="zoom: 80%;">
    <h2 class="text-3xl font-serif font-light grad-text mb-2" v-if="!compact">
      {{ constants?.contact?.page?.form?.title }}
    </h2>
    <h3 class="text-xl font-serif font-light grad-text mb-2" v-else>
      Get In Touch
    </h3>

    <!-- Email subtext -->
    <p class="text-sm text-base-content/60 mb-8 font-mono">
      Email {{ constants?.contact?.email }}
    </p>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label for="name" class="block text-sm font-mono font-medium text-primary mb-2">
            Name
          </label>
          <input type="text" id="name" v-model="formData.name" required
            class="w-full px-4 py-3 rounded-lg border border-base-300/20 bg-secondary/10 text-base-content placeholder-base-content/60 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Your name" />
        </div>
        <div>
          <label for="email" class="block text-sm font-mono font-medium text-primary mb-2">
            Email
          </label>
          <input type="email" id="email" v-model="formData.email" required
            class="w-full px-4 py-3 rounded-lg border border-base-300/20 bg-secondary/10 text-base-content placeholder-base-content/60 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="your@email.com" />
        </div>
      </div>
      <div>
        <label for="subject" class="block text-sm font-mono font-medium text-primary mb-2">
          Subject
        </label>
        <input type="text" id="subject" v-model="formData.customSubject" required
          class="w-full px-4 py-3 rounded-lg border border-base-300/20 bg-secondary/10 text-base-content placeholder-base-content/60 focus:outline-none focus:ring-2 focus:ring-accent"
          :placeholder="constants?.contact?.page?.form?.subjectPlaceholder || 'Please specify your subject'" />
      </div>

      <div>
        <label for="message" class="block text-sm font-mono font-medium text-primary mb-2">
          Message
        </label>
        <textarea id="message" v-model="formData.message" required :rows="compact ? 4 : 6"
          class="w-full px-4 py-3 rounded-lg border border-base-300/20 bg-secondary/10 text-base-content placeholder-base-content/60 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          :placeholder="constants?.contact?.page?.form?.messagePlaceholder || 'Tell me about your project or inquiry...'"></textarea>
      </div>
      <button type="submit" :disabled="!isValid"
        class="w-full px-8 py-3 bg-primary text-primary-content rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100">
        <Icon name="ph:paper-plane-tilt" class="w-5 h-5" />
        Send Message
      </button>
    </form>
  </div>
</template>