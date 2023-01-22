


function realignCube(){

	cube.rotation.x = cube.rotation.x % ( Math.PI * 2 )
	cube.rotation.y = cube.rotation.y % ( Math.PI * 2 )
	cube.rotation.z = cube.rotation.z % ( Math.PI * 2 )

	cube.isReady = false
	new TWEEN.Tween( cube.rotation )
		.to({

			x: (  20 ).degreesToRadians(),
			y: ( -30 ).degreesToRadians(),
			z: (   0 ).degreesToRadians()

		}, 1000 )
		.easing( TWEEN.Easing.Quadratic.Out )
		.start( cube.time )
	new TWEEN.Tween( cube.position )
		.to({

			y: 90,

		}, 1000 )
		.easing( TWEEN.Easing.Quadratic.Out )
		.onComplete( function(){

			cube.isReady = true
			actionRealign.turnOff()
		})
		.start( cube.time )
}




//  Take whatever’s in the twist history and undo it
//  and this should (in theory) bring us back to a solved cube.

function undoToZero(){

	actionShuffle.turnOff()
	cube.taskQueue.add( function(){

		cube.twistQueue.future = []
		cube.twistDuration = 50
	})
	if( cube.isSolved() === false ){

		twistHistoryLength = cube.twistQueue.history.length
		while( twistHistoryLength -- ){

			//  OMFG this is dirty. but solves a subtle logical flaw.
			//  Can’t use cube.undo() here because undo() would be 
			//  adding to the taskQueue AFTER shit below is being 
			//  added to the taskQueue. 
			//  That means it would set .future = [] BEFORE we actually call undo()!!!
			//cube.taskQueue.add( function(){ cube.undo() })
			
			var wasOk = false

			cube.taskQueue.add( function(){

				if( cube.twistQueue.history.length ){
				
					var move = cube.twistQueue.history.pop()

					cube.twistQueue.future = []//  We might have shit queued up.
					cube.twistQueue.add( move.getInverse())
					wasOk = true
				}

			}, function(){

				if( wasOk ) cube.twistQueue.history.pop()
			})
		}
	}


	//  Finally, make sure to reset the twistDuration,
	//  and make damn sure the queues are empty!

	cube.taskQueue.add( function(){

		cube.twistDuration = ERNO.Cube.prototype.twistDuration
		cube.twistQueue.history = []
		cube.historyQueue.history = []// WTF is this?!?!? Seems redundant and black magic!
	})
}




function demoStart( demo ){

	var 
	twistHistoryLength, 
	e,
	wasDemoing = isDemoing

	e = document.getElementById( 'alerts' )
	if( wasDemoing === false ){

		e.classList.add( 'show' )
		e.querySelector( 'p' ).innerHTML = 'Um momento, estamos carregando a apresentação.'
	}

	document.getElementById( 'actionDemo' ).classList.add( 'selected' )	
	document.querySelector( 'nav' ).classList.remove( 'show' )
	isDemoing = true
	idleSeconds = 0


	//  Let’s just tidy things up a bit.

	// styles.reset()
	// highlights.reset()
	// labels.reset()
	actionRotate.turnOff()
	actionRealign.turnOn()
	actionShuffle.turnOff()
	undoToZero()


	//  Kick off the demos.

	cube.taskQueue.add( function(){

		e.classList.remove( 'show' )
	})
	if( wasDemoing === false ) cube.taskQueue.addSleep( 500 )
	cube.taskQueue.add( function(){

		if( typeof demo === 'function' ) demo()
		else demoIntro()
	})
}
function demoStop(){
	
	var e

	e = document.getElementById( 'alerts' )
	e.classList.add( 'show' )
	e.querySelector( 'p' ).innerHTML = 'Finalizando a Apresentação...'


	//  First step: clear out future tasks!

	cube.taskQueue.future = []

	
	//  Reset all the boards.
	
	cube.taskQueue.add( function(){

		function killBoard( board ){

			board.textify.kill = true
			board.innerHTML = ''
			setTimeout( function(){

				board.textify.kill = false
				board.innerHTML = ''

			}, 500 )
		}
		killBoard( boardUp )
		killBoard( boardRight )
		killBoard( boardDown )
		killBoard( boardLeft )
	})


	//  Put the Cube back in working order.

	cube.taskQueue.add( function(){

		cube.twistDuration        = ERNO.Cube.prototype.twistDuration
		cube.opacityTweenDuration = ERNO.Cube.prototype.opacityTweenDuration
		cube.radiusTweenDuration  = ERNO.Cube.prototype.radiusTweenDuration
		styleReset()
		// styles.reset()
		// highlights.reset()
		// labels.reset()
		realignCube()
		idleSeconds = 0
	})


	//  Unscramble back to a (hopefully) solved state.

	cube.taskQueue.add( undoToZero )


	//  Final hand-off back to normal state.

	cube.taskQueue.add( function(){

		cube.taskQueue.history = []
		isDemoing = false
		document.getElementById( 'actionDemo' ).classList.remove( 'selected' )
		actionDemo.isSelected = false
		document.querySelector( 'nav' ).classList.add( 'show' )
		e.classList.remove( 'show' )
	})
}








