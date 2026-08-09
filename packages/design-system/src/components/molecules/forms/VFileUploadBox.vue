<template>
  <VBox
    tag="div"
    :intent="isDragging ? 'brand' : 'neutral'"
    :surface="isDragging ? 'soft' : 'outline'"
    border="dashed"
    rounded="lg"
    padding="lg"
    role="button"
    :tabindex="disabled ? -1 : 0"
    :aria-disabled="disabled"
    :class="[
      'flex flex-col items-center justify-center text-center transition-colors duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
    ]"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
    @click="triggerFileInput"
    @keydown.enter.prevent="triggerFileInput"
    @keydown.space.prevent="triggerFileInput"
  >
    <!-- Hidden Native File Input -->
    <VInput
      ref="fileInputRef"
      type="file"
      class="sr-only"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      @change="handleFileChange"
    />

    <VStack align="center" gap="sm" class="pointer-events-none">
      <!-- Icon Wrapper Container -->
      <VBox padding="sm" intent="neutral" surface="soft" rounded="full" border="all">
        <VIcon name="arrow-up-tray" size="md" intent="neutral" />
      </VBox>

      <!-- Label & Description Text Hierarchy -->
      <VStack gap="xs" align="center">
        <VTypography weight="semibold" size="sm">
          <slot name="title" :disabled="disabled">Click to upload or drag and drop</slot>
        </VTypography>
        <VTypography size="xs" intent="neutral">
          <slot name="description" :disabled="disabled">Supports PDF, Markdown, TXT, or JSON files</slot>
        </VTypography>
      </VStack>
    </VStack>
  </VBox>
</template>

<script setup lang="ts">
/**
 * VFileUploadBox (Molecule)
 * A drag-and-drop file upload container with visual feedback states,
 * built on top of layout and atom components.
 */
import { ref } from 'vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';

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

const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
let dragCounter = 0;

const triggerFileInput = () => {
  if (props.disabled) return;
  fileInputRef.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;
  const filesArray = Array.from(target.files);
  emit('change', filesArray);
  target.value = ''; // Reset input value to allow re-uploading the same file
};

const handleDragEnter = () => {
  if (props.disabled) return;
  dragCounter++;
  isDragging.value = true;
};

const handleDragOver = () => {
  if (props.disabled) return;
  isDragging.value = true;
};

const handleDragLeave = () => {
  if (props.disabled) return;
  dragCounter--;
  if (dragCounter <= 0) {
    isDragging.value = false;
    dragCounter = 0;
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  dragCounter = 0;
  if (props.disabled) return;

  const files = event.dataTransfer?.files;
  if (!files) return;

  const filesArray = Array.from(files);
  emit('change', filesArray);
};
</script>