<template>
  <VBox tag="section" full-height class="flex flex-col">

    <VBox padding="lg" background="gray-50" rounded="2xl" border="all" class="mb-6 shadow-sm">
      <VStack gap="md">
        <VCluster gap="sm" align="center">
          <VBox padding="xs" background="indigo-50" rounded="lg" class="text-indigo-600">
            <VIcon name="ArrowsPointingIn" size="xs" />
          </VBox>
          <VTypography tag="span" size="sm" weight="bold" color="gray-800">
            Define Research Boundary
          </VTypography>
        </VCluster>

        <VStack gap="sm">
          <VInput
            v-model="newScopeText"
            placeholder="e.g., Only English publications, Post-2010 studies..."
            class="w-full bg-white"
            @keyup.enter="addScope"
          />

          <VCluster justify="between" align="center">
            <VBox background="gray-50" padding="xs" rounded="xl" class="flex gap-1">
              <VButton
                v-for="type in (['INCLUSION', 'EXCLUSION'] as const)"
                :key="type"
                size="xs"
                :variant="activeType === type ? 'primary' : 'tertiary'"
                :class="[
                  'px-5 py-1.5 !rounded-lg transition-all duration-300',
                  activeType === type
                    ? (type === 'INCLUSION' ? '!bg-emerald-600 !shadow-md' : '!bg-rose-600 !shadow-md')
                    : 'text-gray-500'
                ]"
                @click="activeType = type"
              >
                {{ type }}
              </VButton>
            </VBox>

            <VButton
              variant="primary"
              :disabled="!newScopeText.trim()"
              @click="addScope"
            >
              Add to Scope
            </VButton>
          </VCluster>
        </VStack>
      </VStack>
    </VBox>

    <VBox class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 min-h-0 overflow-hidden">

      <VStack gap="md" class="min-h-0">
        <VCluster justify="between" align="center" padding="xs">
          <VCluster gap="xs" align="center">
            <VBox rounded="full" class="w-2 h-2 bg-emerald-500" />
            <VTypography tag="h4" size="sm" weight="bold" color="emerald-900">Inclusions</VTypography>
          </VCluster>
          <VBadge variant="emerald" size="xs">{{ inclusions.length }}</VBadge>
        </VCluster>

        <VBox overflow-y-auto class="flex-1 pr-1 stable-gutter">
          <VStack v-if="inclusions.length > 0" gap="sm">
            <VBox
              v-for="item in inclusions"
              :key="item.id"
              padding="md"
              background="emerald-50"
              rounded="xl"
              border="all"
              class="border-emerald-100 group hover:border-emerald-300 transition-all"
            >
              <VCluster justify="between" align="start" no-wrap>
                <VTypography size="xs" color="emerald-950" class="leading-relaxed">
                  {{ item.label }}
                </VTypography>
                <VButton
                  variant="danger"
                  size="xs"
                  icon-name="XMark"
                  icon-only
                  class="opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1"
                  @click="removeScope(item.id)"
                />
              </VCluster>
            </VBox>
          </VStack>
          <VEmptyState v-else title="No inclusions" size="sm" class="h-32 opacity-60" />
        </VBox>
      </VStack>

      <VStack gap="md" class="min-h-0">
        <VCluster justify="between" align="center" padding="xs">
          <VCluster gap="xs" align="center">
            <VBox rounded="full" class="w-2 h-2 bg-rose-500" />
            <VTypography tag="h4" size="sm" weight="bold" color="rose-900">Exclusions</VTypography>
          </VCluster>
          <VBadge variant="red" size="xs">{{ exclusions.length }}</VBadge>
        </VCluster>

        <VBox overflow-y-auto class="flex-1 pr-1 stable-gutter">
          <VStack v-if="exclusions.length > 0" gap="sm">
            <VBox
              v-for="item in exclusions"
              :key="item.id"
              padding="md"
              background="rose-50"
              rounded="xl"
              border="all"
              class="border-rose-100 group hover:border-rose-300 transition-all"
            >
              <VCluster justify="between" align="start" no-wrap>
                <VTypography size="xs" color="rose-950" class="leading-relaxed">
                  {{ item.label }}
                </VTypography>
                <VButton
                  variant="danger"
                  size="xs"
                  icon-name="XMark"
                  icon-only
                  class="opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1"
                  @click="removeScope(item.id)"
                />
              </VCluster>
            </VBox>
          </VStack>
          <VEmptyState v-else title="No exclusions" size="sm" class="h-32 opacity-60" />
        </VBox>
      </VStack>
    </VBox>

    <VBox padding="md" border="top" class="mt-6">
      <VCluster justify="end" gap="md">
        <VButton variant="tertiary" @click="$emit('cancel')">Cancel</VButton>
        <VButton variant="primary" @click="handleSave">Save Scope Changes</VButton>
      </VCluster>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ProcessedScope } from '@/interfaces/initiation';

// Atoms
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VInput from '@/components/atoms/forms/VInput.vue';
import VBadge from '@/components/atoms/indicators/VBadge.vue';

// Molecules
import VEmptyState from '@/components/molecules/indicators/VEmptyState.vue';

const props = defineProps<{
  initialValue: ProcessedScope[];
}>();

const emit = defineEmits<{
  (e: 'save', value: ProcessedScope[]): void;
  (e: 'cancel'): void;
}>();

// --- STATE ---
const localScope = ref<ProcessedScope[]>([...props.initialValue]);
const newScopeText = ref('');
const activeType = ref<'INCLUSION' | 'EXCLUSION'>('INCLUSION');

// --- COMPUTED ---
const inclusions = computed(() => localScope.value.filter(s => s.boundaryType === 'INCLUSION'));
const exclusions = computed(() => localScope.value.filter(s => s.boundaryType === 'EXCLUSION'));

// --- METHODS ---
function addScope() {
  const text = newScopeText.value.trim();
  if (!text) return;

  if (localScope.value.some(s => s.label.toLowerCase() === text.toLowerCase())) {
    newScopeText.value = '';
    return;
  }

  localScope.value.unshift({
    id: `scope-${Date.now()}`,
    label: text,
    boundaryType: activeType.value,
    entityStatus: 'USER_DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  newScopeText.value = '';
}

function removeScope(id: string) {
  localScope.value = localScope.value.filter(s => s.id !== id);
}

function handleSave() {
  emit('save', localScope.value);
}
</script>