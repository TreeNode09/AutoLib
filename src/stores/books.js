import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBooks = defineStore('books', () => {
    const thead = ref({bookId: 0, titleId: 0, bookStat: 'Stock', shelf: '', readerId: 0, lendDate: 0})
    
    const books = ref([
        {bookId: 0, titleId: 0, bookStat: 'Stock'}
    ])

    const nextId = ref(1)

    function searchBook(titleId){
        let result = []
        for(let i = 0; i < books.value.length; i++){
            if(books.value[i].titleId === titleId){
                result.push(books.value[i])
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

    return{thead, books, searchBook, searchAvailable, searchNumber, importBooks, editBook, deleteBooks, deleteBook}
})