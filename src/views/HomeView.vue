<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { hanziData, highFreqChars } from '../data/hanzi-db';

const router = useRouter();
const searchQuery = ref('');
const showSuggestions = ref(false);

const suggestions = computed(() => {
  if (!searchQuery.value) return [];
  const query = searchQuery.value.trim().toLowerCase();
  return highFreqChars.filter(char => {
    const data = hanziData[char];
    return char.includes(query) || 
           (data?.pinyin && data.pinyin.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùüǖǘǚǜ]/g, (m) => 
             'aaaaeeeeiiiioooouuuuüüüü'['āáǎàēéěèīíǐìōóǒòūúǔùüǖǘǚǜ'.indexOf(m)] || m
           ).includes(query)); // Basic pinyin match (stripping tones roughly for this demo or exact match)
  }).slice(0, 8);
});

const handleSearch = () => {
  const char = searchQuery.value.trim();
  if (char && hanziData[char]) {
    router.push({ name: 'detail', params: { char } });
  } else if (suggestions.value.length > 0) {
    // If exact match not found but suggestion exists, go to first suggestion
    router.push({ name: 'detail', params: { char: suggestions.value[0] } });
  } else {
    // Fallback or error shake animation could go here
    alert('未找到该汉字，请尝试输入高频汉字，如“马”、“我”等。');
  }
};

const selectSuggestion = (char: string) => {
  router.push({ name: 'detail', params: { char } });
};

const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};

const randomChar = () => {
  const randomIndex = Math.floor(Math.random() * highFreqChars.length);
  const char = highFreqChars[randomIndex];
  router.push({ name: 'detail', params: { char } });
};
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
    <!-- Matrix/Star Background (Static representation for now) -->
    <div class="absolute inset-0 z-0 bg-tech-bg">
      <div class="absolute inset-0 bg-[url('https://api.iconify.design/ph:code-bold.svg?color=%231e293b')] opacity-5 animate-pulse bg-repeat space-x-12 space-y-12"></div>
    </div>

    <!-- Main Terminal Container -->
    <div class="z-10 w-full max-w-2xl px-4 flex flex-col items-center gap-12">
      
      <!-- Title / Logo -->
      <div class="text-center space-y-4 animate-fade-in-up">
        <h1 class="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-tech-primary via-white to-tech-secondary drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
          汉字终端
        </h1>
        <p class="text-tech-primary/70 text-lg md:text-xl tracking-widest font-mono">
          HANZI TERMINAL V1.0
        </p>
      </div>

      <!-- Search Core -->
      <div class="w-full relative group">
        <!-- Input Wrapper -->
        <div class="relative bg-tech-bg/50 backdrop-blur-md border border-tech-primary/50 rounded-2xl shadow-neon transition-all duration-300 group-hover:border-tech-primary group-hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="输入汉字或拼音启动解析..." 
            class="w-full bg-transparent border-none outline-none text-white text-xl p-6 placeholder-tech-muted/50 text-center font-bold tracking-widest"
            @keyup.enter="handleSearch"
            @focus="showSuggestions = true"
            @blur="handleBlur"
          />
          
          <!-- Search Icon / Action -->
          <button 
            @click="handleSearch"
            class="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-tech-primary hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <!-- Suggestions Dropdown -->
        <div v-if="showSuggestions && searchQuery && suggestions.length > 0" class="absolute top-full left-0 w-full mt-4 bg-tech-card backdrop-blur-xl border border-tech-secondary/30 rounded-xl overflow-hidden shadow-2xl z-50">
          <div 
            v-for="char in suggestions" 
            :key="char"
            @click="selectSuggestion(char)"
            class="flex items-center justify-between p-4 hover:bg-tech-secondary/20 cursor-pointer transition-colors border-b border-white/5 last:border-none"
          >
            <span class="text-2xl text-tech-primary font-bold">{{ char }}</span>
            <span class="text-tech-muted font-mono">{{ hanziData[char]?.pinyin }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-6 animate-fade-in-up" style="animation-delay: 0.2s;">
        <button @click="randomChar" class="px-8 py-3 bg-tech-card/50 border border-tech-accent/30 rounded-lg text-tech-accent hover:bg-tech-accent/10 hover:border-tech-accent hover:shadow-[0_0_15px_rgba(0,255,157,0.3)] transition-all flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <span>随机样本</span>
        </button>
      </div>

    </div>
    
    <!-- Footer Decorative -->
    <div class="absolute bottom-8 text-tech-muted/30 text-xs font-mono">
      SYSTEM STATUS: ONLINE // DB CONNECTED // READY FOR INPUT
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}
</style>
