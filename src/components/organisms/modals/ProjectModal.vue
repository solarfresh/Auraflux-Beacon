<template>
  <VModal
    :is-open="isOpen"
    title="Create New Project"
    size="md"
    @close="handleClose"
  >
    <VForm @submit="submitForm">
      <VStack gap="md">
        <!-- Project Name -->
        <VFormField
          label="Project Name"
          :required="true"
          :error="errors.name"
        >
          <template #default="{ id }">
            <VInput
              :id="id"
              v-model="localProject.name"
              placeholder="e.g., Annual Budget Planning, Website Migration, Research Initiative"
              :disabled="isSubmitting"
            />
          </template>
        </VFormField>

        <!-- Project Description -->
        <VFormField
          label="Description"
          description="Provide a brief overview of your research goals."
        >
          <template #default="{ id }">
            <VTextarea
              :id="id"
              v-model="localProject.description"
              placeholder="What are you trying to find out?"
              :disabled="isSubmitting"
            />
          </template>
        </VFormField>
        <VFormField
          label="Tags"
          description="Enter tags separated by commas (e.g., research, ai, quantum)"
        >
          <template #default="{ id }">
            <VTagInput
              :id="id"
              v-model="localProject.tags"
              placeholder="Press Enter to add a tag (e.g., Strategy, Migration, Research)"
              :disabled="isSubmitting"
            />
          </template>
        </VFormField>
      </VStack>
    </VForm>

    <template #footer>
      <VButton
        variant="tertiary"
        :disabled="isSubmitting"
        @click="handleClose"
      >
        Cancel
      </VButton>
      <VButton
        :loading="isSubmitting"
        @click="submitForm"
      >
        Create Project
      </VButton>
    </template>
  </VModal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useProjectStore } from '@/stores/project';

// Components
import VModal from '@/components/molecules/feedback/VModal.vue';
import VForm from '@/components/molecules/forms/VForm.vue';
import VFormField from '@/components/molecules/forms/VFormField.vue';
import VInput from '@/components/atoms/forms/VInput.vue';
import VTextarea from '@/components/atoms/forms/VTextarea.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VTagInput from '@/components/molecules/forms/VTagInput.vue';

import type { Project } from '@/interfaces/project';

const props = defineProps<{ project: Project; isNew?: boolean; isOpen: boolean }>();
const emit = defineEmits(['confirm', 'cancel']);

const projectStore = useProjectStore();
const isSubmitting = ref(false);

const localProject = ref({ ...props.project });

const errors = reactive({
  name: ''
});

const handleClose = () => {
  localProject.value.name = '';
  localProject.value.description = '';
  localProject.value.tags = [];
  errors.name = '';
  emit('cancel');
};

const submitForm = async () => {
  if (!localProject.value.name.trim()) {
    errors.name = 'Project name is required';
    return;
  }

  errors.name = '';
  isSubmitting.value = true;

  try {
    if (props.isNew) {
      await projectStore.createProject(localProject.value);
    }

    emit('confirm');
    handleClose();
  } catch (e) {
    console.error('Failed to create project', e);
  } finally {
    isSubmitting.value = false;
  }
};
</script>