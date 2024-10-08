import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useBooks } from './books'

export const useTitles = defineStore('titles', () => {
    const thead = ref({titleId: 0, title: '', isbn: '', number: 0})

    const titles = ref([
        {titleId: 0, title: 'Test', isbn: '9787000000001'}
    ])
    
    const nextId = ref(1)
    const isbnReg = new RegExp('9787[0-9]{9}')

    const books = useBooks()

    function searchTitle(searchText){
        let results = []

        if(isbnReg.test(searchText) === true){
            for(let i = 0; i < titles.value.length; i++){
                if(titles.value[i].isbn === searchText){
                    //补充图书的数量信息
                    let result = Object.assign({}, titles.value[i])
                    result.available = books.searchAvailable(titles.value[i].titleId)
                    result.number = books.searchNumber(titles.value[i].titleId)
                    results.push(result)
                    break
                }
            }
        }
        else{            
            for(let i = 0; i < titles.value.length; i++){
                if(titles.value[i].title.search(searchText) !== -1){
                    let result = Object.assign({}, titles.value[i])
                    result.available = books.searchAvailable(titles.value[i].titleId)
                    result.number = books.searchNumber(titles.value[i].titleId)
                    results.push(result)
                }
            }
        }

        return results
    }

    function checkTitle(title){
        if(Object.hasOwn(title, 'title') === false) {return('One book does\'t have a title!')}
        else if(Object.hasOwn(title, 'title') === false) {return('"' + title.title + '" does\'t have an ISBN code!')}
        else if(isbnReg.test(title.isbn) === false) {return('"' + title.title + '" has an invalid ISBN code!')}
        else if(Object.hasOwn(title, 'title') === false) {return('"' + title.title + '" does\'t have a number!')}
        else if(Number(title.number) === NaN || Number(title.number) < 0)
        {return('"' + title.title + '" has an invalid number!')}

        for(let i = 0; i < titles.value.length; i++){
            if(titles.value[i].isbn === title.isbn){
                if(titles.value[i].title !== title.title) {return('"' + title.title + '" contradicts with existing books!')}
                else {title.titleId = titles.value[i].titleId}
            }
        }
        return('OK')
    }

    function importBatchTitles(str){
        //所有数据最后一并存入数据库，存入前不更新数据库信息
        let newTitles = []
        let newId = nextId.value
        //读取文件，行间\n，属性间\t，键值间:
        let lines = str.split('\r\n')
        for(let i = 0; i < lines.length; i++){
            let newTitle = {titleId: -1}

            let props = lines[i].split('\t')
            for(let j = 0; j < props.length; j++){
                let splited = props[j].split(':')
                if(splited.length !== 2){return('Invalid file format!')}

                let key = splited[0]
                let val = splited[1]                
                newTitle[key] = val
            }
            //查重
            let errorMessage = checkTitle(newTitle)
            if(errorMessage !== 'OK') {return(errorMessage)}

            for(let j = 0; j < i; j++){
                if(newTitles[j].isbn === newTitle.isbn){
                    if(newTitles[j].title !== newTitle.title) {return('"' + newTitle.isbn + '" has two different titles!')}
                    else {newTitle.titleId = newTitles[j].titleId}
                }
            }
            //titleId为-1说明是新标题，赋新的titleId
            if(newTitle.titleId === -1) {newTitle.titleId = newId++}
            //将number属性从字符串转成数字
            newTitle.number = Number(newTitle.number)
            //将新标题暂存到数组中，不直接放入数据库
            newTitles.push(newTitle)
        }
        //导入文件中的信息已经检查无误，放入数据库
        for(let i = 0; i < newTitles.length; i++){
            //先将新出现的属性存入thead，方便显示
            Object.assign(thead.value, newTitles[i])
            //更新图书信息
            books.importBooks(newTitles[i].titleId, newTitles[i].number)
            //number不需要存储
            delete newTitles[i].number
            //比nextId小，说明是已有标题
            if(newTitles[i].titleId < nextId.value){
                for(let j = 0; j < titles.value.length; j++){
                    if(titles.value[j].titleId === newTitles[i].titleId){
                        //更新thead
                        Object.assign(titles.value[j], newTitles[i])
                    }
                }
            }
            else{
                titles.value.push(newTitles[i])
                nextId.value = newTitles[i].titleId + 1
            }
        }
        return('OK')
    }

    function editTitle(titleId, info){
        let errorMessage = checkTitle(info)
        if(errorMessage !== 'OK') {return(errorMessage)}

        for(let i = 0; i < titles.value.length; i++){
            if(titles.value[i].titleId === titleId){
                titles.value[i] = info
                return('OK')
            }
        }
    }

    function deleteTitle(titleId){
        for(let i = 0; i < titles.value.length; i++){
            if(titles.value[i].titleId === titleId){
                let deletingBooks = books.searchBook(titleId)
                for(let j = 0; j < deletingBooks.length; j++){
                    if(deletingBooks[j].bookStat !== 'Stock') {return("One book is not in stock!")}
                }
                titles.value.splice(i, 1)
                books.deleteBooks(titleId)
                return('OK')
            }
        }
    }

    function scanBooks(str, reader){
        let results = []
        let scanType = ''

        let lines = str.split('\r\n')
        for(let i = 0; i < lines.length; i++){
            let book = books.getBookByBookId(lines[i])
            if(book === null) {return(['Invalid bookId!', null])}

            for(let j = 0; j < titles.value.length; j++){
                if(titles.value[j].titleId === book.titleId){
                    console.log(titles.value[j])
                    if(i === 0){
                        if(book.bookStat === 'Shelf') {scanType = 'Borrow'}
                        else if(book.bookStat === 'Lent') {scanType = 'Return'}
                    }
                    if(book.bookStat === 'Stock') {return(['Can\'t return book in stock!', null])}
                    if(scanType === 'Borrow'){
                        if(book.bookStat === 'Lent') {return(['Can\'t both borrow and return!', null])}
                        if(i > reader.maxBook) {return(['Books more than maxBook!', null])}
                    }
                    else if(scanType === 'Return') {
                        if(book.bookStat !== 'Shelf') {return(['Can\'t both borrow and return!', null])}
                        if(book.readerId !== reader.readerId) {return(['Can\'t return books of others!', null])}
                        if(i > reader.maxBook) {return(['Ha?', null])}
                    }
                    results.push(titles.value[j])
                }
            }
        }

        return [scanType, results]
    }

    return{thead, titles, searchTitle, importBatchTitles, editTitle, deleteTitle, scanBooks}
})