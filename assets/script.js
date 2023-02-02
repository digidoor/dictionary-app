
document.addEventListener("click", function(event) {
	// Checking if the button was clicked
   if (!event.target.matches("#search-button")) return;
   
   fetch('https://wordsapiv1.p.rapidapi.com/words/incredible/definitions', options)
   .then(response => response.json())
   .then(response => console.log(response))
   .catch(err => console.error(err));
  });
  
  $
  
  
  const options = {
	  method: 'GET',
	  headers: {
	   'X-RapidAPI-Key': '3d5db3c0abmsh320832ed35d8ba3p126149jsne027b3581b02',
		  'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
	  }
  };