<template>
  <Button
    :variant="isLoggedIn ? 'secondary' : 'primary'"
    size="sm"
    :iconName="isLoggedIn ? 'UserMinus' : 'ArrowRightOnRectangle'"
    @click="handleClick"
  >
    {{ isLoggedIn ? 'Logout' : 'Login' }}
  </Button>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';

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