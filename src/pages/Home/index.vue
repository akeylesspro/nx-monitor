<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";

const count = ref(0);
const state = reactive({ items: [0] });
const doubled = computed(() => count.value * 2);

watch(count, (n, p) => console.log("count:", p, "->", n));
watch(state.items, (n, p) => console.log("items:", p, "->", n));
onMounted(() => console.log("mounted!"));
const onClick = () => {
    count.value++;
    state.items.push(state.items[state.items.length - 1] + 1);
};
const clearList = () => {
    state.items = [0];
    count.value = 0;
};
</script>

<template>
    <div class="flex gap-3 flex-col items-start justify-start h-full flex-wrap">
        <button class="bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-md p-2" @click="onClick">Clicked to increase</button>
        <button class="bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-md p-2" @click="clearList">Clear List</button>
        <p>count: {{ count }}</p>
        <p>count x2: {{ doubled }}</p>
        <div v-for="n in state.items" :key="n">{{ n }}</div>
    </div>
</template>
