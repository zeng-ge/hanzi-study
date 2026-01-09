<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { hanziData } from '../data/hanzi-db';
import HanziDemo from '../components/HanziDemo.vue';
import StrokeSequence from '../components/StrokeSequence.vue';

const route = useRoute();
const router = useRouter();
const char = route.params.char as string;
const data = hanziData[char];

const strokeCount = ref<number | null>(null);

const handleStrokeUpdate = (count: number) => {
  strokeCount.value = count;
};
</script>

<template>
  <div v-if="data" class="min-h-screen p-4 md:p-8 flex flex-col gap-6 relative">
    
    <!-- Top Nav -->
    <header class="flex justify-between items-center animate-fade-in-down">
      <button @click="goBack" class="text-tech-primary hover:text-white flex items-center gap-2 group">
        <span class="p-2 border border-tech-primary/30 rounded-full group-hover:bg-tech-primary/20 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
        </span>
        <span class="font-mono text-sm tracking-widest hidden md:inline">RETURN TO TERMINAL</span>
      </button>

      <div class="text-right">
        <h1 class="text-3xl font-bold text-white tracking-widest">{{ data.char }}</h1>
        <p class="text-tech-primary font-mono">{{ data.pinyin.toUpperCase() }}</p>
      </div>
    </header>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 max-w-7xl mx-auto w-full">
      
      <!-- Left Col: Visualizer (Hanzi Writer) -->
      <div class="lg:col-span-5 flex flex-col gap-6 animate-fade-in-up">
        <div class="bg-tech-card backdrop-blur-md border border-tech-primary/30 rounded-3xl p-8 flex flex-col items-center justify-center shadow-neon relative min-h-[400px]">
           <!-- Tech Decor -->
           <div class="absolute top-4 left-4 text-[10px] text-tech-muted font-mono">VISUALIZER.EXE RUNNING</div>
           
           <HanziDemo :char="data.char" :size="260" @update:strokes="handleStrokeUpdate" />

           <div class="mt-8 flex gap-4 w-full justify-center">
             <div class="text-center px-4 py-2 bg-tech-bg/50 rounded-lg border border-tech-primary/20">
               <span class="block text-xs text-tech-muted">部首</span>
               <span class="font-bold text-tech-text">{{ data.radicals || '?' }}</span>
             </div>
             <div class="text-center px-4 py-2 bg-tech-bg/50 rounded-lg border border-tech-primary/20">
               <span class="block text-xs text-tech-muted">笔画</span>
               <span class="font-bold text-tech-text">{{ strokeCount !== null ? strokeCount : '--' }}</span>
             </div>
           </div>
        </div>
      </div>

      <!-- Right Col: Data Analysis (Script, Origin, Etc) -->
      <div class="lg:col-span-7 flex flex-col gap-6 animate-fade-in-up" style="animation-delay: 0.2s;">
        
        <!-- Script / Decoder Card -->
        <div class="bg-tech-card backdrop-blur-md border border-tech-secondary/30 rounded-3xl p-8 flex-1 relative overflow-hidden group">
           <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
           </div>
           
           <h2 class="text-xl font-bold text-tech-secondary mb-6 flex items-center gap-2">
             <span class="w-2 h-8 bg-tech-secondary rounded-full"></span>
             记忆解码 / SCRIPT DECODER
           </h2>

           <div class="space-y-6 relative z-10">
             <div class="flex flex-col md:flex-row gap-6 items-start">
                <!-- Image if available -->
                <div v-if="data.image" class="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-white/10 rounded-xl p-2 border border-white/20">
                   <img :src="data.image" alt="illustration" class="w-full h-full object-contain" />
                </div>
                
                <!-- Script Text -->
                <div class="flex-1">
                   <p class="text-2xl md:text-3xl font-bold leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                     “{{ data.script }}”
                   </p>
                </div>
             </div>

             <div class="border-t border-white/10 pt-4 mt-4">
               <h3 class="text-sm font-mono text-tech-muted mb-2">ORIGIN ANALYSIS</h3>
               <p class="text-gray-300 leading-relaxed">{{ data.origin || '暂无字源数据...' }}</p>
             </div>
           </div>
        </div>

        <!-- Stroke Sequence Strip -->
        <div class="bg-white/5 border border-white/10 rounded-2xl p-4 overflow-hidden">
           <h3 class="text-xs font-mono text-tech-muted mb-3">STROKE SEQUENCE</h3>
           <StrokeSequence :char="data.char" />
        </div>

        <!-- Actions -->
        <div class="flex gap-4">
           <button @click="goToPrint" class="flex-1 py-4 bg-tech-primary/10 border border-tech-primary/50 text-tech-primary rounded-xl font-bold hover:bg-tech-primary hover:text-black transition-all flex justify-center items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              生成字帖 (PRINT)
           </button>
        </div>

      </div>

    </div>

  </div>
  <div v-else class="min-h-screen flex items-center justify-center text-tech-muted">
     DATA_NOT_FOUND // {{ char }}
  </div>
</template>

<style scoped>
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-down { animation: fadeInDown 0.6s ease-out forwards; }

.animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
