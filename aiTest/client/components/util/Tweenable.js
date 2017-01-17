const TWEEN = require('tween.js');
const Placeable = require('./Placeable.js')


// Tweenable should extend renderable
class Tweenable extends Placeable{
	constructor(options){
		super();
		_.extend(this, options);
		_.defaults(this, {
			tweenStyle: 'dramatic'
		});
	}

	tweenToAbsPos(){
		// TODO: For shuffling, should still animate
		if(_.isMatch(this.absPos, this.mesh.position)){
			return;
		}

		const tweenNames = {
			normal: this.tweenTo,
			shuffle: this.tweenToAbsPosShuffle,
			dramatic: this.tweenToAbsPosDramatic,
		}
		return tweenNames[this.tweenStyle].call(this);
	}

	tweenToAbsPosShuffle(){
		const leftOrRight = (_.random()*2)-1;
		return this.tweenToWithHalfPoint({
			x: (30*leftOrRight) + this.mesh.position.x+(this.absPos.x-this.mesh.position.x)/2,
			y: this.mesh.position.y+(this.absPos.y-this.mesh.position.y)/2,
			z: this.mesh.position.z+(this.absPos.z-this.mesh.position.z)/2,
		})
	}

	tweenToAbsPosDramatic(){
		return this.tweenToWithHalfPoint({
			x: this.mesh.position.x+(this.absPos.x-this.mesh.position.x)/2,
			y: this.mesh.position.y+(this.absPos.y-this.mesh.position.y)/2,
			z: 100+this.mesh.position.z+(this.absPos.z-this.mesh.position.z)/2,
		})
	}

	tweenRotation(){
		const targetRotation = {
			z: this.absPos.angle*Math.PI/180,
			[this.getFlipAxis()]: this.faceUp ? 0 : (Math.PI),
		}
		this.tweenTo({
			start: this.mesh.rotation,
			end: targetRotation,
			easing: 'Linear.None',
			delay: 200,
		})
	}

	tweenToWithHalfPoint(halfPoint){
		return this.tweenTo({
				end: halfPoint,
				easing: 'Sinusoidal.In'
			})
			.then(()=>{
				return this.tweenTo({
					easing: 'Sinusoidal.Out'
				})
			})
	}

	tweenTo(options){
		options = _.defaults(options, {
			start: this.mesh.position,
			end: this.absPos,
			easing: 'Linear.None',
			tweenTime: 400,
			delay: 0,
			randomFactor: 50
		})
		return new Promise((resolve, reject)=>{
			setTimeout(function(){
				new TWEEN.Tween(options.start)
					.to(options.end, options.tweenTime)
					.easing(_.get(TWEEN.Easing, options.easing))
					.onComplete(resolve)
					.start();
			}, options.delay+(options.randomFactor*Math.random()))
		})
	}

	getFlipAxis(){
		if(45 < this.absPos.angle && this.absPos.angle < 135){
			return 'x'
		}
		if(225 < this.absPos.angle && this.absPos.angle < 315){
			return 'x'
		}
		return 'y'
	}

}

module.exports = Tweenable;