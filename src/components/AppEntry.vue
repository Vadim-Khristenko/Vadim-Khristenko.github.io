<template>
  <MainPage />
</template>

<script setup lang="ts">
import { createPinia, setActivePinia } from 'pinia';
import MainPage from './MainPage.vue';

// Initialize Pinia before any component uses usePreferencesStore()
// This is required for client:only islands where app.use() is not called
setActivePinia(createPinia());
</script>
