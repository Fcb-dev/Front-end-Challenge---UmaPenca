<script setup lang="ts">
import BackToTopButton from '../components/atoms/BackToTopButton/BackToTopButton.vue';
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
    <div class="header-shell">
      <ShopHeader :count="cartCount" @cart="$emit('cart')" />
    </div>
    <main id="main" tabindex="-1"><slot /></main>
    <footer class="footer">
      <div class="container-page flex flex-wrap justify-between gap-4 text-[10px] text-stone-400">
        <span
          >Bossa · Projeto demonstrativo do teste técnico
          <a
            href="https://umapenca.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="footer-source"
            >Uma Penca</a
          ></span
        >
        <span>Feito de ideias, do começo ao fim.</span>
      </div>
    </footer>
    <BackToTopButton />
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
.header-shell {
  position: sticky;
  top: 0;
  z-index: 40;
  background: #f7f3ea;
  box-shadow: 0 5px 16px #38291d0a;
}
.footer {
  background: #22211f;
  color: #f7f3ea;
  padding: 64px 0 24px;
  margin-top: 80px;
}
.footer-source {
  color: #f2c94c;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 180ms ease;
}
.footer-source:hover,
.footer-source:focus-visible {
  color: #ffe07a;
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
