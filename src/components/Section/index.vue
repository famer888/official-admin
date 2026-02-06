<template>
    <div class="bg-white rounded-2xl shadow border">
        <div v-if="!(hiddenTitle && hiddenToolbar)"
            class="flex p-4 border-b border-[#e5e5e5] justify-between items-center">
            <div class="flex text-base font-bold items-center">
                <slot name="title"></slot>
            </div>
            <div class="flex gap-2">
                <slot name="toolbar"></slot>
            </div>
        </div>
        <slot name="content"></slot>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps({
    hiddenTitle: {
        type: Boolean,
        default: false
    },
    hiddenToolbar: {
        type: Boolean,
        default: false
    }
})
</script>