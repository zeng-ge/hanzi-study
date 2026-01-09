<script setup lang="ts">
import { useRoute } from 'vue-router';
import { hanziData } from '../data/hanzi-db';
import { onMounted } from 'vue';

const route = useRoute();
const char = route.params.char as string;
const data = hanziData[char] || { char, pinyin: '', radicals: '', script: '' };

const print = () => {
  window.print();
};

onMounted(() => {
    // Optionally auto print
});
</script>

<template>
  <div class="min-h-screen bg-white text-black p-8 print:p-0">
    <!-- Non-print Controls -->
    <div class="print:hidden mb-8 flex justify-between items-center max-w-4xl mx-auto">
      <router-link :to="{name: 'detail', params: {char}}" class="text-blue-600 hover:underline">
        ← 返回终端
      </router-link>
      <button 
        @click="print" 
        class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-lg flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
        </svg>
        打印字帖
      </button>
    </div>

    <!-- Print Content (A4 Paper Simulation) -->
    <div class="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:w-full print:max-w-none">
      <div class="p-10 border border-gray-100 print:border-none space-y-8">
        
        <!-- Header -->
        <div class="flex items-end justify-between border-b-2 border-black pb-4">
          <div>
            <h1 class="text-6xl font-serif font-bold">{{ char }}</h1>
            <p class="text-2xl mt-2 font-mono">{{ data.pinyin }}</p>
          </div>
          <div class="text-right">
             <p class="text-sm text-gray-500">部首：{{ data.radicals }}</p>
             <p class="text-sm text-gray-500 mt-1">日期：____年__月__日</p>
          </div>
        </div>

        <!-- Stroke Order (Placeholder for print view if needed, or just skip) -->
        <!-- Usually workbooks have a stroke order strip, but our component relies on JS/SVG which works fine in print if rendered -->
        
        <!-- Practice Grid -->
        <div class="grid grid-cols-6 gap-0 border-t border-l border-black">
          <!-- 6 cols x 10 rows = 60 boxes -->
          <template v-for="row in 10" :key="row">
             <div v-for="col in 6" :key="`${row}-${col}`" class="aspect-square border-r border-b border-black relative">
                <!-- Inner Guidelines (Rice Grid / Mi Zi Ge) -->
                <div class="absolute inset-0">
                  <svg viewBox="0 0 100 100" class="w-full h-full opacity-30 pointer-events-none">
                    <line x1="0" y1="0" x2="100" y2="100" stroke="black" stroke-dasharray="2 2" vector-effect="non-scaling-stroke"/>
                    <line x1="100" y1="0" x2="0" y2="100" stroke="black" stroke-dasharray="2 2" vector-effect="non-scaling-stroke"/>
                    <line x1="50" y1="0" x2="50" y2="100" stroke="black" stroke-dasharray="2 2" vector-effect="non-scaling-stroke"/>
                    <line x1="0" y1="50" x2="100" y2="50" stroke="black" stroke-dasharray="2 2" vector-effect="non-scaling-stroke"/>
                  </svg>
                </div>
                
                <!-- Content Logic -->
                <!-- First box: Solid Black Character -->
                <div v-if="row === 1 && col === 1" class="absolute inset-0 flex items-center justify-center">
                   <span class="text-6xl font-kaiti font-serif">{{ char }}</span>
                </div>
                <!-- Row 1: Traceable Gray -->
                <div v-else-if="row <= 2" class="absolute inset-0 flex items-center justify-center">
                   <span class="text-6xl font-kaiti font-serif text-gray-300">{{ char }}</span>
                </div>
                <!-- Others: Empty for practice -->
             </div>
          </template>
        </div>

        <!-- Script/Footer -->
        <div class="mt-8 pt-4 border-t border-gray-200">
          <p class="font-bold mb-2">速记口诀：</p>
          <p class="text-lg text-gray-700 font-serif">{{ data.script }}</p>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;700&display=swap');

.font-kaiti {
  font-family: "KaiTi", "STKaiti", "Ma Shan Zheng", serif;
}
</style>
