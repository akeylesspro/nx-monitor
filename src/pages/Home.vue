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
</script>

<template>
    <div class="flex gap-3 flex-col">
        <button @click="onClick">Clicked {{ count }} (x2 = {{ doubled }})</button>
        <button @click="state.items = [555]">Clicked 2</button>
        <div v-for="n in state.items" :key="n">{{ n }}</div>
    </div>
</template>
