<template>
  <VCard
    padding="md"
    rounded="lg"
    border="all"
    intent="neutral"
    surface="base"
    class="w-full transition-all duration-200"
  >
    <VStack gap="md" align="stretch">
      <!-- ========================================== -->
      <!-- LAYER 1: Alignment & Scope                 -->
      <!-- ========================================== -->
      <VStack gap="sm" align="stretch">
        <!-- Meta Info Bar: ID, Domain, Impact Level & Actions -->
        <VCluster justify="between" align="center" fullWidth wrap gap="xs">
          <VCluster gap="xs" align="center">
            <!-- Formatted Chunk ID (Truncated for UUIDs/Hashes) -->
            <VBadge
              attention="tertiary"
              size="xs"
              class="font-mono cursor-help"
              :title="`Full ID: ${chunk.id}`"
            >
              #{{ formattedChunkId }}
            </VBadge>

            <!-- Domain -->
            <VBadge v-if="chunk.alignment.scope.domain" intent="brand" surface="soft" size="xs">
              {{ chunk.alignment.scope.domain }}
            </VBadge>

            <!-- Impact Level -->
            <VBadge
              v-if="chunk.alignment.scope.impactLevel"
              :attention="chunk.alignment.scope.impactLevel === 'strategic' ? 'primary' : 'tertiary'"
              surface="soft"
              size="xs"
              class="capitalize"
            >
              {{ chunk.alignment.scope.impactLevel }}
            </VBadge>
          </VCluster>

          <!-- Actions -->
          <VButton
            iconName="EllipsisHorizontal"
            iconOnly
            size="xs"
            attention="tertiary"
            title="More Options"
          />
        </VCluster>

        <!-- Target Question -->
        <VTypography
          tag="h4"
          size="md"
          weight="bold"
        >
          {{ chunk.alignment.targetQuestion }}
        </VTypography>

        <!-- Scope Boundaries (Hard Constraints) -->
        <VBoundaryBadge
          v-if="chunk.alignment.scope.boundaries?.length"
          :boundaries="chunk.alignment.scope.boundaries"
        />
      </VStack>

      <!-- ========================================== -->
      <!-- LAYER 2: Abstract Concept                  -->
      <!-- ========================================== -->
      <VConceptBlock
        v-if="chunk.concept"
        :title="chunk.concept.title"
        :description="chunk.concept.description"
      />

      <!-- ========================================== -->
      <!-- LAYER 3: Token & Entity-Relation Layer     -->
      <!-- ========================================== -->
      <VStack
        v-if="chunk.keywords?.triples?.length || chunk.keywords?.tags?.length"
        gap="xs"
        align="stretch"
      >
        <VCluster justify="between" align="center" fullWidth gap="xs">
          <VTypography
            tag="span"
            size="xs"
            weight="semibold"
            class="uppercase tracking-wider"
          >
            Context Anchor
          </VTypography>

          <!-- Domain Tags -->
          <VCluster v-if="chunk.keywords.tags?.length" gap="xs" align="center">
            <VBadge
              v-for="tag in chunk.keywords.tags"
              :key="tag"
              attention="tertiary"
              size="xs"
              class="lowercase opacity-80"
            >
              #{{ tag }}
            </VBadge>
          </VCluster>
        </VCluster>

        <!-- Triples Pills List -->
        <VCluster gap="none" align="center" wrap>
          <VBoundTripleBadge
            v-for="(triple, index) in visibleTriples"
            :key="index"
            :subject="triple.subject"
            :predicate="triple.predicate"
            :object="triple.object"
          />

          <!-- Triple Limit Collapse Toggle -->
          <VButton
            v-if="chunk.keywords.triples.length > tripleLimit"
            size="xs"
            attention="tertiary"
            class="font-medium "
            @click="isExpanded = !isExpanded"
          >
            {{ isExpanded ? 'Collapse ▲' : `+ ${chunk.keywords.triples.length - tripleLimit} more...` }}
          </VButton>
        </VCluster>
      </VStack>

      <!-- ========================================== -->
      <!-- LAYER 4: Fact & Evidence Layer             -->
      <!-- ========================================== -->
      <VEvidenceBlock
        v-if="chunk.evidence"
        :location="chunk.evidence.location"
        :text="chunk.evidence.excerptText"
      />
    </VStack>
  </VCard>
</template>

<script setup lang="ts">
/**
 * RepositoryChunkCard Organism
 * Renders a complete 4-Layer Chunk Entity compliant with repository.ts schema.
 * Truncates long UUIDs/Hashes for clean card presentation.
 */
import { ref, computed } from 'vue';

// Design System Components
import VCard from '@auraflux/design-system/components/molecules/resources/VCard.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';

// Sub Molecules
import VBoundaryBadge from '@/components/molecules/indicators/VBoundaryBadge.vue';
import VConceptBlock from '@/components/molecules/indicators/VConceptBlock.vue';
import VBoundTripleBadge from '@/components/molecules/indicators/VBoundTripleBadge.vue';
import VEvidenceBlock from '@/components/molecules/indicators/VEvidenceBlock.vue';

import type { ChunkData } from '@/interfaces/repository';

export interface RepositoryChunkCardProps {
  /** Unified ChunkData from repository.ts */
  chunk: ChunkData;
  /** Triple collapse threshold */
  tripleLimit?: number;
}

const props = withDefaults(defineProps<RepositoryChunkCardProps>(), {
  tripleLimit: 3,
});

// ID formatting logic: Truncate long UUIDs or random hash strings to 8 characters
const formattedChunkId = computed(() => {
  const idStr = String(props.chunk.id || '');
  if (idStr.length > 10) {
    return idStr.slice(0, 8);
  }
  return idStr;
});

// Triple collapse toggle logic
const isExpanded = ref(false);

const visibleTriples = computed(() => {
  const triples = props.chunk.keywords?.triples || [];
  if (isExpanded.value || triples.length <= props.tripleLimit) {
    return triples;
  }
  return triples.slice(0, props.tripleLimit);
});
</script>