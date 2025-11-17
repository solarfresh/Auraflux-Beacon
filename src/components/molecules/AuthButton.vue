<template>
  <Button
    :variant="isLoggedIn ? 'secondary' : 'primary'"
    size="sm"
    @click="handleClick"
  >
    <Icon
      :name="isLoggedIn ? 'user-times' : 'sign-in-alt'"
      type="solid"
      size="sm"
      class="mr-1"
      :color="isLoggedIn ? 'gray-700' : 'white'"
    />

    <Text tag="span" size="sm" weight="medium" :color="isLoggedIn ? 'gray-700' : 'white'">
      {{ isLoggedIn ? 'Logout' : 'Login' }}
    </Text>
  </Button>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';

// --- Props ---
const props = defineProps({
  /**
   * Indicates the current authentication status of the user.
   */
  isLoggedIn: {
    type: Boolean,
    required: true,
  },
});

// --- Emits ---
const emit = defineEmits<{
  (e: 'login'): void
  (e: 'logout'): void
}>();

// --- Logic ---
const handleClick = () => {
  // Emit the appropriate event based on the current state
  if (props.isLoggedIn) {
    emit('logout');
  } else {
    emit('login');
  }
};
</script>

<style scoped>
/* Scoped styles here if needed, but styling is primarily handled by the Button atom */
</style>