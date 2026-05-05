<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>()

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    :disabled="disabled"
    class="ui-btn"
    :class="[
      `ui-btn--${variant ?? 'primary'}`,
      `ui-btn--${size ?? 'md'}`,
      disabled && 'ui-btn--disabled'
    ]"
    @click="!disabled && $emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.ui-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  border: 1px solid transparent;
  line-height: 1;
  white-space: nowrap;
}

/* Sizes */
.ui-btn--sm  { padding: 4px 10px;  font-size: 11px; }
.ui-btn--md  { padding: 6px 14px;  font-size: 13px; }
.ui-btn--lg  { padding: 10px 20px; font-size: 15px; }

/* Variants */
.ui-btn--primary {
  background: #146190;
  color: #ffffff;
  border-color: #146190;
}
.ui-btn--primary:hover:not(:disabled) {
  background: #0f4d73;
  border-color: #0f4d73;
}

.ui-btn--secondary {
  background: #e3f0fb;
  color: #146190;
  border-color: #8accef;
}
.ui-btn--secondary:hover:not(:disabled) {
  background: #c1e3f6;
  border-color: #4cb2e4;
}

.ui-btn--outline {
  background: transparent;
  color: #146190;
  border-color: #146190;
}
.ui-btn--outline:hover:not(:disabled) {
  background: #e3f0fb;
}

.ui-btn--ghost {
  background: transparent;
  color: #146190;
  border-color: transparent;
}
.ui-btn--ghost:hover:not(:disabled) {
  background: #e3f0fb;
}

.ui-btn--danger {
  background: #ef4444;
  color: #ffffff;
  border-color: #ef4444;
}
.ui-btn--danger:hover:not(:disabled) {
  background: #dc2626;
  border-color: #dc2626;
}

/* Disabled */
.ui-btn--disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
