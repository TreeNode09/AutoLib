<template>
<div><button @click="toRegister">Register</button></div>
<div><button @click="toLogin">Borrow book/Return book</button></div>
<div><button @click="toBook">Find book</button></div>
</template>

<script setup>
import { useStats } from '@/stores/stats.js'

const stats = useStats()

function toRegister(){
    stats.updateReader('Register')
}

function toLogin(){
    stats.updateReader('Login')
}

function toBook(){
    stats.updateReader('Book')
}
</script>