<template>
<div><button @click="toHome">Cancel</button></div>
<div>UserName: {{ reader.username }}  MaxBook: {{ reader.maxBook }}  MaxTime: {{ reader.maxTime }}</div>
<div>
    <input type="file" accept=".txt" ref="newFile" @change="readFile">
    <button v-if="isScanning" @click="scanBooks()">Scan</button>
    <button v-if="isScanning" @click="endScan()">Cancel</button>
</div>
<small><span v-if="scanMessage!=='Borrow'&&scanMessage!=='Return'">{{ scanMessage }}</span></small>

<div v-if="isShowing" class="table-out"><table>
    <thead><tr>
        <th v-for="key in head">{{ key }}</th>
    </tr></thead>
    <tbody>
        <tr v-for="result in results">
            <td v-for="key in head">{{ result[key] }}</td>
        </tr>
    </tbody>
</table></div>
<div v-if="isShowing">
    <button v-if="scanMessage==='Borrow'" @click="borrowBooks">Confirm to borrow</button>
    <button v-if="scanMessage==='Return'" @click="returnBooks">Confirm to return</button>
</div>
</template>

<script setup>
import { ref } from 'vue'
import { useStats } from '@/stores/stats.js'
import { useTitles } from '@/stores/titles.js'
import { useBooks } from '@/stores/books'

const stats = useStats()
const titles = useTitles()
const books = useBooks()
let reader = JSON.parse(window.localStorage.getItem('reader'))

const file = ref(null)
const newFile = ref()
const fileString = ref('')

const isScanning = ref(false)
const scanMessage = ref('')

const head = ref(['bookId', 'titleId', 'title'])
const results = ref([])
const isShowing = ref(false)

function toHome(){
    window.localStorage.setItem('reader', '')
    stats.updateReader('Home')
}

function readFile(event){
    const current = event.target.files[0]
    if(current) {file.value = current}

    const fr = new FileReader()
    fr.readAsText(file.value, 'UTF-8')
    fr.onload = (event) => {
        fileString.value = event.target.result
    }

    isScanning.value = true
}

function scanBooks(){
    let scanInfo = titles.scanBooks(fileString.value, reader)
    scanMessage.value = scanInfo[0]
    results.value = scanInfo[1]
    if(results.value !== null) {isShowing.value = true}
    
    endScan()
}

function endScan(){
    newFile.value.value = ''
    isScanning.value = false
}

function borrowBooks(){
    books.borrowBooks(results.value, reader)
    stats.updateReader('Finish')
}

function returnBooks(){
    books.returnBooks(results.value, reader)
    stats.updateReader('Finish')
}
</script>