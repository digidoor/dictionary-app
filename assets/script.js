var word = "";
var statusEl = document.querySelector('#status');
var userFormEl = document.querySelector('#user-form');
var wordInputEl = document.querySelector('#word-input');
var displayList = document.getElementById('def-list');
var anchorDiv = document.querySelector('#anchor-div');
var dictionary = JSON.parse(localStorage.getItem("dictionary")) || [];
console.log(dictionary);
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
	anchorDiv.innerHTML = '';
	displayList.innerHTML = '';

	word = wordInputEl.value.trim();
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
				response.json().then(data => displayWordInfo(data,x));
			else if (response.status == 404)
				statusEl.textContent = 'Sorry, word not found. Try another.';
		})//don't add code above without noting the lack of brackets on this if
		.catch(error => console.error(err));
}


function displayWordInfo( apiData, y )
{
	console.log(apiData);
	var foundWord = document.createElement('h1');
	foundWord.textContent = apiData.word;
	for(i=0; i<apiData.definitions.length;i++)
	{
		var def = document.createElement('li');
		def.textContent = apiData.definitions[i].definition;
		var radioButton = document.createElement("input");
		radioButton.setAttribute("type", "checkbox");
		def.append(radioButton);
		displayList.append(def);
	}
	anchorDiv.append(foundWord);
	saveToDictionary(apiData);
}

function choicesHandler( )
{

}
function saveToDictionary( z )
{
	console.log(z); //just to see
	var wordObj = {};
	wordObj.name = z.word;
	wordObj.definition = z.definitions[0].definition;
	dictionary.push(wordObj);
	dictionary.sort((a, b) => (a.name > b.name) ? 1 : -1);//we prefer our dictionaries in alphabetical order
	console.log(dictionary);
	localStorage.setItem("dictionary", JSON.stringify(dictionary));
}
userFormEl.addEventListener('submit', formSubmitHandler);
displayList.addEventListener('click', choicesHandler);


// Use this to clear the dictionary:
//localStorage.removeItem("dictionary");
