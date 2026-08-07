<template>
  <VBox
    tag="div"
    surface="subtle"
    border="dashed"
    rounded="lg"
    padding="lg"
    :clickable="!disabled"
    :class="[
      'flex flex-col items-center justify-center text-center transition-colors duration-200',
      isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'hover:border-slate-400',
      disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
    ]"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
    @click="triggerFileInput"
  >
    <VInput
      ref="fileInputRef"
      type="file"
      class="hidden"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      @change="handleFileChange"
    />

    <VStack align="center" gap="sm">
      <VBox padding="sm" surface="base" rounded="full" border="all">
        <VIcon name="arrow-up-tray" size="md" theme="secondary" />
      </VBox>

      <VStack gap="xs" align="center">
        <VTypography weight="semibold" size="sm">
          <slot name="title" :disabled="disabled">Click to upload or drag and drop</slot>
        </VTypography>
        <VTypography size="xs" theme="ghost">
          <slot name="description" :disabled="disabled">Supports PDF, Markdown, TXT, or JSON files</slot>
        </VTypography>
      </VStack>
    </VStack>
  </VBox>
</template>

<script setup lang="ts">
/**
 * FileUploadBox (Molecule)
 * A drag-and-drop file upload container with visual feedback states,
 * built on top of layout and atom components.
 */
import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import { ref } from 'vue';

export interface VFileUploadBoxProps {
  /** Accepted file types (e.g. '.pdf,.txt') */
  accept?: string;
  /** Allow multiple files to be uploaded */
  multiple?: boolean;
  /** Disable the upload interaction */
  disabled?: boolean;
}

const props = withDefaults(defineProps<VFileUploadBoxProps>(), {
  accept: '',
  multiple: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'change', files: File[]): void;
}>();

const fileInputRef = ref<InstanceType<typeof VInput> | null>(null);
const isDragging = ref(false);

const triggerFileInput = () => {
  if (props.disabled) return;
  // Access the underlying DOM element inside VInput
  const $el = fileInputRef.value?.$el as HTMLInputElement | undefined;
  $el?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;
  const filesArray = Array.from(target.files);
  emit('change', filesArray);
  target.value = ''; // Reset input value to allow re-uploading the same file
};

const handleDragEnter = () => {
  if (!props.disabled) isDragging.value = true;
};

const handleDragOver = () => {
  if (!props.disabled) isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (props.disabled) return;

  const files = event.dataTransfer?.files;
  if (!files) return;

  const filesArray = Array.from(files);
  emit('change', filesArray);
};
</script>