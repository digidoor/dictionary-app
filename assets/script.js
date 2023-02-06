var word = "";
var dictionary = JSON.parse(localStorage.getItem("dictionary")) || [];
var statusEl = document.querySelector('#status');
var userFormEl = document.querySelector('#user-form');
var wordInputEl = document.querySelector('#word-input');
var displayList = document.getElementById('def-list');
var anchorDiv = document.querySelector('#anchor-div');
var dictionaryButton = document.querySelector('#showDictionary');
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
	clearPrevious();

	word = wordInputEl.value.trim();
	if(word){
		getWordDefs(word);
		wordInputEl.value = '';
	}
}

function getWordDefs( word )
{
	var apiURL = 'https://wordsapiv1.p.rapidapi.com/words/' + word + '/definitions';
	fetch(apiURL, options)
		.then( response =>
		{
			if(response.ok)
				response.json().then(data => displayWordInfo(data, word));
			else if (response.status == 404)
				statusEl.textContent = 'Sorry, word not found. Try another.';
		})//don't add code above without noting the lack of brackets on this if
		.catch(error => console.error(err));
}


function displayWordInfo( apiData, word )
{
	console.log(apiData);// for testing and feature creep needs
	var foundWord = document.createElement('h4');
	foundWord.textContent = word;
	displayList.append(foundWord);
	for(i=0; i<apiData.definitions.length;i++)
	{
		var def = document.createElement('p');
		def.textContent = ": " + apiData.definitions[i].definition;
		var checkBox = document.createElement("input");
		checkBox.setAttribute("type", "checkbox");
		checkBox.classList.add("box");
		def.append(checkBox);
		foundWord.append(def);
	}
	var saveButton = document.createElement("button");
	initSave(saveButton);
	displayList.append(saveButton);
	saveButton.addEventListener('click', choicesHandler);
}

function initSave( element )
{
	element.setAttribute('id', "saveButton");
	element.textContent = "Save Definitions";

}

function choicesHandler( )
{
	event.preventDefault();//don't think this is necessary but whatever
	var selected = [];
	var numBoxes = document.querySelectorAll('.box').length;//either selector works
	var boxes = document.getElementsByClassName('box');//querySelectorAll or gEBCN
	for(var i=0;i<numBoxes;i++) //watch the lack of brackets; add here with caution
		if(boxes[i].checked) //another bracketless block; caution as always
			selected.push(boxes[i].parentElement.textContent);
	//console.log(selected);
	saveToDictionary(selected);

}

function saveToDictionary( selected )
{
	//console.log(selected); //just to see
	var wordObj = {};
	wordObj.name = word; //our good ol' global variable "word"
	console.log(wordObj.name);
	for(i=0;i<selected.length;i++)
		wordObj[`definition${i}`] = selected[i];
	//for(i=0;i<selected.length;i++)
	//	wordObj[`partOfSpeech${i}`] = selected[i];
	var i = dictionary.findIndex( element => element.name == wordObj.name );
	if( i > -1 )
		dictionary[i] = wordObj;
	else
		dictionary.push(wordObj);
	dictionary.sort((a, b) => (a.name > b.name) ? 1 : -1);//we prefer our dictionaries in alphabetical order
	console.log(dictionary);
	localStorage.setItem("dictionary", JSON.stringify(dictionary));
}

function showDictionary()
{
	// load the dictionary back in, yeah? might have changed
	event.preventDefault();
	dictionary = JSON.parse(localStorage.getItem("dictionary")) || [];
	clearPrevious();
	var wordObj = {};
	for(i=0;i<dictionary.length;i++)
	{
		wordObj = dictionary[i];
		nameEl = document.createElement("h4");
		nameEl.textContent = wordObj.name;
		var re = /definition[0-9]+/;
		for(prop in wordObj)
			if(prop.match(re))
			{
				var defEl = document.createElement('p');
				defEl.textContent = ": " + wordObj[`${prop}`];
				nameEl.append(defEl);
			}
		displayList.append(nameEl);
	}
}

function clearPrevious()
{
	anchorDiv.innerHTML = '';
	displayList.innerHTML = '';
	statusEl.textContent = '';
}

dictionaryButton.addEventListener('click', showDictionary);
userFormEl.addEventListener('submit', formSubmitHandler);

// Use this to clear the dictionary:
//localStorage.removeItem("dictionary");
// (or you could just delete it manually through developer tools...
