<template>
  <VBox
    tag="section"
    surface="solid"
    intent="neutral"
    padding="none"
    class="flex flex-col h-full shadow-md"
  >
    <!-- Section Header Bar -->
    <VBox
      padding="none"
      border="bottom"
      surface="solid"
      class="shrink-0 pt-6 px-6"
    >
      <VSectionHeader
        title="Agent Capabilities"
        icon="Sliders"
        size="md"
        weight="bold"
      />
    </VBox>

    <!-- Scrollable Form Body -->
    <VBox class="flex-1 p-6">
      <VForm gap="lg" @submit="handleSubmit">
        <!-- Core Intent -->
        <VFormField label="Core Design Intent">
          <template #default="{ id }">
            <VInput
              :id="id"
              v-model="formData.purpose"
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
          <template #hint>
            <VCluster gap="xs" align="center">
              <VCode size="xs">{{ '\{\{' }}</VCode>
              <VTypography size="xs" attention="tertiary">Vars</VTypography>
            </VCluster>
          </template>
          <template #default="{ id }">
            <VTextarea
              :id="id"
              v-model="formData.promptTemplate"
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
import { reactive, watch } from 'vue';

import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VTextarea from '@auraflux/design-system/components/atoms/forms/VTextarea.vue';
import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VCode from '@auraflux/design-system/components/atoms/indicators/VCode.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VForm from '@auraflux/design-system/components/molecules/forms/VForm.vue';
import VFormField from '@auraflux/design-system/components/molecules/forms/VFormField.vue';
import VEmptyState from '@auraflux/design-system/components/molecules/indicators/VEmptyState.vue';
import VSchemaItem from '@auraflux/design-system/components/molecules/indicators/VSchemaItem.vue';
import VSectionHeader from '@auraflux/design-system/components/molecules/indicators/VSectionHeader.vue';

import type { PromptSchemaFormData } from '@auraflux/design-system/interfaces/agents';

const formData = defineModel<PromptSchemaFormData>({
  default: () => ({
    purpose: '',
    systemPrompt: '',
    promptTemplate: '',
    schemaFields: [],
  }),
});

const emit = defineEmits<{
  (e: 'submit', value: PromptSchemaFormData): void;
}>();

const handleAddField = () => {
  if (!formData.value.schemaFields) {
    formData.value.schemaFields = [];
  }

  formData.value.schemaFields.push({
    id: `field-${Date.now()}`,
    name: 'new_field',
    type: 'String',
    badgeText: 'Optional',
    badgeIntent: 'neutral',
  });
};

const handleRemoveField = (index: number) => {
  formData.value.schemaFields.splice(index, 1);
};

const handleSubmit = () => {
  emit('submit', { ...formData.value });
};
</script>