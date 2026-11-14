---
title: 相片
published: 2024-11-24
description: 'I LOVE AHU'
image: ''
tags: [相片]
category: '生活'
draft: false
---

<div class="photo-album">

### 2024.11.29

*a happy day and thanks for someone's flower!*

![1](assets/20241129_1.jpg)
![2](assets/20241129_2.jpg)
![3](assets/20241129_3.jpg)
![4](assets/20241129_4.jpg)
![5](assets/20241129_5.jpg)

### 2024.11.13

*ahu-scenery*

![sky](assets/20241113_01.jpg)
![building](assets/20241113_02.jpg)

### 2024.10.23

*sudden impulse*

![watch](assets/20241023_01.jpg)
![watch](assets/20241023_02.jpg)

</div>

<style>
/* 相片页：摄影日记布局（选择器限定 .photo-album 容器，不影响其他文章） */
.photo-album {
  display: flex;
  flex-direction: column;
  gap: 2.75rem;
  margin-top: 1rem;
}
/* 日期小节标题：主题色竖条 + 加粗 */
.photo-album h3 {
  display: flex;
  align-items: center;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--deep-text);
  margin: 0 0 0.25rem;
}
.photo-album h3::before {
  content: "";
  width: 0.3rem;
  height: 1.15rem;
  border-radius: 999px;
  background: var(--primary);
  margin-right: 0.6rem;
}
/* 说明文字：斜体柔和 */
.photo-album p:not(:has(img)) {
  font-style: italic;
  color: rgba(0, 0, 0, 0.45);
  margin: 0 0 1rem;
}
:root.dark .photo-album p:not(:has(img)) {
  color: rgba(255, 255, 255, 0.45);
}
/* 照片网格：两列响应式，单图独占 */
.photo-album p:has(img) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}
.photo-album p:has(img:only-child) {
  grid-template-columns: minmax(0, 1fr);
}
.photo-album p:has(img) img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 4 / 3;
  border-radius: 0.85rem;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease;
}
.photo-album p:has(img) img:hover {
  transform: scale(1.025);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22);
}
</style>
