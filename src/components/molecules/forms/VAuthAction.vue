<template>
  <VButton
    :variant="isLoggedIn ? 'secondary' : 'primary'"
    size="sm"
    :iconName="isLoggedIn ? 'UserMinus' : 'ArrowRightOnRectangle'"
    @click="handleClick"
  >
    {{ isLoggedIn ? 'Logout' : 'Login' }}
  </VButton>
</template>

<script setup lang="ts">
import VButton from '@/components/atoms/buttons/VButton.vue';

/**
 * AuthButton Molecule
 * A state-aware trigger for session management.
 * Dispatched from the 'actions' directory.
 */
const props = defineProps<{
  /** Current session status */
  isLoggedIn: boolean;
}>();

const emit = defineEmits<{
  (e: 'login'): void;
  (e: 'logout'): void;
}>();

const handleClick = () => {
  if (props.isLoggedIn) {
    emit('logout');
  } else {
    emit('login');
  }
};
</script>