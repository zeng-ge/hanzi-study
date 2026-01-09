<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import HanziWriter from 'hanzi-writer';

const props = defineProps<{
  char: string;
}>();

const container = ref<HTMLElement | null>(null);

const renderStrokes = async () => {
  if (!container.value) return;
  container.value.innerHTML = '';

  // Get stroke data using HanziWriter.loadCharacterData
  // We can render static SVG paths for each step
  try {
    const data = await HanziWriter.loadCharacterData(props.char) as any;
    
    if (!data) return;

    // For each stroke, create a small svg
    for (let i = 0; i < data.strokes.length; i++) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'w-16 h-16 md:w-20 md:h-20 bg-white border border-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden print:border-black';
        
        // Use HanziWriter to render into this div but static
        const writer = HanziWriter.create(stepDiv, props.char, {
            width: 80,
            height: 80,
            padding: 5,
            showCharacter: false,
            showOutline: true, // Show faint outline of full char
            outlineColor: '#e2e8f0',
            strokeColor: '#000000', // Black strokes for sequence
        });

        // We only want to show strokes up to i
        // HanziWriter doesn't have a simple "show up to stroke X" static mode easily exposed without animation hacks or custom SVG rendering.
        // However, we can use the `animateCharacter` with specific callback or just custom SVG construction.
        // EASIER APPROACH: Use FanningStrokes from hanzi-writer-data if available, OR
        // Use the writer instance and hide strokes > i.
        
        // Actually, HanziWriter has no direct method to "render static snapshot at stroke N".
        // But we can trigger animation to end immediately or use `writer.showOutline` + `writer.quiz`? No.
        // The standard way to do "Stroke Order" images is usually server-side or using the raw SVG data.
        
        // WORKAROUND: Create writer, hide all, show specific strokes.
        writer.hideCharacter();
        writer.showOutline();
        for (let j = 0; j <= i; j++) {
            // There isn't a public API to show specific stroke index easily in static mode without animation.
            // But we can color them.
            // Let's try:
             // Actually, the easiest way for "Stroke Sequence" client-side with HanziWriter is:
             // 1. Create writer.
             // 2. Set stroke colors: strokes <= i are black, > i are transparent.
             // But outline is separate.
        }
        
        // Better approach for visual sequence using raw SVG data if possible, but let's stick to HanziWriter API.
        // We will just render the full character but set colors of future strokes to transparent?
        // HanziWriter options allow `strokeColor` to be a function? No, usually string.
        
        // Let's try a different trick: 
        // We can't easily do it with standard HanziWriter instance per step without hacking.
        // BUT, HanziWriter has a `FanningStrokes` equivalent if we just want to show the order.
        
        // SIMPLIFIED: Just show the index number? No, user wants visual.
        
        // Let's use a simple SVG builder since we have the data.
        // data.strokes is array of SVG path strings.
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 1024 1024");
        svg.style.width = "100%";
        svg.style.height = "100%";
        
        // Flip vertically because HanziWriter data is flipped
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("transform", "scale(1, -1) translate(0, -900)"); // Approximate transform for HanziWriter data usually centered in 1024x1024 but y-flipped
        
        // Background (Outline) - optional, lighter
        data.strokes.forEach((pathStr: string) => {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathStr);
            path.setAttribute("fill", "#e5e7eb"); // Light gray
            g.appendChild(path);
        });

        // Current strokes up to i
        for (let j = 0; j <= i; j++) {
             const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
             path.setAttribute("d", data.strokes[j]);
             path.setAttribute("fill", i === j ? "#000000" : "#374151"); // Last stroke darker/black, others dark gray
             g.appendChild(path);
        }

        svg.appendChild(g);
        stepDiv.innerHTML = ''; // Clear writer
        stepDiv.appendChild(svg);
        
        // Add step number
        const num = document.createElement('span');
        num.className = "absolute top-0.5 left-1 text-[10px] text-gray-400 font-mono";
        num.innerText = (i + 1).toString();
        stepDiv.appendChild(num);
        
        container.value.appendChild(stepDiv);
    }

  } catch (e) {
    console.error(e);
  }
};

watch(() => props.char, renderStrokes);
onMounted(renderStrokes);

</script>

<template>
  <div class="w-full overflow-x-auto pb-2">
    <div ref="container" class="flex gap-2 min-w-max px-1">
      <!-- Generated items will go here -->
    </div>
  </div>
</template>
