<template>
<h2>Welcome, {{ reader.username }}</h2>
<h4>UserID: {{ reader.userId }}</h4>
<h4>Lent Books: 0/{{ reader.maxBook }}</h4>
<h4>Longest borrow time: {{ reader.maxTime }}days</h4>
<div><button>Edit profile</button></div>
<div><button @click="toBook">Find book</button></div>
<div><button @click="exit">Exit</button></div>
</template>

<script setup>
import { useStats } from '@/stores/stats.js'

const stats = useStats()
const reader = JSON.parse(window.localStorage.getItem('reader'))

function toBook(){
    stats.updateReader('Book')
}

function exit(){
    window.localStorage.setItem('isReaderLogin', false)
    window.localStorage.removeItem('reader')
    stats.updateReader('Login')
}
</script>