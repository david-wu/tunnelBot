
import _ from 'lodash';

import allNouns from './data/allNouns.js';


function App(){


	return {


		init: function(){



			const texts = [
				'Howard'
			]



			const emptyModel = {
				things: {},
			};

			const populatedModel = _.reduce(texts, function(model, text){


				const words = text.split(' ')
				const myNouns = _.filter(words, function(word){
					return allNouns[word]
				})


				_.each(myNouns, function(noun){
					model.things[noun] = {}
				})

				return model;
			}, emptyModel)

			console.log(populatedModel)




		}

	}

}






module.exports = App