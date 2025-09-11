<script setup lang="ts">
import NavButton from "./NavButton.vue";
</script>

<template>
    <div class="overflow-auto flex-1 flex flex-col gap-4 pe-2">
        <NavButton to="/" label="Home" />
        <NavButton to="/about" label="About" />
        <NavButton to="/test1" label="Test1" />
        <NavButton to="/test2" label="Test2" />
        <NavButton to="/test3" label="Test3" />
        <NavButton to="/test4" label="Test4" />
        <NavButton to="/test5" label="Test5" />
        <NavButton to="/test6" label="Test6" />
    </div>
</template>
