import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUsers = defineStore('users', () => {
    const users = ref([
        {userId: 0, username: 'Admin', password: 'password', type: 0},
        {userId: 1, username: 'Alex', password: 'password', type: 1, maxBook: 2, maxTime: 30},
        {userId: 2, username: 'Ben', password: 'password', type: 1, maxBook: 2, maxTime: 30},
        {userId: 3, username: 'Carl', password: 'password', type: 1, maxBook: 2, maxTime: 30}
    ])

    const nextId = ref(4)

    function registerUser(username, password, type){
        let isUsed = false

        for(let i = 0; i < users.value.length; i++){
            if(users.value[i].username === username){
                isUsed = true
                break
            }
        }

        if(isUsed === false){
            if(type === 0){
                users.value.push({userId: nextId.value, username: username, password: password, type: type, maxBook: 2, maxTime: 30})
            }
            if(type === 1){
                users.value.push({userId: nextId.value, username: username, password: password, type: type})
            }
            nextId.value++
        }

        return isUsed
    }

    function loginUser(username, password, type){        
        for(let i = 0; i < users.value.length; i++){
            if(users.value[i].type === type && users.value[i].username === username && users.value[i].password === password){
                return users.value[i]
            }
        }
        
        return null
    }

    return{users, registerUser, loginUser}
})