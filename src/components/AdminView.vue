<template>
<div class="out">
    <h1>ADMIN</h1>
    <h2>{{ stats.adminStat }}</h2>
    <register v-if="stats.adminStat==='Register'" :type="0"></register>
    <login v-if="stats.adminStat==='Login'" :type="0"></login>
    <book v-if="stats.adminStat==='Book'" :type="0"></book>

    <home v-if="stats.adminStat==='Home'"></home>
</div>
</template>
    
<script setup>
import { useStats } from '@/stores/stats.js'
    
import register from '@/components/RegisterView.vue'
import login from '@/components/LoginView.vue'
import book from '@/components/BookView.vue'

import home from '@/components/AdminHome.vue' 
   
const stats = useStats()
</script>
    
 <style scoped>
.out
{
    width: 55vw;
    margin: 10px 5px 10px 10px;
}
</style>