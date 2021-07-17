let db
const request = window.indexedDB.open('budget', 1)


request.onupgradeneeded = (e) => {

    db = e.target.result
    const saveData = db.createObjectStore('create', { keyPath: 'id', autoIncrement: true })

    saveData.creatIndex('name', 'name')
    saveData.creatIndex('value', 'value')
    saveData.creatIndex('date', 'date')
}


request.onsuccess = (e) => {
    
    db = e.target.result
    if (navigator.onLine) {checkDatabase()}
}


request.onerror = (e) => {
    
    console.log(`An error has occurred. Please check the error code. ${e.target.errorCode}`);
}


saveRecord = (data) => {
    
    const db = request.result

    const transaction = db.transaction(['create'], 'store')
    const write = transaction.objectStore('create')

    write.add({
        name: data.name, 
        value: data.value, 
        date: new Date().toISOString()
    })
}


checkDatabase = () => {

    const transaction = db.transaction(['create'], 'store')
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
            .then((response) => response.json())
            
            .then(() => {  
                let transaction = db.transaction(['create'], 'store')
                const write = transaction.objectStore('create')
                write.clear()
            
            })
        }
    }
} 


window.addEventListener('online', checkDatabase)