function demoIntro(){

	cube.taskQueue.add( function(){

		boardRight.textify.write( 'Olá.' )
	})
	cube.taskQueue.addSleep( 2000 )
	cube.taskQueue.add( function(){

		boardRight.textify.write( 'Eu sou\no Cubo.' )
	})
	cube.taskQueue.addSleep( 2000 )
	cube.taskQueue.add( function(){

		boardRight.textify.erase()
		demoCubelets()
	})
}




function demoCubelets(){

	cube.taskQueue.add( function(){

		boardLeft.textify.write( 'Sou feito\nde 26\ncubinhos...' )
		cube.core.setOpacity( 0 )
	})
	cube.taskQueue.addSleep( 2000 )
	cube.taskQueue.add( function(){

		var targetY = cube.position.y + 600

		cube.isReady = false
		new TWEEN.Tween( cube.position )
			.to({

				y: targetY

			}, 400 )
			.easing( TWEEN.Easing.Quadratic.Out )
			.onComplete( function(){

				cube.isReady = true
			})
			.start( cube.time )
	},
	function(){

		var targetY = cube.position.y - 600

		cube.isReady = false
		new TWEEN.Tween( cube.position )
			.to({

				y: targetY

			}, 400 )
			.easing( TWEEN.Easing.Quadratic.In )
			.onComplete( function(){

				cube.isReady = true
			})
			.start( cube.time )
	},
	function(){

		var 
		targetX = cube.rotation.x + Math.PI * 2,
		targetY = cube.rotation.y + Math.PI * 2

		//labelNumbers.turnOn()
		cube.cubelets.forEach( function( cubelet ){

			cubelet.setRadius(( 600 ).random( 1600 ))
		})
		cube.isReady = false		
		new TWEEN.Tween( cube.rotation )
			.to({

				y: targetY,

			}, 6000 )
			.easing( TWEEN.Easing.Quadratic.InOut )
			.onComplete( function(){

				cube.isReady = true
			})
			.start( cube.time )

		new TWEEN.Tween( cube.rotation )
			.to({

				x: targetX

			}, 4000 )
			.easing( TWEEN.Easing.Quartic.InOut )
			.onComplete( function(){

				cube.isReady = true
			})
			.delay( 2000 )
			.start( cube.time )
	},
	function(){

		var 
		included = new ERNO.Group( cube.core ),
		excluded = new ERNO.Group( cube.cubelets )

		cube.opacityTweenDuration = 2000
		excluded.remove( included )
		excluded.setOpacity( 0 )
		included.setOpacity()

		boardLeft.textify.erase()
		boardRight.textify.write( 'Todos eles\nmontados\nao redor do\nmeu núcleo.' )
	})
	cube.taskQueue.addSleep( 4000 )
	cube.taskQueue.add( function(){

		cube.opacityTweenDuration = 500
		boardRight.textify.erase()
	})
	cube.taskQueue.addSleep( 1000 )
	cube.taskQueue.add( function(){

		demoCenters()
	})
}




