import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBooks = defineStore('books', () => {
     
    const books = ref([])   //书本信息
    const thead = ref({
        bookId: 0,
        titleId: 0,
        bookStat: 'Stock',
        shelf: '',
        readerId: 0,
        lendDate: 0})       //搜索界面的表头

    const nextId = ref(1)   //新书的bookId

    function getBook(bookId){
        
        for(let i = 0; i < books.value.length; i++){
            if(bookId.toString() === books.value[i].bookId.toString()) {return books.value[i]}
        }

        return null
    }

    function getBooks(info, key, type){

        let results = []

        for(let i = 0; i < books.value.length; i++){
            if(info.toString() === books.value[i][key].toString()){
                if(type === 0) {results.push(books.value[i])}
                //对于读者搜索界面，只返回上架书本的信息
                else if(books.value[i].bookStat === 'Shelf'){
                    let info = {}
                    let keys = Object.keys(thead.value)
                    for(let j = 0; j < 4; j++) {info[keys[j]] = books.value[i][keys[j]]}
                    results.push(info)
                }            
            }
        }

        return results
    }

    function setBook(bookId, info, key){

        for(let i = 0; i < books.value.length; i++){
            if(bookId === books.value[i].bookId){
                if(key === 'all') {books.value[i] = info}
                else if(info === 'DELETE') {delete books.value[i][key]}
                else {books.value[i][key] = info}
                return('OK')
            }
        }

        return('Not found!')
    }

    function getNumber(titleId){

        let numbers = [0, 0]
        let results = getBooks(titleId, 'titleId', 0)

        for(let i = 0; i < results.length; i++){
            if(titleId === results[i].titleId){
                numbers[1]++
                if(results[i].bookStat === 'Shelf') {numbers[0]++}
            }
        }

        return numbers
    }

    function importBooks(titleId, number){
        for(let i = 0; i < number; i++){
            books.value.push({bookId: nextId.value, titleId: titleId, bookStat: 'Stock'})
            nextId.value++
        }
    }

    function editBook(bookId, info){
        
        let setMessage = setBook(bookId, info, 'all')
        if(setMessage !== 'OK') {return(setMessage)}

        return('OK')
    }

    function updateBatchBooks(str){

        let lines = str.split('\r\n')
        for(let i = 0; i < lines.length; i++){
            let splited = lines[i].split(' ')

            let B = getBook(splited[0])
            if(B === null) {return('Can\'t find book!')}

            setBook(B.bookId, 'Shelf', 'bookStat')
            setBook(B.bookId, splited[1], 'shelf')
        }

        return('OK')
    }

    function deleteBooks(titleId){

        for(let i = 0; i < books.value.length; i++){
            if(books.value[i].titleId === titleId) {books.value.splice(i, 1)}
        }
    }
    
    function deleteBook(bookId){

        for(let i = 0; i < books.value.length; i++){
            if(books.value[i].bookId === bookId){
                if(books.value[i].bookStat !== 'Stock') {return('Only delete book in stock!')}
                books.value.splice(i , 1)
                return('OK')
            }
        }

        return('Can\'t find book!')
    }

    function borrowBooks(newBooks, reader){

        for(let i = 0; i < newBooks.length; i++){
            let B = getBook(newBooks[i].bookId)
            if(B === null) {return('Can\'t find book!')}

            setBook(B.bookId, 'Lent', 'bookStat')
            setBook(B.bookId, 'DELETE', 'shelf')
            setBook(B.bookId, reader.userId, 'readerId')
        }

        return('OK')
    }

    function returnBooks(newBooks){

        for(let i = 0; i < newBooks.length; i++){
            let B = getBook(newBooks[i].bookId)
            if(B === null) {return('Can\'t find book!')}

            setBook(B.bookId, 'Stock', 'bookStat')
            setBook(B.bookId, 'DELETE', 'readerId')
        }

        return('OK')
    }

    return{thead, books,
        getBook, getBooks, setBook,
        getNumber, importBooks, editBook, updateBatchBooks, deleteBooks, deleteBook,
        borrowBooks, returnBooks}
})