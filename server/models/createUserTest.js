
fetch('http://localhost:6001/randomuser/', {
    method: 'POST',
    
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));