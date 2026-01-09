<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import HanziWriter from 'hanzi-writer';

const props = defineProps<{
  char: string;
  size?: number;
}>();

const writerContainer = ref<HTMLElement | null>(null);
let writer: HanziWriter | null = null;
const isAnimating = ref(false);
const isQuizMode = ref(false);

const emit = defineEmits<{
  (e: 'update:strokes', count: number): void
}>();

const initWriter = () => {
  if (!writerContainer.value) return;

  writer = HanziWriter.create(writerContainer.value, props.char, {
    width: props.size || 300,
    height: props.size || 300,
    padding: 20,
    showOutline: true,
    strokeAnimationSpeed: 1, // 1x normal speed
    delayBetweenStrokes: 200,
    // Tech theme colors
    strokeColor: '#00f3ff', // Cyan - tech-primary
    radicalColor: '#00ff9d', // Green - tech-accent
    outlineColor: '#1e293b', // Dark Slate - tech-bg/grid
    drawingColor: '#7000ff', // Purple - tech-secondary (for quiz)
    highlightColor: '#7000ff', // Purple
    outlineWidth: 2,
    drawingWidth: 20,
    showCharacter: true,
    showHintAfterMisses: 3,
  });

  // Emit stroke count using a small hack since API doesn't expose it synchronously in create config,
  // but it's available after create usually if data loaded or via promise.
  // Actually HanziWriter instance loads data async usually.
  // Best way: use loadCharacterData or wait for writer to load.
  // We can use the animate callback or just fetch data separately in parent.
  // Or: writer has `_character` property but it's internal.
  // Let's rely on onLoadCharData event if it exists? No.
  // Let's just fetch it again or use what we have.
  // Actually, DetailView already knows `data.radicals` from DB.
  // But DB doesn't have stroke count.
  // We can get stroke count from HanziWriter.loadCharacterData.
  HanziWriter.loadCharacterData(props.char).then((charData: any) => {
      emit('update:strokes', charData.strokes.length);
  });
};

const animate = () => {
  if (!writer) return;
  
  // If already animating, don't restart logic, just ensure flag is true
  if (isAnimating.value) return;

  isAnimating.value = true;
  isQuizMode.value = false;

  const loop = () => {
      if (!isAnimating.value || !writer) return;
      writer.animateCharacter({
        onComplete: () => {
          if (isAnimating.value) {
              // Loop with a small delay
              setTimeout(loop, 1000);
          }
        },
      });
  };
  
  loop();
};

const startQuiz = () => {
  if (!writer) return;
  isQuizMode.value = true;
  isAnimating.value = false;
  
  // Cancel any running animation immediately if possible
  // HanziWriter usually cancels previous action when new one starts
  
  // Ensure we start from scratch properly
  writer.quiz({
    onComplete: () => {
       // Optional: Add success effect here
       console.log('Quiz completed!');
    }
  });
};

watch(() => props.char, () => {
  if (writerContainer.value) {
    writerContainer.value.innerHTML = '';
    initWriter();
    animate();
  }
});

onMounted(() => {
  initWriter();
  // Auto animate on mount
  setTimeout(animate, 500);
});

onUnmounted(() => {
  // Cleanup if necessary (HanziWriter doesn't have explicit destroy, but clearing DOM helps)
});

</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <!-- Holographic Platform -->
    <div class="relative group">
      <!-- Glow Effects -->
      <div class="absolute -inset-1 bg-gradient-to-r from-tech-primary via-tech-secondary to-tech-primary rounded-full opacity-20 group-hover:opacity-40 blur transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      
      <div class="relative bg-tech-bg/80 backdrop-blur-sm border border-tech-primary/30 rounded-2xl p-4 shadow-neon overflow-hidden">
        <!-- Grid Background inside the writer area -->
        <div class="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
        <div ref="writerContainer" class="cursor-pointer"></div>
        
        <!-- Corner Accents -->
        <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-tech-primary"></div>
        <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-tech-primary"></div>
        <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-tech-primary"></div>
        <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-tech-primary"></div>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex gap-4">
      <button 
        @click="animate" 
        class="px-6 py-2 rounded-lg font-bold transition-all duration-300 flex items-center gap-2"
        :class="isAnimating ? 'bg-tech-primary text-tech-bg shadow-neon' : 'bg-tech-card border border-tech-primary/50 text-tech-primary hover:bg-tech-primary/10'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
        </svg>
        <span>演示</span>
      </button>

      <button 
        @click="startQuiz" 
        class="px-6 py-2 rounded-lg font-bold transition-all duration-300 flex items-center gap-2"
        :class="isQuizMode ? 'bg-tech-secondary text-white shadow-neon-purple' : 'bg-tech-card border border-tech-secondary/50 text-tech-secondary hover:bg-tech-secondary/10'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
        <span>描红</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.animate-tilt {
  animation: tilt 10s infinite linear;
}
@keyframes tilt {
  0%, 50%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(0.5deg);
  }
  75% {
    transform: rotate(-0.5deg);
  }
}
</style>
