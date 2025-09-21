<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useThemeStore } from "../stores";

const themeStore = useThemeStore();
const { theme, activeTheme } = storeToRefs(themeStore);
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement>();
const buttonRef = ref<HTMLElement>();
const menuRef = ref<HTMLElement>();
const menuStyles = ref<Record<string, string>>({});

const handleThemeSelect = (value: typeof theme.value) => {
    theme.value = value;
    isOpen.value = false;
};

const toggleDropdown = async () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        await nextTick();
        positionMenu();
    }
};

const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (dropdownRef.value && !dropdownRef.value.contains(target) && menuRef.value && !menuRef.value.contains(target)) {
        isOpen.value = false;
        window.removeEventListener("resize", positionMenu);
        window.removeEventListener("scroll", positionMenu, true);
    }
};

const positionMenu = () => {
    const padding = 8;
    const preferredMenuWidth = 180;
    if (!buttonRef.value || !menuRef.value) return;

    const rect = buttonRef.value.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const maxLeft = viewportWidth - preferredMenuWidth - padding;
    let left = Math.min(rect.right - preferredMenuWidth, maxLeft);
    left = Math.max(left, padding);

    const spaceBelow = viewportHeight - rect.bottom - padding;
    const spaceAbove = rect.top - padding;
    const openDown = spaceBelow >= spaceAbove;
    const menuEl = menuRef.value;
    const measuredHeight = menuEl ? menuEl.offsetHeight : 0;
    const allowedHeight = Math.min(320, openDown ? spaceBelow : spaceAbove);
    const finalTop = openDown ? rect.bottom + padding : Math.max(padding, rect.top - (measuredHeight || allowedHeight) - padding);

    menuStyles.value = {
        position: "fixed",
        left: `${left}px`,
        top: `${finalTop}px`,
        width: `${preferredMenuWidth}px`,
        maxHeight: `${Math.max(120, allowedHeight)}px`,
        overflowY: "auto",
        zIndex: "9999",
    } as Record<string, string>;
};

const themeOptions = [
    { value: "system", label: "System", icon: "🖥️" },
    { value: "light", label: "Light", icon: "☀️" },
    { value: "dark", label: "Dark", icon: "🌙" },
] as const;

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
    <div ref="dropdownRef" class="relative">
        <!-- Theme Button -->
        <button
            ref="buttonRef"
            @click="toggleDropdown"
            class="p-2 rounded-lg hover:bg-[var(--color-surface)] border border-[var(--color-border)] transition-colors duration-200 flex items-center justify-center"
            aria-label="Toggle theme"
            aria-haspopup="true"
            :aria-expanded="isOpen"
        >
            <!-- Sun Icon (Light Theme) -->
            <svg
                v-if="activeTheme === 'light'"
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
            </svg>

            <!-- Moon Icon (Dark Theme) -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
            </svg>
        </button>

        <!-- Theme Options Dropdown -->
        <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
        >
            <Teleport to="body">
                <div
                    v-if="isOpen"
                    ref="menuRef"
                    class="p-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg shadow-xl z-50"
                    :style="menuStyles"
                >
                    <div class="space-y-1">
                        <button
                            v-for="option in themeOptions"
                            :key="option.value"
                            @click="handleThemeSelect(option.value)"
                            class="w-full px-3 py-2 text-left rounded-md transition-colors duration-150 flex items-center gap-2"
                            :class="{
                                'bg-[var(--color-surface)]': theme === option.value,
                            }"
                        >
                            <span class="text-base">{{ option.icon }}</span>
                            <span class="text-sm font-medium">{{ option.label }}</span>
                        </button>
                    </div>
                </div>
            </Teleport>
        </Transition>
    </div>
</template>
