class Food {
	constructor() {}






	

	display() {

		var x=70, y=130


		if(this.foodStock!=0){
		for (var i = foodStock; i > 0; i = i - 1) {
			if(i===10){
				x=70
				y=y+80
			}
			image(milkImage, x,y, 70, 70);
			x=x+50
		}






	}
}













	getFoodStock(data) {
		foodStock = data.val();
	}

	updateFoodStock(foodVal) {
		database.ref('/').update({
			Food: foodVal,
		});
	}
}
