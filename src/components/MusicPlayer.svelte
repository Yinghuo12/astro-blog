<script lang="ts">
import Icon from '@iconify/svelte'
import { onMount } from 'svelte'

export interface MusicTrack {
  name: string
  artist: string
  src: string
  lrc: string
}
export let playlist: MusicTrack[] = []

let audio: HTMLAudioElement | null = null
let currentIndex = 0
let playing = false
let panelOpen = false
let currentTime = 0
let duration = 0
let loadError = ''

interface LyricLine {
  time: number
  text: string
}
let lyrics: LyricLine[] = []
let activeIndex = -1
let lyricListEl: HTMLElement | undefined

function parseLrc(lrc: string): LyricLine[] {
  const lines: LyricLine[] = []
  for (const raw of lrc.split('\n')) {
    const matches = [...raw.matchAll(/\[(\d+):(\d+)(?:\.(\d+))?\]/g)]
    const text = raw.replace(/\[[^\]]*\]/g, '').trim()
    for (const m of matches) {
      const time =
        parseInt(m[1]) * 60 + parseInt(m[2]) + (m[3] ? parseInt(m[3].padEnd(3, '0')) / 1000 : 0)
      if (text) lines.push({ time, text })
    }
  }
  return lines.sort((a, b) => a.time - b.time)
}

function loadTrack(i: number, autoplay = true) {
  if (!audio || playlist.length === 0) return
  currentIndex = (i + playlist.length) % playlist.length
  const track = playlist[currentIndex]
  lyrics = parseLrc(track.lrc)
  activeIndex = -1
  loadError = ''
  currentTime = 0
  duration = 0
  audio.src = track.src
  if (autoplay) {
    play()
  }
}

function play() {
  audio?.play().catch(() => {
    loadError = `无法播放：请将音频文件放入 public/music/（${playlist[currentIndex]?.src}）`
    playing = false
  })
}

function togglePlay() {
  if (!audio) return
  if (playing) {
    audio.pause()
  } else {
    play()
  }
}

function onTimeUpdate() {
  if (!audio) return
  currentTime = audio.currentTime
  let idx = -1
  for (let i = 0; i < lyrics.length; i++) {
    if (lyrics[i].time <= currentTime) idx = i
    else break
  }
  if (idx !== activeIndex) {
    activeIndex = idx
    // 当前行滚动到歌词可视区中部
    const active = lyricListEl?.children[idx] as HTMLElement | undefined
    active?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }
}

function seek(e: Event) {
  if (!audio) return
  const value = parseFloat((e.target as HTMLInputElement).value)
  if (!Number.isNaN(value) && Number.isFinite(duration) && duration > 0) {
    audio.currentTime = value
  }
}

