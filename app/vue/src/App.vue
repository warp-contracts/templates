<template>
  <div class="wrapper">
    <div class="message-form">
      <form>
        <input
          type="input"
          v-model="content"
          placeholder="Enter name"
          name="message"
          id="message"
          required
        />

        <button @click.prevent="sendContent">Add</button>
      </form>
    </div>
    <div class="content-wrapper">
      <div v-if="store.contractState" class="content">
        <div class="message" v-for="item in store.contractState" :key="item">
          <p>{{ item }}</p>
        </div>
      </div>
      <TheLoader v-else></TheLoader>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useContractStore } from '../stores/contract';
import TheLoader from './components/TheLoader.vue';

let content = ref('');
const store = useContractStore();
store.getContract();
const sendContent = async () => {
  if (content.value == '') {
    return;
  } else {
    await store.addContent(content.value);
    content.value = '';
    store.getContract();
  }
};
</script>

<style>
@import './styles/style.css';

* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
