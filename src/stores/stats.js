import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStats = defineStore('stats', () => {
    const adminStat = ref('Login')
    const readerStat = ref('Home')
    

    function updateAdmin(newStat){
        adminStat.value = newStat
    }

    function updateReader(newStat){
        readerStat.value = newStat
    }

    return{adminStat, readerStat, updateAdmin, updateReader}
})