<script setup lang="ts">
import { useMainStore } from "../../stores";
import { storeToRefs } from "pinia";
const mainStore = useMainStore();
const { name } = storeToRefs(mainStore);
const { setName } = mainStore;
</script>

<template>
    <div class="p-6">
        <h1 class="text-3xl font-bold">About</h1>
        <p>{{ name }}</p>
        <button @click="setName((name) => name + ' John')">Set Name</button>
    </div>
</template>