function fmt(t: number): string {
  if (!Number.isFinite(t)) return '00:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

onMount(() => {
  audio = new Audio()
  audio.preload = 'metadata'
  audio.volume = 0.8
  audio.addEventListener('timeupdate', onTimeUpdate)
  audio.addEventListener('play', () => (playing = true))
  audio.addEventListener('pause', () => (playing = false))
  audio.addEventListener('ended', () => loadTrack(currentIndex + 1))
  audio.addEventListener('loadedmetadata', () => {
    if (audio) duration = audio.duration
  })
  audio.addEventListener('error', () => {
    loadError = `音频加载失败：请将文件放入 public/music/（${playlist[currentIndex]?.src}）`
    playing = false
  })
  if (playlist.length > 0) {
    loadTrack(0, false)
  }
  return () => {
    audio?.pause()
  }
})
</script>

<div class="music-player fixed left-4 bottom-4 z-40 print:hidden">
  <!-- 展开的面板 -->
  <div class="card-base absolute bottom-16 left-0 w-80 p-4 transition-all duration-300 shadow-xl rounded-[var(--radius-large)]"
       class:opacity-0={!panelOpen} class:pointer-events-none={!panelOpen}
       class:translate-y-2={!panelOpen} class:invisible={!panelOpen}>
    {#if playlist.length > 0}
      <div class="flex items-center gap-3 mb-3">
        <!-- 旋转唱片 -->
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[oklch(0.75_0.14_var(--hue))] to-[oklch(0.55_0.12_var(--hue))] flex items-center justify-center shadow-inner shrink-0 {playing ? 'disc-spinning' : ''}">
          <Icon icon="material-symbols:music-note-rounded" class="text-white text-[1.4rem]"></Icon>
        </div>
        <div class="min-w-0">
          <div class="font-bold truncate text-90 transition">{playlist[currentIndex].name}</div>
          <div class="text-sm text-black/50 dark:text-white/50 truncate transition">{playlist[currentIndex].artist}</div>
        </div>
      </div>

      <!-- 进度 -->
      <div class="flex items-center gap-2 text-xs text-black/50 dark:text-white/50 transition mb-1">
        <span class="w-10 text-left">{fmt(currentTime)}</span>
        <input type="range" min="0" max={duration || 0} step="0.1" value={currentTime}
               on:input={seek} class="music-progress flex-1" aria-label="播放进度" />
        <span class="w-10 text-right">{fmt(duration)}</span>
      </div>

      {#if loadError}
        <div class="text-xs text-red-400 mb-2">{loadError}</div>
      {/if}

      <!-- 控制 -->
      <div class="flex items-center justify-center gap-2 mb-3">
        <button class="btn-plain scale-animation rounded-lg h-9 w-9 active:scale-90" on:click={() => loadTrack(currentIndex - 1)} aria-label="上一首">
          <Icon icon="material-symbols:skip-previous-rounded" class="text-[1.4rem]"></Icon>
        </button>
        <button class="btn-regular rounded-lg h-11 w-11 active:scale-90" on:click={togglePlay} aria-label="播放/暂停">
          <Icon icon={playing ? 'material-symbols:pause-rounded' : 'material-symbols:play-arrow-rounded'} class="text-[1.8rem]"></Icon>
        </button>
        <button class="btn-plain scale-animation rounded-lg h-9 w-9 active:scale-90" on:click={() => loadTrack(currentIndex + 1)} aria-label="下一首">
          <Icon icon="material-symbols:skip-next-rounded" class="text-[1.4rem]"></Icon>
        </button>
      </div>

      <!-- 歌词 -->
      <div class="border-t border-black/10 dark:border-white/10 transition pt-2">
        <div class="text-xs font-bold text-black/40 dark:text-white/40 transition mb-1">歌词</div>
        <div class="lyrics h-36 overflow-y-auto pr-1 text-sm leading-7" bind:this={lyricListEl}>
          {#if lyrics.length > 0}
            {#each lyrics as line, i}
              <div class="text-center transition-all duration-300 {i === activeIndex ? 'text-[var(--primary)] font-bold scale-105' : 'text-black/40 dark:text-white/40'}">
                {line.text}
              </div>
            {/each}
          {:else}
            <div class="text-center text-black/30 dark:text-white/30">（纯音乐 / 暂无歌词）</div>
          {/if}
        </div>
      </div>

      <!-- 歌单 -->
      <div class="border-t border-black/10 dark:border-white/10 transition pt-2 mt-2">
        <div class="text-xs font-bold text-black/40 dark:text-white/40 transition mb-1">歌单</div>
        {#each playlist as track, i}
          <button class="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm transition text-75
                         hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] {i === currentIndex ? 'text-[var(--primary)] font-bold' : ''}"
                  on:click={() => loadTrack(i)}>
            <span class="truncate">{track.name} - {track.artist}</span>
            {#if i === currentIndex && playing}
              <Icon icon="material-symbols:graphic-eq-rounded" class="text-[var(--primary)] text-base"></Icon>
            {/if}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <!-- 悬浮按钮 -->
  <button class="btn-regular rounded-full h-12 w-12 shadow-lg active:scale-90 transition {playing ? 'disc-spinning' : ''}"
          on:click={() => (panelOpen = !panelOpen)}
          aria-label="音乐播放器">
    <Icon icon="material-symbols:music-note-rounded" class="text-[1.5rem] text-[var(--btn-content)]"></Icon>
  </button>
</div>

<style>
/* 歌词区隐藏滚动条，保留滚动能力（当前行自动滚动仍生效） */
.lyrics {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.lyrics::-webkit-scrollbar {
  display: none;
}
.disc-spinning {
  animation: disc-rotate 6s linear infinite;
}
@keyframes disc-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.music-progress {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 999px;
  background: var(--btn-plain-bg-hover);
  outline: none;
}
.music-progress::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
}
.music-progress::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border: none;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
}
</style>
