<template>
<div><button @click="back">
    <span v-if="props.type===0">Back</span>
    <span v-else>To login</span>
</button></div>
<div><input type="text" placeholder="Username" v-model="username"></div>
<small><span v-if="usernameError">Invalid username! Change a name with 2 to 16 characters.</span></small>
<div><input type="password" placeholder="Password" v-model="password"></div>
<small><span v-if="passwordError">Invalid password! Change a password with 6 to 16 characters.</span></small>
<div><button @click="register">Register</button></div>    
<small><span v-if="registerError">Username already exists. Change another username.</span></small>  
</template>
    
<script setup>
import { ref } from 'vue'
import { useStats } from '@/stores/stats.js'
import { useUsers } from '@/stores/users.js'
    
const stats = useStats()
const users = useUsers()
const props = defineProps(['type'])
    
const username = ref('')
const password = ref('')
    
const usernameError = ref(false)
const passwordError = ref(false)
const registerError = ref(false)
    
function back(){
    if(props.type === 0) {stats.updateAdmin('Home')}
    else {stats.updateReader('Home')}
}
    
function register(){
    if(username.value.length < 2 || username.value.length > 16) {usernameError.value = true}
    else {usernameError.value = false}
    
    if(password.value.length < 6 || password.value.length > 16) {passwordError.value = true}
    else {passwordError.value = false}
    
    if(usernameError.value === false && passwordError.value === false){
        let isUsed = users.registerUser(username.value, password.value, 0)
    
        if(isUsed === false) {
            registerError.value = false
            back()
        }
        else {registerError.value = true}           
    }
}
</script>