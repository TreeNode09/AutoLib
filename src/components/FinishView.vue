<template>
<h2>Finish!</h2>
<div>
    <button @click="toHome">Exit to home</button>
    <button @click="toBorrow">Back to borrow/return</button>
</div>
</template>

<script setup>
import { useStats } from '@/stores/stats.js'

const stats = useStats()

function toHome(){
    window.localStorage.setItem('reader', '')
    stats.updateReader('Home')
}

function toBorrow(){
    stats.updateReader('Borrow')
}
</script>