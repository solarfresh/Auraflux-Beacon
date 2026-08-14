<template>
  <VModal :is-open="isOpen" size="md" @close="emit('close')">
    <VBox tag="header" intent="brand" surface="solid" padding="lg" border="bottom" class="text-center">
      <VStack align="center" gap="md">
        <VBox padding="sm" intent="brand" surface="solid" rounded="2xl" border="all" :inline="true" class="shadow-sm">
          <VIcon name="LockClosed" size="xs" />
        </VBox>

        <VStack gap="xs">
          <VTypography tag="h2" size="2xl" weight="bold">
            User Login
          </VTypography>
          <VTypography size="sm">
            Access your research initiatives and strategic workspace.
          </VTypography>
        </VStack>
      </VStack>
    </VBox>

    <VBox padding="lg">
      <VForm gap="md" @submit="emit('login')">

        <VFormField label="Username" v-slot="{ id }">
          <VInput :id="id" :model-value="username" :disabled="isSubmitting" @update:model-value="emit('update:username', $event)" required />
        </VFormField>

        <VFormField label="Password" v-slot="{ id }">
          <VInput :id="id" :model-value="password" type="password" @update:model-value="emit('update:password', $event)" :disabled="isSubmitting" required />
        </VFormField>

        <transition name="fade">
          <VAlert v-if="error" intent="danger" surface="soft">
            <VCluster gap="xs">
              <VIcon name="ExclamationCircle" size="sm" />
              <VTypography size="xs" intent="danger" surface="soft">{{ error }}</VTypography>
            </VCluster>
          </VAlert>
        </transition>

        <VBox class="pt-2">
          <VButton
            type="submit"
            attention="primary"
            size="lg"
            class="w-full"
            :disabled="isSubmitting"
          >
            Sign In
          </VButton>
        </VBox>

      </VForm>
    </VBox>

    <VBox tag="footer" padding="lg" class="pt-0 text-center">
      <VTypography size="xs" attention="secondary">
        By logging in, you agree to our research workspace protocols.
      </VTypography>
    </VBox>
  </VModal>
</template>

<script setup lang="ts">
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VForm from '@auraflux/design-system/components/molecules/forms/VForm.vue';
import VFormField from '@auraflux/design-system/components/molecules/forms/VFormField.vue';
import VAlert from '@auraflux/design-system/components/molecules/indicators/VAlert.vue';
import VModal from '@auraflux/design-system/components/molecules/indicators/VModal.vue';

const props = defineProps<{
  username: string;
  password: string;
  error: string;
  isOpen: boolean;
  isSubmitting: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'login'): void;
  (e: 'update:username', value: string): void;
  (e: 'update:password', value: string): void;
}>();
</script>