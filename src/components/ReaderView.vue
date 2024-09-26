<template>
<div class="out">
    <h1>READER</h1>
    <h2>{{ stats.readerStat }}</h2>
    <register v-if="stats.readerStat==='Register'" :type="1"></register>
    <login v-if="stats.readerStat==='Login'" :type="1"></login>
    <book v-if="stats.readerStat==='Book'" :type="1"></book>
    
    <home v-if="stats.readerStat==='Home'"></home>
</div>
</template>

<script setup>
import { ref } from 'vue'
import { useStats } from '@/stores/stats.js'

import register from '@/components/RegisterView.vue'
import login from '@/components/LoginView.vue'
import book from '@/components/BookView.vue'

import home from '@/components/ReaderHome.vue'

const stats = useStats()

const type = ref(1)
</script>

<style scoped>
.out
{
    width: 40vw;
    margin: 10px 5px 10px 10px;
}
</style>