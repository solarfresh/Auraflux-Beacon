import { ref, computed, unref, type MaybeRef } from 'vue';
import type { LinkItem } from '@auraflux/design-system/interfaces/navs';

export interface UseWorkspaceBarOptions<T extends LinkItem> {
  tools: MaybeRef<T[]>;
  defaultActiveId?: string;
  onSelect?: (tool: T) => void;
}

export function useWorkspaceBar<T extends LinkItem>(options: UseWorkspaceBarOptions<T>) {
  const { onSelect } = options;

  const activeId = ref<string>(options.defaultActiveId || unref(options.tools)[0]?.id || '');

  const activeTool = computed(() => {
    const list = unref(options.tools);
    return list.find(t => t.id === activeId.value) || list[0];
  });

  const activeIndex = computed(() => {
    const list = unref(options.tools);
    return list.findIndex(t => t.id === activeId.value);
  });

  const selectTool = (tool: LinkItem) => {
    activeId.value = tool.id;
    if (onSelect) {
      onSelect(tool as T);
    }
  };

  const cycleTool = (direction: number) => {
    const list = unref(options.tools);
    if (!list.length) return;

    let nextIndex = activeIndex.value + direction;
    if (nextIndex >= list.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = list.length - 1;

    selectTool(list[nextIndex]);
  };

  return {
    activeId,
    activeTool,
    selectTool,
    nextTool: () => cycleTool(1),
    prevTool: () => cycleTool(-1),
  };
}