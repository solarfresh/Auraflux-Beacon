<template>
  <VBox
    tag="section"
    surface="solid"
    intent="neutral"
    padding="none"
    class="w-1/2 flex flex-col h-full shadow-md"
  >
    <!-- Section Header Bar -->
    <VBox
      padding="md"
      border="bottom"
      surface="solid"
      class="shrink-0"
    >
      <VSectionHeader
        title="Agent Capabilities"
        icon="Sliders"
        size="sm"
        weight="semibold"
      />
    </VBox>

    <!-- Scrollable Form Body -->
    <VBox class="flex-1 overflow-y-auto p-6">
      <VForm gap="lg" @submit="handleSubmit">
        <!-- Core Intent -->
        <VFormField label="Core Design Intent">
          <template #default="{ id }">
            <VInput
              :id="id"
              v-model="formData.intent"
              placeholder="Enter agent purpose..."
              size="md"
            />
          </template>
        </VFormField>

        <!-- System Prompt -->
        <VFormField
          label="System Prompt"
          description="Defines operating boundaries and behavioral constraints"
        >
          <template #default="{ id }">
            <VTextarea
              :id="id"
              v-model="formData.systemPrompt"
              placeholder="Enter behavioral rules..."
              :rows="4"
              class="font-mono text-xs leading-relaxed"
            />
          </template>
        </VFormField>

        <!-- User Prompt Template -->
        <VFormField label="User Prompt Template">
          <template #labelExtra>
            <VCluster gap="xs" align="center">
              <VCode size="xs">{{ '\{\{' }}</VCode>
              <VTypography size="xs" attention="tertiary">Vars</VTypography>
            </VCluster>
          </template>
          <template #default="{ id }">
            <VTextarea
              :id="id"
              v-model="formData.userPromptTemplate"
              placeholder="Analyze: {{ text }}"
              :rows="4"
              class="font-mono text-xs leading-relaxed"
            />
          </template>
        </VFormField>

        <!-- Output Constraints -->
        <VStack
          class="w-full"
        >
          <VCluster justify="between" align="center" class="w-full">
            <VTypography tag="label" size="sm" weight="bold">
              Output Constraints
            </VTypography>
            <VButton
              type="button"
              size="xs"
              attention="secondary"
              iconName="Plus"
              @click="handleAddField"
            >
              Add Field
            </VButton>
          </VCluster>

          <VBox
            padding="none"
            rounded="lg"
            border="all"
            :class="[
              'flex items-center justify-center',
              formData.schemaFields?.length ? 'py-2' : 'py-6'
            ]"
          >
            <VEmptyState
              v-if="!formData.schemaFields?.length"
              icon="DocumentPlus"
              title="No Schema Defined"
              description="Click 'Add Field' to create structured constraints."
              icon-size="md"
              title-size="sm"
              description-size="xs"
              padding="md"
              rounded="lg"
            />

            <!-- Active Schema Field Items -->
            <VStack v-else gap="xs" class="w-full">
              <VSchemaItem
                v-for="(field, index) in formData.schemaFields"
                :key="field.id || index"
                :name="field.name"
                :type="field.type"
                :badge-text="field.badgeText"
                :badge-intent="field.badgeIntent"
                border="none"
                class="shadow-sm"
              >
                <template #badge>
                  <VCluster gap="xs" align="center">
                    <VBadge v-if="field.badgeText" :intent="field.badgeIntent" size="xs">
                      {{ field.badgeText }}
                    </VBadge>
                    <VButton
                      type="button"
                      size="xs"
                      intent="danger"
                      surface="base"
                      iconName="Trash"
                      border="none"
                      @click="handleRemoveField(index)"
                    />
                  </VCluster>
                </template>
              </VSchemaItem>
            </VStack>
          </VBox>
        </VStack>
      </VForm>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
/**
 * PromptSchemaPanel (Organism)
 * Production-ready interactive form panel for managing Agent prompts and output schemas.
 */
import type { IntentToken } from '@auraflux/design-system/interfaces/theme';
import { reactive, watch } from 'vue';

import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VTextarea from '@auraflux/design-system/components/atoms/forms/VTextarea.vue';
import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VCode from '@auraflux/design-system/components/atoms/indicators/VCode.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VForm from '@auraflux/design-system/components/molecules/forms/VForm.vue';
import VFormField from '@auraflux/design-system/components/molecules/forms/VFormField.vue';
import VSchemaItem from '@auraflux/design-system/components/molecules/indicators/VSchemaItem.vue';
import VSectionHeader from '@auraflux/design-system/components/molecules/indicators/VSectionHeader.vue';
import VEmptyState from '@auraflux/design-system/components/molecules/indicators/VEmptyState.vue';

export interface SchemaFieldItem {
  id?: string;
  name: string;
  type: string;
  badgeText?: string;
  badgeIntent?: IntentToken;
}

export interface PromptSchemaFormData {
  intent: string;
  systemPrompt: string;
  userPromptTemplate: string;
  schemaFields: SchemaFieldItem[];
}

const props = withDefaults(
  defineProps<{
    modelValue?: Partial<PromptSchemaFormData>;
  }>(),
  {
    modelValue: () => ({
      intent: '',
      systemPrompt: '',
      userPromptTemplate: '',
      schemaFields: [],
    }),
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: PromptSchemaFormData): void;
  (e: 'submit', value: PromptSchemaFormData): void;
  (e: 'addField'): void;
}>();

// Reactive form state initialized cleanly from props
const formData = reactive<PromptSchemaFormData>({
  intent: props.modelValue.intent || '',
  systemPrompt: props.modelValue.systemPrompt || '',
  userPromptTemplate: props.modelValue.userPromptTemplate || '',
  schemaFields: props.modelValue.schemaFields ? [...props.modelValue.schemaFields] : [],
});

// Keep formData in sync with incoming modelValue changes
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      formData.intent = newVal.intent || '';
      formData.systemPrompt = newVal.systemPrompt || '';
      formData.userPromptTemplate = newVal.userPromptTemplate || '';
      formData.schemaFields = newVal.schemaFields ? [...newVal.schemaFields] : [];
    }
  },
  { deep: true }
);

// Emit form updates whenever user modifies any field
watch(
  formData,
  (newVal) => {
    emit('update:modelValue', { ...newVal });
  },
  { deep: true }
);

const handleAddField = () => {
  formData.schemaFields.push({
    id: `field-${Date.now()}`,
    name: 'new_field',
    type: 'String',
    badgeText: 'Optional',
    badgeIntent: 'neutral',
  });
  emit('addField');
};

const handleRemoveField = (index: number) => {
  formData.schemaFields.splice(index, 1);
};

const handleSubmit = () => {
  emit('submit', { ...formData });
};
</script>