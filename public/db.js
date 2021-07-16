const dataBase
const request = indexedDB.open('transactions', 1)


request.onupgradeneeded = (e) => {

    const dataBase = e.target.result
    const saveData = dataBase.createObjectStore('create', { keyPath: 'id', autoIncrement: true })

    saveData.creatIndex('name', 'name')
    saveData.creatIndex('value', 'value')
    saveData.creatIndex('date', 'date')
}


request.onsuccess = (e) => {
    
    dataBase = e.target.result
    if (navigator.onLine) {checkDatabase()}
}


request.onerror = (e) => {
    
    console.log(`An error has occurred. Please check the error code. ${e.target.errorCode}`);
}


saveRecord = (data) => {
    
    const transaction = dataBase.transaction(['create', 'store'])
    const write = transaction.objectStore('create')
    write.add(data)
}


retrieveData = () => {

    const transaction = dataBase.transaction(['create'], 'store')
    const write = transaction.objectStore('create')
    const getAll = write.getAll()

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            
            fetch('/api/transaction/bulk', {
                
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                
                }
            })
            .then((res) => res.json())
            
            .then(() => {  
                let transaction = dataBase.transaction(['create'], 'store')
                const write = transaction.objectStore('create')
                write.clear()
            
            })
        }
    }
} 


window.addEventListener('online', checkDatabase)