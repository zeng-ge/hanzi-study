<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="relative min-h-screen font-sans antialiased text-gray-100 bg-tech-bg selection:bg-tech-primary selection:text-tech-bg">
    <!-- Background Effects -->
    <div class="fixed inset-0 z-0 pointer-events-none bg-grid-pattern opacity-10 bg-[length:40px_40px]"></div>
    <div class="fixed top-0 left-0 w-full h-full z-0 pointer-events-none bg-gradient-to-b from-transparent to-tech-bg/90"></div>
    
    <!-- Main Content -->
    <main class="relative z-10 flex flex-col min-h-screen">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
