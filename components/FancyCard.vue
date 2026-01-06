<script setup lang="ts">
interface Props {
  title: string;
  type?: string;
  description?: string;
  year?: string;
  duration?: string;
  icon?: string;
  colorVar?: string;
  to?: string;
  subtle?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: '',
  description: '',
  year: '',
  duration: '',
  icon: 'ph:music-notes',
  colorVar: '--color-primary',
  to: '',
  subtle: false,
});
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="block"
  >
    <div
      class="work-card group"
      :class="{ 'subtle': subtle }"
      :style="{ '--col': `var(${colorVar})` }"
    >
      <div class="work-card-content">
        <div class="work-card-header">
          <div class="flex-1">
            <h3 class="work-card-title" :class="{ 'no-underline': subtle }">
              {{ title }}
            </h3>
            <span class="work-card-type" v-if="type">
              {{ type }}
            </span>
          </div>
          <span class="text-2xl work-card-icon">
            <Icon :name="icon" />
          </span>
        </div>

        <p class="work-card-description" v-if="description">
          {{ description }}
        </p>

        <div class="work-card-meta" v-if="year || duration">
          <div class="flex items-center gap-1" v-if="year">
            <Icon name="ph:calendar" />
            <span>{{ year }}</span>
          </div>
          <div class="flex items-center gap-1" v-if="duration">
            <Icon name="ph:clock" />
            <span>{{ duration }}</span>
          </div>
        </div>
      </div>

      <div class="work-card-progress" v-if="!subtle">
        <div class="work-card-progress-bar">
          <div class="work-card-progress-fill"></div>
        </div>
      </div>
    </div>
  </NuxtLink>
  
  <!-- Non-link version -->
  <div
    v-else
    class="work-card group"
    :class="{ 'subtle': subtle }"
    :style="{ '--col': `var(${colorVar})` }"
  >
    <div class="work-card-content">
              <div class="work-card-header">
          <div class="flex-1">
            <h3 class="work-card-title" :class="{ 'no-underline': subtle }">
              {{ title }}
            </h3>
            <span class="work-card-type" v-if="type">
              {{ type }}
            </span>
          </div>
          <span class="text-2xl work-card-icon">
            <Icon :name="icon" />
          </span>
        </div>

      <p class="work-card-description" v-if="description">
        {{ description }}
      </p>

      <div class="work-card-meta" v-if="year || duration">
        <div class="flex items-center gap-1" v-if="year">
          <Icon name="ph:calendar" />
          <span>{{ year }}</span>
        </div>
        <div class="flex items-center gap-1" v-if="duration">
          <Icon name="ph:clock" />
          <span>{{ duration }}</span>
        </div>
      </div>
    </div>

    <div class="work-card-progress" v-if="!subtle">
      <div class="work-card-progress-bar">
        <div class="work-card-progress-fill"></div>
      </div>
    </div>
  </div>
</template> 