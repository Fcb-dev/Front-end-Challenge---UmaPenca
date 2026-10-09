<script setup lang="ts">
import ShopHeader from '../components/organisms/ShopHeader/ShopHeader.vue';
defineProps<{ cartCount?: number }>();
defineEmits<{ (event: 'cart'): void }>();
</script>
<template>
  <div>
    <a class="skip-link" href="#main">Pular para o conteúdo</a>
    <div class="top-note">
      PEQUENOS CRIADORES. GRANDES IDEIAS. <span aria-hidden="true">✳</span> ENCONTRE A SUA.
    </div>
    <ShopHeader :count="cartCount" @cart="$emit('cart')" />
    <main id="main" tabindex="-1"><slot /></main>
    <footer id="manifesto" class="footer">
      <div class="container-page flex flex-col justify-between gap-10 md:flex-row">
        <div>
          <p class="eyebrow mb-4">Nosso olhar</p>
          <p class="max-w-xl font-display text-4xl leading-tight">
            O que você veste também<br />conta uma história.
          </p>
        </div>
        <div class="max-w-sm">
          <p class="text-sm leading-7 text-stone-300">
            Um encontro entre ideias independentes e coisas do dia a dia. Uma seleção de criadores
            da Uma Penca, para encontrar o que tem a ver com você.
          </p>
          <a
            href="https://umapenca.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-6 inline-block text-xs underline underline-offset-4"
            >Conheça a Uma Penca ↗</a
          >
        </div>
      </div>
      <div
        class="container-page mt-12 flex flex-wrap justify-between gap-4 border-t border-white/20 pt-6 text-[10px] text-stone-400"
      >
        <span>Penca · Projeto demonstrativo do teste técnico</span
        ><span>Feito de ideias, do começo ao fim.</span>
      </div>
    </footer>
    <slot name="overlay" />
  </div>
</template>
<style scoped>
.top-note {
  text-align: center;
  padding: 10px 12px;
  background: #22211f;
  color: #f7f3ea;
  font-size: 9px;
  letter-spacing: 0.13em;
}
.top-note span {
  padding: 0 12px;
  color: #edaabd;
}
.footer {
  background: #22211f;
  color: #f7f3ea;
  padding: 64px 0 24px;
  margin-top: 80px;
}
.skip-link {
  position: fixed;
  z-index: 100;
  top: -80px;
  left: 16px;
  background: #22211f;
  color: white;
  padding: 12px;
}
.skip-link:focus {
  top: 8px;
}
</style>
