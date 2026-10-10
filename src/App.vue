<script setup lang="ts">
import ShopTemplate from './templates/ShopTemplate.vue';
import { onMounted } from 'vue';
import { useCart } from './composables/useCart';
import CartDrawer from './components/organisms/CartDrawer/CartDrawer.vue';
const cart = useCart();
const { rows, count, total } = cart;
onMounted(cart.hydrate);
</script>
<template>
  <ShopTemplate :cart-count="count" @cart="cart.state.open = true">
    <router-view />
    <template #overlay
      ><CartDrawer
        :open="cart.state.open"
        :items="rows"
        :total="total"
        :loading="cart.state.loading"
        :error="cart.state.error"
        :notice="cart.state.notice"
        @close="cart.state.open = false"
        @quantity="cart.update"
        @remove="cart.remove"
        @retry="cart.hydrate"
    /></template>
  </ShopTemplate>
</template>
