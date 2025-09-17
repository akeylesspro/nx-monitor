<script setup lang="ts">
import { NavButton } from ".";
import { toRefs } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
    class?: string;
}>();
const { class: className } = toRefs(props);
const { t } = useI18n();
</script>

<template>
    <div class="overflow-auto flex-1 flex flex-col gap-2 pe-2" :class="className">
        <NavButton to="/" :label="t('common.home')" />
        <NavButton to="/about" :label="t('common.about')" />
        <NavButton to="/test" :label="t('common.test')" />
    </div>
</template>
