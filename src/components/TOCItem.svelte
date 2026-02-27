<script lang="ts">
  export let heading: {
    id: string;
    text: string;
    level: number;
    children?: any[];
  };
  export let depth: number = 0;
  export let activeId: string = '';
  export let scrollToHeading: (id: string) => void = () => {};

  let expanded = true;

  $: isActive = activeId === heading.id;
  $: paddingLeft = 0.5 + depth * 1.5;
  $: hasChildren = heading.children && heading.children.length > 0;

  function toggleExpanded() {
    expanded = !expanded;
  }
</script>

<div>
  <button
    class="toc-item w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm"
    class:active={isActive}
    style:padding-left={paddingLeft + 'rem'}
    on:click={() => scrollToHeading(heading.id)}
  >
    <span class="flex items-center gap-2">
      {#if hasChildren}
        <span class="cursor-pointer hover:opacity-100 transition-opacity" on:click|stopPropagation={toggleExpanded}>
          {#if expanded}
            ▼
          {:else}
            ▶
          {/if}
        </span>
      {/if}
      <span class="text-[var(--primary)] opacity-50">•</span>
      <span class="truncate">{heading.text}</span>
    </span>
  </button>
  {#if hasChildren && expanded}
    {#each heading.children as child}
      <svelte:self heading={child} depth={depth + 1} {activeId} {scrollToHeading} />
    {/each}
  {/if}
</div>

<style>
  .toc-item {
    color: var(--btn-content);
    border-left: 2px solid transparent;
  }

  .toc-item.active {
    background: linear-gradient(90deg, var(--btn-plain-bg-hover) 0%, transparent 100%);
    border-left-color: var(--primary);
    font-weight: 500;
  }
</style>
