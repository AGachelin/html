export class Dice {
    #value;
	constructor(i, scene) {
		let cube;
		function loadModel(){
			this.cube = cube;
			this.cube.position.set(i-2, 0, 0);
			this.cube.scale.setScalar( 0.3 );
			scene.add(cube);
		  }
		this.manager = new THREE.LoadingManager( loadModel );
		const loader = new THREE.OBJLoader( this.manager );
		function onError() {}
		loader.load( '../decathlon/models/dice.obj', function ( obj ) {
			cube = obj;
		}, onProgress, onError );		
		this.#value = Math.floor(Math.random() * 6) + 1;
        this.locked = false;
		function onProgress( xhr ) {
			if ( xhr.lengthComputable ) {
				const percentComplete = xhr.loaded / xhr.total * 100;
				console.log( 'model ' + percentComplete.toFixed( 2 ) + '% downloaded' );
			}
		}
	}
	throw(show) { // this method must return the score of the dice
		this.#value = Math.floor(Math.random() * 6) + 1;
        return this.#value;
	}
}
