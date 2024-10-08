import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBooks = defineStore('books', () => {
    const thead = ref({bookId: 0, titleId: 0, bookStat: 'Stock', shelf: '', readerId: 0, lendDate: 0})
    
    const books = ref([
        {bookId: 0, titleId: 0, bookStat: 'Stock'}
    ])

    const nextId = ref(1)

    function searchBook(titleId, type){
        let result = []
        for(let i = 0; i < books.value.length; i++){
            if(books.value[i].titleId === titleId){
                if(type === 1){
                    if(books.value[i].bookStat === 'Shelf'){
                        let info = {}
                        let keys = Object.keys(thead.value)
                        for(let j = 0; j < 4; j++){
                            info[keys[j]] = books.value[i][keys[j]]
                        }
                        result.push(info)
                    }
                }
                else {result.push(books.value[i])}               
            }
        }

        return result
    }

    function searchAvailable(titleId){
        let count = 0
        for(let i = 0; i < books.value.length; i++){
            if(books.value[i].titleId === titleId){
                if(books.value[i].bookStat === 'Shelf') {count++}
            }
        }

        return count
    }

    function searchNumber(titleId){
        let count = 0
        for(let i = 0; i < books.value.length; i++){
            if(books.value[i].titleId === titleId) {count++}
        }

        return count
    }

    function getBookByBookId(bookId){
        for(let i = 0; i < books.value.length; i++){
            if(bookId === books.value[i].bookId.toString()){
                return books.value[i]
            }
        }
        return null
    }

    function importBooks(titleId, number){
        for(let i = 0; i < number; i++){
            books.value.push({bookId: nextId.value, titleId: titleId, bookStat: 'Stock'})
            nextId.value++
        }
    }

    function editBook(bookId, info){
        for(let i = 0; i < books.value.length; i++){
            if(books.value[i].bookId === bookId){
                books.value[i] = info
                return('OK')
            }
        }
    }

    function updateBatchBooks(str){
        let lines = str.split('\r\n')
        for(let i = 0; i < lines.length; i++){
            let splited = lines[i].split(' ')
            for(let j = 0; j < books.value.length; j++){
                if(splited[0] === books.value[j].bookId.toString()){
                    books.value[j].bookStat = 'Shelf'
                    books.value[j].shelf = splited[1]
                }
            }
        }
        return('OK')
    }

    function deleteBooks(titleId){
        for(let i = 0; i < books.value.length; i++){
            if(books.value[i].titleId === titleId){
                books.value.splice(i, 1)
            }
        }
    }
    
    function deleteBook(bookId){
        for(let i = 0; i < books.value.length; i++){
            if(books.value[i].bookId === bookId){
                books.value.splice(i , 1)
                return('OK')
            }
        }
    }

    return{thead, books,
        searchBook, searchAvailable, searchNumber, getBookByBookId,
        importBooks, editBook, updateBatchBooks, deleteBooks, deleteBook}
})