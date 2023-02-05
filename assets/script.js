var userFormEl = document.querySelector('#user-form');
var wordInputEl = document.querySelector('#word-input');
const options =
{
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '7db4b1820bmsh73ef326e4c313d3p1a8ee7jsn4c71b943fe30',
		'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
	}
};

function formSubmitHandler(event)
{
	event.preventDefault();
	var word = wordInputEl.value.trim();
	if(word){
		getWordDefs(word);
		wordInputEl.value = '';
	}
}

function getWordDefs( x )
{
	var apiURL = 'https://wordsapiv1.p.rapidapi.com/words/' + x + '/definitions';

	fetch(apiURL, options)
		.then(function(response)
		{
			if(response.ok)
			{
				response.json().then(function(data)
				{
					displayWordInfo(data, x);
				});
			} else {
				alert('Error: ' + response.statusText);
			}
		})
		.catch(function(error) {
			alert('Unable to connect to wordsAPI');
		});
}

function displayWordInfo( apiData, y )
{
	if(apiData.length === 0)
	{
		wordDataEl.textContent = 'Nothing found for that word.';
		return;
	}
	console.log(apiData);
	for(i=0; i<apiData.length;i++)
	{
		var def = document.createElement('p');
		def.textContent = apiData.definitions[i].definition;
	}
}
userFormEl.addEventListener('submit', formSubmitHandler);

/******************** suggested by the api people *********************
fetch('https://wordsapiv1.p.rapidapi.com/words/hatchback/typeOf', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));
********************** but we're saving it for later ******************/



// document.addEventListener("click", function(event) {
//   // Checking if the button was clicked
//  if (!event.target.matches("#search-button")) return;
//  
//  fetch('https://wordsapiv1.p.rapidapi.com/words/incredible/definitions', options)
//  .then(response => response.json())
//  .then(response => console.log(response))
//  .catch(err => console.error(err));
// });
// 
// //$
// 
// 
// const options = {
// 	method: 'GET',
// 	headers: {
// 	 'X-RapidAPI-Key': '3d5db3c0abmsh320832ed35d8ba3p126149jsne027b3581b02',
// 		'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
// 	}
// };
// 
