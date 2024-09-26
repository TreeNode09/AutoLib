<template>
<div><button @click="toBook">Manage book</button></div>
<div><button>Manage reader</button></div>
<div><button @click="exit">Exit</button></div>
</template>

<script setup>
import { useStats } from '@/stores/stats.js'

const stats = useStats()

const admin = JSON.parse(window.localStorage.getItem('admin'))

function toBook(){
    stats.updateAdmin('Book')
}

function exit(){
    window.localStorage.setItem('isAdminLogin', false)
    window.localStorage.removeItem('admin')
    stats.updateAdmin('Login')
}
</script>