function demoCenters(){

	cube.taskQueue.add( function(){

		boardLeft.textify.write( '6 deles\nsão\ncentros.' )
		cube.centers.setRadius().setOpacity()
	})
	cube.taskQueue.addSleep( 1000 )
	cube.taskQueue.add( function(){

		var 
		included = new ERNO.Group( cube.centers, cube.core ),
		excluded = new ERNO.Group( cube.cubelets )

		excluded.remove( included )
		excluded.setOpacity( 0 )
		included.setOpacity()
	})	
	cube.taskQueue.add( function(){

		boardLeft.textify.erase()
		boardRight.textify.write( 'Um centro\npara cada\num dos\nmeus lados.' )
	})
	cube.taskQueue.addSleep( 3000 )
	cube.taskQueue.add( function(){

		var 
		targetY = cube.rotation.y + Math.PI * 2,
		targetZ = cube.rotation.z - Math.PI * 2
		
		cube.isReady = false
		new TWEEN.Tween( cube.rotation )
			.to({

				y: targetY,
				z: targetZ,

			}, 4000 )
			.easing( TWEEN.Easing.Quadratic.InOut )
			.onComplete( function(){

				cube.isReady = true
			})
			.start( cube.time )
	})
	cube.taskQueue.addSleep( 1000 )
	cube.taskQueue.add( function(){

		boardRight.textify.write( 'Os centros\ngiram, mas\nsempre serão\ncentros.' )
		cube.twistDuration = 1000
		cube.twistQueue.add( 'URsbBSru' )
	})
	cube.taskQueue.addSleep( 1000 )
	cube.taskQueue.add( function(){

		cube.twistDuration = 500
		boardRight.textify.erase()
	})
	cube.taskQueue.addSleep( 2000 )
	cube.taskQueue.add( function(){

		demoEdges()
	})
}




function demoEdges(){

	cube.taskQueue.add( function(){
	
		var group = new ERNO.Group( cube.core, cube.centers )

		cube.edges.setRadius().setOpacity()
		cube.opacityTweenDuration = 1500
		group.setOpacity( 0.15 )
		boardLeft.textify.write( '12 deles\nsão\nbordas.' )
		cube.radiusTweenDuration = 500
	})
	cube.taskQueue.addSleep( 2000 )
	cube.taskQueue.add( function(){

		var 
		included = new ERNO.Group( cube.front.east ),
		excluded = new ERNO.Group( cube.edges )

		excluded.remove( included )
		included.setOpacity().setRadius( 360 )
		excluded.setOpacity( 0.15 )
		boardLeft.textify.erase()
		boardRight.textify.write( 'Cada borda tem\n2 cores, como\nesta aqui:' )
	})
	cube.taskQueue.addSleep( 2000 )
	cube.taskQueue.add( function(){

		cube.front.east.setRadius()
		boardRight.textify.write( 'E cada\nborda pode\nrotacionar \nem 2 eixos.' )
		cube.twistDuration = 1000
	})
	cube.taskQueue.addSleep( 1000 )
	cube.taskQueue.add( function(){

		cube.radiusTweenDuration = 100
		cube.twistQueue.add( 'RrfF' )
	})
	cube.taskQueue.addSleep( 1000 )
	cube.taskQueue.add( function(){

		var 
		included = new ERNO.Group( cube.cubelets ),
		excluded = new ERNO.Group( cube.corners )

		included.remove( excluded )
		included.setOpacity( 0.15 )	
		boardLeft.textify.erase()
		boardRight.textify.erase()
	})
	cube.taskQueue.addSleep( 1000 )
	cube.taskQueue.add( function(){

		demoCorners()
	})
}




function demoCorners(){

	cube.taskQueue.add( function(){
	
		boardLeft.textify.write( 'Por fim,\ntenho 8\n\cubinhos\nde canto.' )
		cube.corners.setRadius().setOpacity()		
	})
	cube.taskQueue.addSleep( 2000 )
	cube.taskQueue.add( function(){

		cube.front.east.setRadius()
		boardLeft.textify.erase()
		boardRight.textify.write( 'Cada\ncanto\ntem 3 cores.' )

		var 
		included = new ERNO.Group( cube.front.northEast ),
		excluded = new ERNO.Group( cube.corners )

		excluded.remove( included )
		cube.radiusTweenDuration = 500
		included.setOpacity().setRadius( 120 )
		excluded.setOpacity( 0.15 )
	})
	cube.taskQueue.addSleep( 3000 )
	cube.taskQueue.add( function(){

		cube.front.northEast.setRadius()
		boardRight.textify.write( 'Cantos\nrotacionam \nem 3 eixos.' )
	})
	cube.taskQueue.addSleep( 2000 )
	cube.taskQueue.add( function(){

		cube.twistQueue.add( 'RrfFUu' )
	})
	cube.taskQueue.addSleep( 1000 )
	cube.taskQueue.add( function(){

		cube.setOpacity()
		boardLeft.textify.erase()
		boardRight.textify.erase()
	})
	cube.taskQueue.addSleep( 1000 )
	cube.taskQueue.add( function(){

		cube.radiusTweenDuration = 100
		demoStats()
	})
}




