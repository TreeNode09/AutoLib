import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useBooks } from './books'

export const useTitles = defineStore('titles', () => {

    const books = useBooks()

    const thead = ref({
        titleId: 0,
        title: '',
        isbn: '',
        number: 0})         //搜索界面的表头，包含所有书目的信息
    const titles = ref([])  //书目列表

    const nextId = ref(1)   //新书的titleId
    const isbnReg = new RegExp('9787[0-9]{9}')  //ISBN号的格式，9787开头，13位数字

    function getTitle(info, key){

        for(let i = 0; i < titles.value.length; i++){
            if(info === titles.value[i][key]) {return titles.value[i]}
        }

        return null
    }

    function setTitle(titleId, info, key){

        for(let i = 0; i < titles.value.length; i++){
            if(titleId === titles.value[i].titleId){
                if(key === 'all') {titles.value[i] = info}
                else {titles.value[i][key] = info}
                return('OK')
            }
        }

        return('Not found!')
    }

    //功能：检查书目的标题、ISBN号和数量信息，并在数据库中查重
    //输入：书目对象    返回：操作信息，成功为'OK'，下同
    function checkTitle(title){
        
        if(Object.hasOwn(title, 'title') === false) {return('One book does\'t have a title!')}
        else if(Object.hasOwn(title, 'isbn') === false) {return('"' + title.title + '" does\'t have an ISBN code!')}
        else if(isbnReg.test(title.isbn) === false) {return('"' + title.title + '" has an invalid ISBN code!')}
        else if(Object.hasOwn(title, 'number') === false) {return('"' + title.title + '" does\'t have a number!')}
        else if(Number(title.number) === NaN || Number(title.number) < 0) {return('"' + title.title + '" has an invalid number!')}
        //检查数据库中是否有ISBN号相同的书目
        let T = getTitle(title.isbn, 'isbn')
        if(T !== null){
            if(title.title !== T.title) {return('"' + title.title + '" contradicts with existing books!')}
            else {title.titleId = T.titleId}
        }
        
        return('OK')
    }

    //功能：搜索书目-优先按照ISBN号搜索，输入为空时返回所有书目
    //输入：搜索字符串  返回：搜素结果数组
    function searchTitle(searchText){

        let results = []

        if(isbnReg.test(searchText) === true){
            let T = getTitle(searchText, 'isbn')
            if(T === null) {return results}
            let result = Object.assign({}, T)
            result.available = books.searchAvailable(T.titleId)
            //补充图书的数量信息
            result.number = books.searchNumber(T.titleId)
            results.push(result)
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

    //功能：导入图书-分析文件，添加或更新书目信息，添加书本信息；所有数据检查无误后一并存入数据库
    //输入：文件字符串  返回：操作信息
    function importBatchTitles(str){

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
                newTitle[splited[0]] = splited[1]
            }

            let errorMessage = checkTitle(newTitle)
            if(errorMessage !== 'OK') {return(errorMessage)}

            for(let j = 0; j < i; j++){
                if(newTitles[j].isbn === newTitle.isbn){
                    if(newTitles[j].title !== newTitle.title) {return('"' + newTitle.isbn + '" has two different titles!')}
                    else {newTitle.titleId = newTitles[j].titleId}
                }
            }
            //新标题，赋新的titleId
            if(newTitle.titleId === -1) {newTitle.titleId = newId++}

            newTitle.number = Number(newTitle.number)
            newTitles.push(newTitle)
        }

        for(let i = 0; i < newTitles.length; i++){
            //更新thead，不影响已有信息
            Object.assign(thead.value, newTitles[i])
            //更新图书信息，number只用于此处
            books.importBooks(newTitles[i].titleId, newTitles[i].number)
            delete newTitles[i].number
            //比nextId小，说明是已有标题，更新信息
            if(newTitles[i].titleId < nextId.value){
                let T = getTitle(newTitles[i].titleId, 'titleId')
                if(T === null) {return('Can\'t find title!')}
                Object.assign(T, newTitles[i])
            }
            else {titles.value.push(newTitles[i])}            
        }
        //更新nextId
        nextId.value = newId

        return('OK')
    }

    //功能：修改书目-将新信息保存到数据库中
    //输入：修改后的书目对象    返回：操作信息
    function editTitle(info){

        let errorMessage = checkTitle(info)
        if(errorMessage !== 'OK') {return(errorMessage)}

        let setMessage = setTitle(info.titleId, info, 'all')
        if(setMessage !== 'OK') {return(setMessage)}

        return('OK')
    }

    //功能：删除书目-删除时一并删除对应的书本，只能删除库存中的书目
    //输入：要删除的titleId     返回：操作信息
    function deleteTitle(titleId){

        let T = getTitle(titleId, 'titleId')
        if(T === null) {return('Can\'t find title!')}

        let deletingBooks = books.searchBook(titleId)
        for(let j = 0; j < deletingBooks.length; j++){
            if(deletingBooks[j].bookStat !== 'Stock') {return("Only delete books in stock!")}
        }

        for(let i = 0; i < titles.value.length; i++){
            if(titleId === titles.value[i].titleId) {titles.value.splice(i, 1)}
        }
        books.deleteBooks(titleId)

        return('OK')
    }

    //功能：检查待借还图书
    //输入：文件字符串，读者信息  返回：[检查信息(成功为'Borrow'或'Return')，图书信息数组]
    function scanBooks(str, reader){

        let results = []
        let scanMessage = ''
        //文件每行一个bookId
        let lines = str.split('\r\n')
        for(let i = 0; i < lines.length; i++){
            let book = books.getBookByBookId(lines[i])
            if(book === null) {return(['Invalid bookId!', null])}

            let T = getTitle(book.titleId, 'titleId')
            if(T === null) {return(['Can\'t find title!', null])}
            //不能同时借还
            if(i === 0){
                if(book.bookStat === 'Shelf') {scanMessage = 'Borrow'}
                else if(book.bookStat === 'Lent') {scanMessage = 'Return'}
            }
            if(book.bookStat === 'Stock') {return(['Can\'t return book in stock!', null])}
            if(scanMessage === 'Borrow'){
                if(book.bookStat === 'Lent') {return(['Can\'t both borrow and return!', null])}
                if(i > reader.maxBook) {return(['Books more than maxBook!', null])}
            }
            else if(scanMessage === 'Return') {
                if(book.bookStat === 'Shelf') {return(['Can\'t both borrow and return!', null])}
                if(book.readerId !== reader.userId) {return(['Can\'t return books of others!', null])}
                if(i > reader.maxBook) {return(['Ha?', null])}
            }

            let result = Object.assign({}, T)
            result.bookId = book.bookId
            results.push(result)
        }

        return [scanMessage, results]
    }

    return{thead, titles, searchTitle, importBatchTitles, editTitle, deleteTitle, scanBooks}
})