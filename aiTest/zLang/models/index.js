




class Model{

	constructor(){
		_.defaults(this, {
			thingsByName: {

			},
			thingsByDescription: {

			},
		})
	}
}

class Thing{

	constructor(){

	}

	addAssociation(){

	}

}


class Description{


}








class Word{

	constructor(text){
		_.defaults(this, {
			text: text
		})
	}

	isNoun(){
		return allNouns[this.text]
	}

}


