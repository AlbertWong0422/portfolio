<template>
  <Teleport to="body">
    <dialog class="lightbox" ref="dialogEl" aria-label="图片预览" @click="onBackdropClick">
      <div class="lightbox-inner" :class="{ 'has-desc': current?.description }" @click.stop>
        <div class="lightbox-img-side">
          <img class="lightbox-img" :src="current?.img" :alt="current?.title" />
        </div>
        <div v-if="current?.description" class="lightbox-desc-side">
          <span class="lightbox-cat">{{ catLabel(current?.category) }}</span>
          <h3 class="lightbox-title">{{ current?.title }}</h3>
          <p class="lightbox-desc">{{ current?.description }}</p>
        </div>
        <div v-else class="lightbox-meta">
          <span class="lightbox-cat">{{ catLabel(current?.category) }}</span>
          <span class="lightbox-title-inline">{{ current?.title }}</span>
        </div>
      </div>
      <button class="lb-btn lb-prev" @click.stop="prev" aria-label="上一张">&#8592;</button>
      <button class="lb-btn lb-next" @click.stop="next" aria-label="下一张">&#8594;</button>
      <button class="lb-close" @click.stop="close" aria-label="关闭">&#10005;</button>
    </dialog>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  index: { type: Number, default: 0 },
  open:  { type: Boolean, default: false },
  glass: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])

const dialogEl = ref(null)
const currentIndex = ref(props.index)
const current = computed(() => props.items[currentIndex.value])

const catMap = { photo: '摄影', design: '设计', illustration: '插画', other: '其他' }
const catLabel = (c) => catMap[c] || c

watch(() => props.open, (val) => {
  currentIndex.value = props.index
  if (val) {
    dialogEl.value?.showModal()
    document.body.style.overflow = 'hidden'
  } else {
    dialogEl.value?.close()
    document.body.style.overflow = ''
  }
})

watch(() => props.index, (val) => { currentIndex.value = val })

function close() { emit('close') }
function prev() { currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length }
function next() { currentIndex.value = (currentIndex.value + 1) % props.items.length }
function onBackdropClick() { close() }

// touch swipe
let touchStartX = 0
function onTouchStart(e) { touchStartX = e.changedTouches[0].screenX }
function onTouchEnd(e) {
  const dx = e.changedTouches[0].screenX - touchStartX
  if (Math.abs(dx) > 50) dx < 0 ? next() : prev()
}

function onKeydown(e) {
  if (!props.open) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  dialogEl.value?.addEventListener('touchstart', onTouchStart, { passive: true })
  dialogEl.value?.addEventListener('touchend', onTouchEnd, { passive: true })
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.lightbox {
  position: fixed; inset: 0; width: 100%; height: 100%;
  max-width: 100%; max-height: 100%;
  border: none; padding: 0;
  background: rgba(0,0,0,.92);
  display: none; align-items: center; justify-content: center;
}
.lightbox::backdrop { background: transparent; }
.lightbox[open] { display: flex; }

.lightbox-inner {
  position: relative; max-width: 90vw; max-height: 88vh;
  display: flex; flex-direction: column; align-items: center; gap: .75rem;
}
.lightbox-inner.has-desc {
  flex-direction: row; align-items: stretch; gap: 2.5rem; max-width: 85vw;
}

.lightbox-img-side { display: flex; align-items: center; justify-content: center; }
.has-desc .lightbox-img-side { flex: 1; min-width: 0; }
.lightbox-img { max-width: 90vw; max-height: 82vh; width: auto; height: auto; border-radius: var(--radius-sm); object-fit: contain; display: block; }
.has-desc .lightbox-img { max-width: 100%; max-height: 80vh; }

.lightbox-desc-side {
  flex: 0 0 280px; display: flex; flex-direction: column; justify-content: center;
  padding: 1.5rem 0; color: rgba(255,255,255,.85);
}
.lightbox-desc-side .lightbox-cat { font-size: .62rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--accent); margin-bottom: .5rem; }
.lightbox-desc-side .lightbox-title { font-family: var(--font-serif); font-size: 1.3rem; color: #fff; font-weight: 700; margin-bottom: 1rem; }
.lightbox-desc { font-size: .9rem; line-height: 1.7; color: rgba(255,255,255,.7); }

.lightbox-meta { display: flex; gap: .75rem; align-items: center; }
.lightbox-cat { font-size: .62rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--accent); }
.lightbox-title-inline { font-size: .85rem; color: rgba(255,255,255,.7); font-weight: 500; }

.lb-btn {
  position: fixed; top: 50%; transform: translateY(-50%);
  width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,.1);
  color: #fff; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;
  border: none; cursor: pointer; transition: background .2s, transform .2s;
}
.lb-btn:hover { background: rgba(255,255,255,.2); transform: translateY(-50%) scale(1.08); }
.lb-prev { left: 1.5rem; }
.lb-next { right: 1.5rem; }

.lb-close {
  position: fixed; top: 1.5rem; right: 1.5rem;
  width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,.1);
  color: #fff; font-size: 1rem; display: flex; align-items: center; justify-content: center;
  border: none; cursor: pointer; transition: background .2s, transform .2s;
}
.lb-close:hover { background: rgba(255,255,255,.2); transform: scale(1.08); }

@media (max-width: 768px) {
  .lightbox-inner.has-desc { flex-direction: column; gap: 1rem; }
  .lightbox-desc-side { flex: none; padding: 0 1rem; }
}
@media (max-width: 480px) {
  .lb-prev { left: .75rem; }
  .lb-next { right: .75rem; }
}
</style>
