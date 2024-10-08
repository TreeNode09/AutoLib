<template>
<div><button @click="toHome">Back</button></div>
<div>
    <input type="text" placeholder="Book title or ISBN" v-model="searchText">
    <button @click="search">Search</button>
    <button @click="search">↺</button>
</div>
<div v-if="props.type===0">
    <input type="file" accept=".txt" ref="newFile" @change="readFile">
    <span v-if="isImporting">
        <input type="radio" name="fileType" checked @click="fileType=0">Import
        <input type="radio" name="fileType" @click="fileType=1">Update
        <button @click="importBooks">Confirm</button>
        <button @click="cancelImport">Cancel</button>
    </span>   
    <button v-if="isDeleting===false" @click="startDelete()" class="red right">Delete</button>
    <button v-else @click="endDelete()" class="right">Done</button>
</div>
<small><span v-if="importError!=='OK'">{{ importError }}</span></small>
<div v-if="isFound" class="table-out"><table>
    <thead>
        <tr>
            <th></th>
            <th v-for="key in Object.keys(titles.thead)">{{ key }}</th>
        </tr>
    </thead>
    <tr v-if="editError!=='OK'">
        <td colspan="7"><small><span>{{ editError }}</span></small></td>
    </tr>
    <tbody v-for="(result,index) in results">
        <tr>
            <td>
                <button v-if="showingIndex!==index" @click="showBooks(result, index)"
                :disabled="props.type===1&&result.available===0">▾</button>
                <button v-else @click="unshowBooks()">▴</button>
                <span v-if="props.type===0">
                    <span v-if="isDeleting===false">                    
                        <button v-if="editingIndex!==index" @click="editTitle(result, index)">E</button>
                        <button v-if="editingIndex===index" @click="saveEdit(result)">√</button>
                        <button v-if="editingIndex===index" @click="cancelEdit()">x</button>
                    </span>
                    <button v-else @click="deleteTitle(result, index)" class="red">D</button>
                </span>
            </td>
            <td v-for="key in Object.keys(titles.thead)">
                <div v-if="editingIndex===index">
                    <span v-if="key==='titleId'">{{ result[key] }}</span>
                    <span v-if="key==='number'">{{ result.available }}/{{ result.number }}</span>
                    <input v-if="key!=='titleId'&&key!=='number'" v-model="editInfo[key]">
                </div>
                <div v-else>
                    <div v-if="Object.hasOwn(result, key)">
                        <span v-if="key==='number'">{{ result.available }}/{{ result.number }}</span>
                        <span v-else>{{ result[key] }}</span>                    
                    </div>
                </div>
            </td>
        </tr>
        <tr v-if="showingIndex===index">
            <td colspan="7">
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th v-for="key in Object.keys(books.thead)">{{ key }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(book, bookIndex) in showedBooks">
                            <td>
                                <span v-if="isDeleting===true">
                                    <button @click="deleteBook(book, result, index)" class="red">D</button>
                                </span>
                                <span v-else>
                                    <button v-if="editingBookIndex!==bookIndex" @click="editBook(book, bookIndex)">E</button>
                                    <button v-if="editingBookIndex===bookIndex"
                                    @click="saveBookEdit(book, result, index)">√</button>
                                    <button v-if="editingBookIndex===bookIndex" @click="cancelBookEdit()">x</button>
                                </span>
                            </td>
                            <td v-for="key in Object.keys(books.thead)">
                                <div v-if="editingBookIndex===bookIndex">
                                    <span v-if="key==='bookId'||key==='titleId'||key==='bookStat'">
                                        <select v-if="key==='bookStat'" v-model="editInfo.bookStat">
                                            <option value="Stock" :selected="editInfo.bookStat==='Stock'">Stock</option>
                                            <option value="Shelf" :selected="editInfo.bookStat==='Shelf'">Shelf</option>
                                            <option value="Lent" :selected="editInfo.bookStat==='Lent'">Lent</option>
                                        </select>
                                        <span v-else>{{ book[key] }}</span>
                                    </span>
                                    <input v-else v-model="editInfo[key]">
                                </div>
                                <div v-else>{{ book[key] }}</div>
                            </td>
                        </tr>
                    </tbody>                 
                </table>
            </td>
        </tr>
    </tbody>
</table></div>
<div v-else>Title not found!</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStats } from '@/stores/stats.js'
import { useTitles } from '@/stores/titles.js'
import { useBooks } from '@/stores/books'

const stats = useStats()
const titles = useTitles()
const books = useBooks()
const props = defineProps(['type'])

const file = ref(null)
const newFile = ref()
const fileString = ref('')
const fileType = ref(0)
const importError = ref('OK')
const isImporting = ref(false)

const searchText = ref('')
const results = ref([])
const isFound = ref(true)

const showedBooks = ref([])
const showingIndex = ref(-1)

const editingIndex = ref(-1)
const editingBookIndex = ref(-1)
const editInfo = ref({})
const editError = ref('OK')

const isDeleting = ref(false)

function toHome(){
    if(props.type === 0) {stats.updateAdmin('Home')}
    else {stats.updateReader('Home')}
}

function search(){
    results.value = titles.searchTitle(searchText.value)
    if(results.value.length === 0) {isFound.value = false}
    else {isFound.value = true}
}

function showBooks(info, index){
    showedBooks.value = books.searchBook(info.titleId, props.type)
    showingIndex.value = index
}

function unshowBooks(){
    showedBooks.value = []
    showingIndex.value = -1
}

function readFile(event){
    const current = event.target.files[0]
    if(current) {file.value = current}

    const fr = new FileReader()
    fr.readAsText(file.value, 'UTF-8')
    fr.onload = (event) => {
        fileString.value = event.target.result
    }

    isImporting.value = true
}

function importBooks(){
    if(fileType.value === 0) {importError.value = titles.importBatchTitles(fileString.value)}
    else {importError.value = books.updateBatchBooks(fileString.value)}

    cancelImport()
    search()
}

function cancelImport(){
    newFile.value.value = ''
    isImporting.value = false
}

function editTitle(info, index){
    editingIndex.value = index
    editInfo.value = Object.assign({}, info)
}

function saveEdit(info){
    editError.value = titles.editTitle(info.titleId, editInfo.value)
    if(editError.value === 'isOK') {info = Object.assign({}, editInfo.value)}  
    cancelEdit()
    search()
}

function cancelEdit(){
    editInfo.value = {}
    editingIndex.value = -1
}

function editBook(info, index){
    editingBookIndex.value = index
    editInfo.value = Object.assign({}, info)
}

function saveBookEdit(bookInfo, titleInfo, index){
    editError.value = books.editBook(bookInfo.bookId, editInfo.value)
    if(editError.value === 'isOK') {bookInfo = Object.assign({}, editInfo.value)}
    cancelBookEdit()
    //更新result和books
    search()
    showBooks(titleInfo, index)
}

function cancelBookEdit(){
    editInfo.value = {}
    editingBookIndex.value = -1
}

function startDelete(){
    isDeleting.value = true
}

function deleteTitle(info, index){
    editError.value = titles.deleteTitle(info.titleId)
    if(showingIndex.value === index){
        showingIndex.value = -1
    }
    search()
}

function deleteBook(bookInfo, titleInfo, index){
    editError.value = books.deleteBook(bookInfo.bookId)
    search()
    showBooks(titleInfo, index)
}

function endDelete(){
    isDeleting.value = false
}

onMounted(() => {
    search()   
})
</script>