function demoStats(){

	cube.taskQueue.add( function(){
	
		boardRight.textify.write( 'Eu posso\nembaralhar em\n43 quintilhões\nde posições.' )
	})
	cube.taskQueue.addSleep( 4000 )
	cube.taskQueue.add( function(){
	
		cube.twistDuration = 300
		cube.twistQueue.add( 'luLUrdRD'.multiply( 2 ))
	})
	cube.taskQueue.add( function(){
	
		boardRight.textify.erase()
		boardLeft.textify.write( 'Isso é 43\nseguido\npor 18\nzeros.' )
		cube.twistQueue.add( 'luLUrdRD' )
		cube.taskQueue.addSleep( 8500 )
	})
	cube.taskQueue.add( function(){
	
		boardLeft.textify.erase()
		boardRight.textify.write( 'Isso é +\nque o número\nde websites\nna internet.' )
		cube.twistQueue.add( 'luLUrdRD' )
		cube.taskQueue.addSleep( 8500 )
	})
	cube.taskQueue.add( function(){

		boardRight.textify.write( 'Mas posso ser\nresolvido com\napenas 20\nmovimentos.' )
		cube.twistQueue.add( 'luLUrdRD' )
		cube.taskQueue.addSleep( 7000 )
	})
	cube.taskQueue.add( function(){
	
		boardRight.textify.erase()
		boardDown.textify.write( 'Sim, é sério isso!' )
		cube.twistQueue.add( 'luLUrdRD' )
		cube.taskQueue.addSleep( 2500 )
	})
	cube.taskQueue.add( function(){
	
		boardDown.textify.erase()
	})
	cube.taskQueue.add( function(){

		var targetY = cube.position.y + 600

		cube.isReady = false
		new TWEEN.Tween( cube.position )
			.to({

				y: targetY

			}, 400 )
			.easing( TWEEN.Easing.Quadratic.Out )
			.onComplete( function(){

				cube.isReady = true
			})
			.start( cube.time )
	},
	function(){

		var targetY = cube.position.y - 600

		cube.isReady = false
		new TWEEN.Tween( cube.position )
			.to({

				y: targetY

			}, 400 )
			.easing( TWEEN.Easing.Bounce.Out )
			.onComplete( function(){

				cube.isReady = true
			})
			.start( cube.time )
	
	}, demoStop )
}




function demoFaces(){

	cube.taskQueue.add( function(){
		cube.isReady = false
		setTimeout( function(){
			
			cube.showFaceLabels()

		}, 1500 )
		setTimeout( function(){

			cube.isReady = true
		
		}, 2000 )
	},
	function(){

		var
		targetX = cube.rotation.x + Math.PI * 2,
		targetY = cube.rotation.y + Math.PI * 2,
		boardRight = document.getElementById( 'boardRight' )

		cube.isReady = false		
		new TWEEN.Tween( cube.rotation )
			.to({

				y: targetY,

			}, 1000 * 6 )
			.easing( TWEEN.Easing.Quadratic.InOut )
			.onComplete( function(){

				cube.hideFaceLabels()
				cube.isReady = true
			})
			.start( cube.time )

		new TWEEN.Tween( cube.rotation )
			.to({

				x: targetX

			}, 1000 * 3 )
			.easing( TWEEN.Easing.Quartic.InOut )
			.onComplete( function(){

				cube.isReady = true
			})
			.delay( 3000 )
			.start( cube.time )
	})
}




function demoAlgos(){}



function demoTexts(){


	cube.taskQueue.add( function(){

		cube.hideStickers()
			.hidePlastics()
			.showTexts()
			.setText('OMFG!')
	})
}