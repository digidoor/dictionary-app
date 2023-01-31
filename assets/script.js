fetch("https://wordsapiv1.p.rapidapi.com/words/%7Bword%7D", {
  "method": "GET",
  "headers": {
    "x-rapidapi-key": "ce19d0164fmsh3d383efc0e85ce5p16dcb1jsnb1a4a3c79541",
    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com"
  }
})
.then(response => {
  console.log(response);
})
.catch(err => {
  console.error(err);
});