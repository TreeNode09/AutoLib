<template>
<div v-if="props.type===1"><button @click="toHome">Back</button></div>
<div><input type="text" placeholder="Username" v-model="username"></div>
<small><span v-if="usernameError">Please enter your username.</span></small>
<div><input type="password" placeholder="Password" v-model="password"></div>
<small><span v-if="passwordError">Please enter your password.</span></small>
<div><button @click="login">Login</button></div>    
<small><span v-if="loginError">Wrong username or password. Try again.</span></small> 
</template>
    
<script setup>
import { ref } from 'vue'
import { useStats } from '@/stores/stats.js'
import { useUsers } from '@/stores/users.js'
    
const stats = useStats()
const users = useUsers()
    
const username = ref('')
const password = ref('')
const props = defineProps(['type'])
    
const usernameError = ref(false)
const passwordError = ref(false)
const loginError = ref(false)

function toHome(){
    stats.updateReader('Home')
}
    
function login(){
    if(username.value === '') {usernameError.value = true}
    else {usernameError.value = false}
    
    if(password.value === '') {passwordError.value = true}
    else {passwordError.value = false}
    
    if(usernameError.value === false && passwordError.value === false){
        let result = users.loginUser(username.value, password.value, props.type)
        if(result !== null){
            loginError.value = false
            if(props.type === 0){
                window.localStorage.setItem('admin', JSON.stringify(result))
                window.localStorage.setItem('isAdminLogin', true)
            }
            else{
                window.localStorage.setItem('reader', JSON.stringify(result))
            }
            if(props.type === 0) {stats.updateAdmin('Home')}
            else {stats.updateReader('Borrow')}
        }
        else {loginError.value = true}
    }
}
</script>
    
    