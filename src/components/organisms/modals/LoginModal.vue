<template>
  <VModal :is-open="isOpen" size="md" @close="emit('close')">
    <VBox tag="header" background="slate-50" padding="lg" border="bottom" class="text-center">
      <VStack align="center" gap="md">
        <VBox background="white" padding="sm" rounded="2xl" border="all" class="shadow-sm inline-flex">
          <VIcon name="LockClosed" size="6" class="text-indigo-600" />
        </VBox>

        <VStack gap="xs">
          <VTypography tag="h2" size="2xl" weight="bold">
            User Login
          </VTypography>
          <VTypography size="sm" class="text-slate-500">
            Access your research initiatives and strategic workspace.
          </VTypography>
        </VStack>
      </VStack>
    </VBox>

    <VBox padding="lg">
      <VForm gap="md" @submit="handleLogin">

        <VFormField label="Username" v-slot="{ id }">
          <VInput :id="id" v-model="username" :disabled="isSubmitting" required />
        </VFormField>

        <VFormField label="Password" v-slot="{ id }">
          <VInput :id="id" v-model="password" type="password" :disabled="isSubmitting" required />
        </VFormField>

        <transition name="fade">
          <VAlert v-if="error" variant="danger">
            <VCluster gap="xs">
              <VIcon name="ExclamationCircle" size="4" />
              <VTypography size="xs">{{ error }}</VTypography>
            </VCluster>
          </VAlert>
        </transition>

        <VBox class="pt-2">
          <VButton
            type="submit"
            variant="primary"
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
      <VTypography size="xs" class="text-slate-400">
        By logging in, you agree to our research workspace protocols.
      </VTypography>
    </VBox>
  </VModal>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Atoms & Molecules
import VButton from '@/components/atoms/buttons/VButton.vue';
import VInput from '@/components/atoms/forms/VInput.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VForm from '@/components/molecules/forms/VForm.vue';
import VFormField from '@/components/molecules/forms/VFormField.vue';
import VAlert from '@/components/molecules/indicators/VAlert.vue';
import VModal from '@/components/molecules/indicators/VModal.vue';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const error = ref('');
const isSubmitting = ref(false);

const handleLogin = async () => {
  if (isSubmitting.value) return;
  error.value = '';
  isSubmitting.value = true;

  try {
    const success = await authStore.loginUser(username.value, password.value);
    if (success) {
      username.value = '';
      password.value = '';
      emit('close');
      router.go(0);
    } else {
      error.value = 'Invalid username or password.';
    }
  } catch (err: any) {
    error.value = err.message || 'Authentication server unreachable.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>