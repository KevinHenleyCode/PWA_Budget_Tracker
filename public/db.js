const dataBase
const req = indexedDB.open('transactions', 1)


req.onupgradeneeded = (e) => {

    const dataBase = e.target.res
    const saveData = dataBase.createObjectStore('create', { keypath: 'id', autoIncrement: true })

    saveData.creatIndex('name', 'name')
    saveData.creatIndex('value', 'value')
    saveData.creatIndex('date', 'date')
}


req.onsuccess = (e) => {
    
    dataBase = e.target.res
    if (navigator.onLine) {checkDatabase()}
}


req.onerror = (e) => {
    
    console.log(`An error has occurred. Please check the error code. ${e.target.errorCode}`);
}


saveData = (data) => {
    
    const transaction = dataBase.transaction(['create', 'store'])
    const write = transaction.objectStore('create')
    write.add(data)
}


retrieveData = () => {

    const transaction = dataBase.transaction(['create'], 'store')
    const write = transaction.objectStore('create')
    const getAll = write.getAll()

    getAll.onsuccess = () => {
        if (getAll.res.length > 0) {
            
            fetch('/api/transaction/bulk', {
                
                method: 'POST',
                body: JSON.stringify(getAll.res),
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