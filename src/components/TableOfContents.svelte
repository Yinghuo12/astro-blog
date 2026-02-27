<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import TOCItem from './TOCItem.svelte';
  import { setContext } from 'svelte';

  export let target: string = '.markdown-content';

  let tocContainer: HTMLElement;
  let isCollapsed = false;

  interface Heading {
    id: string;
    text: string;
    level: number;
    children?: Heading[];
  }

  let headings: Heading[] = [];
  let activeId = '';
  let observer: IntersectionObserver | null = null;

  function toggleCollapse() {
    isCollapsed = !isCollapsed;
  }

  function extractHeadings() {
    const content = document.querySelector(target);
    if (!content) return;

    const elements = content.querySelectorAll('h1, h2, h3');
    const result: Heading[] = [];
    const stack: Heading[] = [];

    elements.forEach((el) => {
      const id = el.id || `heading-${Math.random().toString(36).substr(2, 9)}`;
      if (!el.id) el.id = id;

      const level = parseInt(el.tagName.charAt(1));
      // Clean up heading text - remove all # symbols
      let text = el.textContent || '';
      text = text.replace(/#/g, '').trim(); // Remove all # symbols
      const heading: Heading = { id, text, level };

      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length > 0) {
        if (!stack[stack.length - 1].children) {
          stack[stack.length - 1].children = [];
        }
        stack[stack.length - 1].children!.push(heading);
      } else {
        result.push(heading);
      }

      stack.push(heading);
    });

    headings = result;
  }

  function scrollToHeading(id: string) {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  function setupObserver() {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
          }
        });
      },
      {
        rootMargin: '-100px 0px -80% 0px',
        threshold: 0
      }
    );

    const content = document.querySelector(target);
    if (!content) return;

    content.querySelectorAll('h1, h2, h3, h4').forEach((heading) => {
      observer?.observe(heading);
    });
  }

  onMount(() => {
    // Move TOC to body to escape layout constraints
    if (tocContainer && tocContainer.parentElement !== document.body) {
      document.body.appendChild(tocContainer);
    }

    console.log('=== TableOfContents mounted ===');
    console.log('Target selector:', target);

    // Multiple attempts to ensure content is loaded
    const tryExtract = () => {
      const content = document.querySelector(target);
      console.log('TableOfContents: Looking for', target, 'found:', !!content);
      if (content) {
        const elements = content.querySelectorAll('h1, h2, h3');
        console.log('TableOfContents: Found elements in content:', elements.length);
      }
      extractHeadings();
      console.log('TableOfContents: Extracted headings:', headings.length);
      setupObserver();
      if (headings.length === 0) {
        console.log('TableOfContents: No headings found, retrying...');
        setTimeout(tryExtract, 500);
      } else {
        console.log('TableOfContents: Found', headings.length, 'headings:', headings);
      }
    };

    setTimeout(tryExtract, 200);

    document.addEventListener('astro:after-swap', () => {
      setTimeout(tryExtract, 200);
    });

  });

  onDestroy(() => {
    if (observer) {
      observer.disconnect();
    }
    // Remove from body if it was moved there
    if (tocContainer && tocContainer.parentElement === document.body) {
      tocContainer.remove();
    }
  });
</script>

<div class="toc-container hidden lg:block" style="position: fixed; right: 2rem; top: 50%; transform: translateY(-50%); width: {isCollapsed ? '3rem' : '14rem'}; z-index: 50; transition: width 0.3s ease;" bind:this={tocContainer}>
  <div class="card-base p-3 rounded-xl relative overflow-hidden" style="transition: all 0.3s ease;">
    <!-- Toggle Button -->
    <button
      on:click={toggleCollapse}
      class="absolute top-2 {isCollapsed ? 'left-1/2 -translate-x-1/2' : 'right-2'} transition-all duration-300 text-[var(--primary)] hover:opacity-70 p-1 rounded"
      style="transition: all 0.3s ease;"
    >
      {#if isCollapsed}
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z"/>
        </svg>
      {/if}
    </button>

    {#if !isCollapsed}
      <div class="toc-title text-sm font-bold mb-3 px-3 text-[var(--primary)]" style="transition: opacity 0.2s ease;">
        目录
      </div>
      <div class="toc-list space-y-1 max-h-[70vh] overflow-y-auto pr-2" style="transition: opacity 0.2s ease;">
        {#if headings.length > 0}
          {#each headings as heading}
            <TOCItem {heading} depth={0} {activeId} {scrollToHeading} />
          {/each}
        {:else}
          <div class="px-3 py-2 text-sm text-black/50 dark:text:white/50">
            暂无目录
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .toc-container {
    /* Fixed positioning on right edge */
  }

  .toc-list::-webkit-scrollbar {
    width: 4px;
  }

  .toc-list::-webkit-scrollbar-track {
    background: transparent;
  }

  .toc-list::-webkit-scrollbar-thumb {
    background: var(--scrollbar-bg);
    border-radius: 2px;
  }

  .toc-list::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-bg-hover);
  }
</style>
