var dogImg, happyDogImg;
var dogSprite;
var database = firebase.database();
var milkImage;
var foodStock = 0;
var lastFed = {hour: undefined, minute: undefined, dayHalf: undefined, day: undefined};
var lastFedRefHour, lastFedRefMinute, lastFedRefDayHalf, gameStateRef;
var foodRef;
var feedButton, restockButton;
var foodObj;
var nameBox
var fed = "false"

function preload() {
	dogImg = loadImage('images/Dog.png');
	milkImage = loadImage('images/Milk.png');
	happyDogImg = loadImage('images/happydog.png');
}

function setup() {
	createCanvas(1000, 400);

	if(lastFed.hour = "undefined"){
		lastFed.hour = ""
		lastFed.minute = ""
		lastFed.dayHalf = ""
	}
	
	dogSprite = createSprite(800,162.5,150,150);
	dogSprite.addImage(dogImg);
	dogSprite.scale = 0.3;

	nameBox = createInput()
    nameBox.position(displayWidth/2 , 397.5);
    nameBox.style('width', '160px');
    nameBox.style('height', '30px'); 

	foodObj = new Food();

	foodRef = database.ref('Food');
	foodRef.on('value', getFoodStock);

	lastFedRefHour = database.ref('LastFeedTime/hour');
	lastFedRefHour.on('value', (data) => {
		lastFed.hour = data.val();
	});

	lastFedRefMinute = database.ref('LastFeedTime/minute');
	lastFedRefMinute.on('value', (data) => {
		lastFed.minute = data.val();
	});

	lastFedRefDayHalf = database.ref('LastFeedTime/DayHalf');
	lastFedRefDayHalf.on('value', (data) => {
		lastFed.dayHalf = data.val();
	});

	feedButton = createButton('Feed the dog');
	feedButton.position(250, 60);
	feedButton.style('width', '160px');
    feedButton.style('height', '30px'); 
	feedButton.mousePressed(feed);

	restockButton = createButton('Add Food');
	restockButton.position(420, 60);
	restockButton.style('width', '160px');
    restockButton.style('height', '30px'); 
	restockButton.mousePressed(restock);
}

function draw() {
	background(46,139,87);

	if(foodStock===0){
		dogSprite.addImage(dogImg)
	}

	drawSprites();

	stroke('#000000');
	fill('#000000');
	textSize(20);
	text('Food: ' + foodStock, 500, 30);

	/*
	if (hour() < lastFed.hour + 5) {
		dogSprite.addImage(happyDogImg);
	} else {
		dogSprite.addImage(dogImg);
	}
	*/

	text("Name of the dog - ",325,370)
	text("Hello, I am your pet dog " + nameBox.value() ,650,300)

	if(fed===true){
	text('Last Fed: ' + lastFed.hour + ':' + lastFed.minute + ' ' + lastFed.dayHalf, 700, 30);
	}
	foodObj.display();
}









function getFoodStock(data) {
	foodStock = data.val();
}

function feed() {
	foodStock = foodStock - 1;

	if (foodStock < 0) {
		console.log(alert('Error: You have no food. Please click on the "Add Food" button below'));
		foodStock++;
		return;
	}

	dogSprite.addImage(happyDogImg)
	fed=true

	lastFed.day = day();
	lastFed.hour = hour();

	if (lastFed.hour > 11) {
		lastFed.hour = lastFed.hour % 12;
		lastFed.dayHalf = 'PM';
		if (lastFed.hour === 0) {
			lastFed.hour = 12;
		}
	}
	lastFed.minute = minute();

	if (lastFed.minute < 10) {
		lastFed.minute = '0' + minute();
	}

	database.ref('/').update({
		Food: foodStock,
	});

	database.ref('LastFeedTime').update({
		hour: lastFed.hour,
		minute: lastFed.minute,
		DayHalf: lastFed.dayHalf,
		day: lastFed.day,
	});
}

function restock() {
	foodStock++;
	if (foodStock > 20) {
		foodStock -= 1;
		console.log(alert('Error: Cannot add more that 20 food to the stock'));
	}
	database.ref('/').update({
		Food: foodStock,
	});

	dogSprite.addImage(dogImg)

}

function updateGameState() {
	database.ref('/').update({
		GameState: gameState,
	});
}