const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');
const request = require('request');
const cors = require('cors');

app.use(cors());

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
})

//Ask Nabil about why this redirection isn't working
app.get('*', function(req, res) {
	res.redirect('/chatbot');
})

app.get('/chatbot', function(req, res) {
	res.sendFile(__dirname + "/public/html/index.html");
});

// Tell express module public directory has site assets
app.use(express.static(path.join(__dirname, '/public')));

//Reads JSON body
app.use(express.json());
//Reads URL encoded body
app.use(express.urlencoded({ extended: true }));
//Handles incoming requests
app.post('/chatbot', (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	const message = req.body.message;
	const number = message.match(/\d+/);
	if (number) {
		fetch(`http://numbersapi.com/${number}?type=trivia`).then(response => response.text()).then(data => {
			res.json({
				text: data
			});
		}).catch(error => {
			res.json({
				text: "Sorry, I couldn't find any information about that number."
			});
		});
	} else {
		res.json({
			text: "I'm sorry, I didn't understand your question. Please provide a number for me to give you information about."
		});
	}
});

function getNumberInfo(number){
	const API_URL = `http://numbersapi.com/${number}`;
	fetch(API_URL).then(response => response.text()).then(data => {
		console.log(data);
	}).catch(error => {
		console.log(error);
	});
}

getNumberInfo(42, 'trivia');