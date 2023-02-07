var word = "";
var dictionary = JSON.parse(localStorage.getItem("dictionary")) || [];
var defListObj = {};
var statusEl = document.querySelector('#status');
var userFormEl = document.querySelector('#user-form');
var wordInputEl = document.querySelector('#word-input');
var displayList = document.getElementById('def-list');
var anchorDiv = document.querySelector('#anchor-div');
var dictionaryButton = document.querySelector('#showDictionary');
const btn = document.querySelector('#gameBtn')
console.log(dictionary);

btn.onclick = function () {
  location.href = "gameAssets/gameindex.html" // adding click listener to game button to take to game html
};
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
			if(response.ok) // doing "definitions = data" below DOES NOT WORK
				response.json().then(data => displayWordInfo(data, word));
			else if (response.status == 404)//it has to be passed on to the next function to be usable for whatever reason. some browser sorcery.
				statusEl.textContent = 'Sorry, word not found. Try another.';
		})//don't add code above without noting the lack of brackets on this if
		.catch(error => console.error(err));
}


function displayWordInfo( apiData, word )
{
	console.log(apiData);// for testing and feature creep needs
	var foundWord = document.createElement('h4');
	defListObj = apiData; //more descriptive. can't use it prior to this pass
	foundWord.textContent = defListObj.word;
	displayList.append(foundWord);
	for(i=0; i<defListObj.definitions.length;i++)
	{
		let e = i % 2;

		
		var defEl = document.createElement('p');
		defEl.setAttribute("style", " background: #CCCCCC");
		if(e)
			defEl.setAttribute("style", " background: #999999;");
		defEl.innerHTML = "<em>" + abbr(defListObj.definitions[i].partOfSpeech) + ' ' + "</em>";
		defEl.innerHTML += ": " + defListObj.definitions[i].definition;
		var checkBox = document.createElement("input");
		checkBox.setAttribute("type", "checkbox");
		checkBox.classList.add("box");
		defEl.append(checkBox);
		foundWord.append(defEl);
	}
	initSave();
}

function initSave( )
{
	var saveButton = document.createElement("button");
	saveButton.setAttribute('id', "saveButton");
	saveButton.textContent = "Save Definitions";
	//checkBox.classList.add("button");
	displayList.append(saveButton);
	saveButton.addEventListener('click', choicesHandler);
}

function choicesHandler( )
{
	event.preventDefault();//don't think this is necessary but whatever
	var selectedIndexes = [];
	var numBoxes = document.querySelectorAll('.box').length;//either selector works
	var boxes = document.getElementsByClassName('box');//querySelectorAll or gEBCN
	for(var i=0;i<numBoxes;i++) //watch the lack of brackets; add here with caution
		if(boxes[i].checked) //another bracketless block; caution as always
			selectedIndexes.push(i);
	saveToDictionary(selectedIndexes);
}

function saveToDictionary( selectedIndexes )
{
	//console.log(selected); //just to see
	var wordObj = {};
	var i = 0;
	wordObj.name = defListObj.word;
	console.log(wordObj.name);
	while(selectedIndexes.length) //zero is falsy
	{
		wordObj[`definition${i}`] = defListObj.definitions[selectedIndexes[0]].definition;
		wordObj[`partOfSpeech${i}`] = defListObj.definitions[selectedIndexes[0]].partOfSpeech;
		i++;
		selectedIndexes.shift();
	}
	var i = dictionary.findIndex( element => element.name == wordObj.name );//see below
	if( i > -1 ) //check if the word is already iin the dictionary
		dictionary[i] = wordObj; //don't push if it's already in the dictionary
	else
		dictionary.push(wordObj); //overwrite the old one instead
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
				var propName = `${prop}`;
				var otherProp = propName.replace("definition", "partOfSpeech");
				defEl.innerHTML = "<em>" + abbr(wordObj[otherProp]) + " " + "</em>";
				defEl.innerHTML += ": " + wordObj[propName];
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

function abbr(pos)
{
	switch(pos)
	{
		case "noun":
			return "n.";
		case "verb":
			return "v.";
		case "adjective":
			return "adj.";
		case "adverb":
			return "adv.";
		case "pronoun":
			return "pron.";
		case "preposition":
			return "prep.";
		case "conjunction":
			return "conj.";
		case "definite article":
			return "def.art.";
		default:
			return pos;
	}
}

dictionaryButton.addEventListener('click', showDictionary);
userFormEl.addEventListener('submit', formSubmitHandler);

// Use this to clear the dictionary:
//localStorage.removeItem("dictionary");
// (or you could just delete it manually through developer tools...
