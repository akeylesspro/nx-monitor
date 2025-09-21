<script setup lang="ts">
import { Page } from "@/components";
import { ref } from "vue";
const pageName = ref("home");
</script>

<template>
    <Page :pageName="pageName" />
</template>
