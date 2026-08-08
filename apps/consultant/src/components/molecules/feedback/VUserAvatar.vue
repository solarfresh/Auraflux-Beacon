<template>
  <VBox
    position="relative"
    class="shrink-0"
  >
    <VButton
      :attention="attention"
      :intent="intent"
      :surface="surface"
      :size="size"
      border="none"
    >
      <img
        v-if="src && !imageError"
        :src="src"
        :alt="name || 'User Avatar'"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />

      <VIcon
        v-else
        name="User"
        type="solid"
        :size="size === 'lg' ? 'md' : 'sm'"
      />
    </VButton>

    <VBox
      v-if="status !== 'none'"
      position="absolute"
      bottom="0"
      right="0"
      width="3"
      height="3"
      rounded="full"
      intent="info"
      surface="solid"
    />
  </VBox>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import type {
  AttentionToken,
  IntentToken,
  ComponentSizeToken,
  SurfaceToken
} from '@auraflux/design-system/interfaces/theme';

export interface VUserAvatar {
  /** The URL of the user's avatar image. */
  src?: string | null;
  /** The user's name, used to generate initials if 'src' is missing. */
  name?: string;
  attention?: AttentionToken;
  /** Explicit semantic intent token */
  intent?: IntentToken;
  /** Explicit surface container model token */
  surface?: SurfaceToken;
  size?: ComponentSizeToken;
  /** The user's system status. */
  status?: 'online' | 'busy' | 'offline' | 'none';
};

const props = withDefaults(defineProps<VUserAvatar>(), {
  size: 'md',
  status: 'none'
});

// --- Image Handling ---
const imageError = ref(false);
const handleImageError = () => { imageError.value = true; };
</script>