

function ButtonGroup( base, options ){

	var
	baseEl = document.getElementById( base.elementId ),
	titleSpot = baseEl.querySelector( 'h3' ),
	selectedTitle = base.title

	// if( titleSpot ) titleSpot.innerHTML = base.title
	if( base.exclusive !== true && base.exclusive !== false ) base.exclusive = true
	base.isSelected = true
	base.toggle = function( e ){

		if( base.isSelected ) base.turnOff()
		else base.turnOn()
		if( e && e.preventDefault ) e.preventDefault()
	}
	base.turnOn = function(){

		if( typeof base.turnOnCallback === 'function' ) base.turnOnCallback()
		base.isSelected = true
	}
	base.turnOff = function(){

		if( typeof base.turnOffCallback === 'function' ) base.turnOffCallback()
		base.isSelected = false
	}
	base.reset = function(){

		options.forEach( function( option ){

			option.turnOff()
		})
		base.turnOn()
	}
	if( options instanceof Array === false ){

		options = []
		baseEl.addEventListener( 'click', base.toggle )
		baseEl.addEventListener( 'touchstart', base.toggle )
	}
	window[ base.elementId ] = base
	options.forEach( function( option ){

		var el = document.getElementById( option.elementId )

		option.isSelected = false
		option.toggle = function( e ){

			if( option.isSelected ) option.turnOff()
			else option.turnOn()
			if( e && e.preventDefault ) e.preventDefault()
		}
		option.turnOn = function(){

			if( base.exclusive === true ){

				base.turnOff()
				options.forEach( function( o ){ o.turnOff() })
				selectedTitle = option.title
				// titleSpot.innerHTML = selectedTitle
			}
			if( el ){

				el.classList.add( 'selected' )
				el.blur()
			}
			if( typeof option.turnOnCallback === 'function' ) option.turnOnCallback()
			option.isSelected = true
		}
		option.turnOff = function(){

			var lastAlive = true

			selectedTitle = base.title
			// titleSpot.innerHTML = selectedTitle
			if( el ) el.classList.remove( 'selected' )
			if( typeof option.turnOffCallback === 'function' ) option.turnOffCallback()
			option.isSelected = false
			options.forEach( function( o ){

				if( o.isSelected ) lastAlive = false
			})
			if( lastAlive ) base.turnOn()
		}
		if( el ){

			el.addEventListener( 'mouseenter', function(){

				// titleSpot.innerHTML = option.title
			})
			el.addEventListener( 'mouseleave', function(){

				// titleSpot.innerHTML = selectedTitle
			})
			el.addEventListener( 'click', option.toggle )
			el.addEventListener( 'touchstart', option.toggle )
		}
		window[ option.elementId ] = option
	})
}




    ////////////////
   //            //
  //   Styles   //
 //            //
////////////////


function styleReset(){//  Just as an all-out nice to have from the command line.

	cube.showExtroverts()
		.showIntroverts()
		.showPlastics()
		.showStickers()
		.hideFaceLabels()
		.hideIds()
		.hideTexts()
		.hideWireframes()
		.setOpacity()
		.setRadius()

	Array.prototype.slice.call( document.querySelectorAll( '.cubelet' )).forEach( function( e ){

		e.classList.remove( 'purty' )
	})
}
function createStyleButtons(){

	new ButtonGroup({

		title: 'Styles',//Stickers
		elementId: 'styles'

	},[
		{
			title: 'Grid',
			elementId: 'styleGrid',
			turnOnCallback: function(){

				cube.showWireframes()
					.hidePlastics()
					.hideStickers()
			},
			turnOffCallback: function(){

				cube.hideWireframes()
					.showPlastics()
					.showStickers()
			},
		},{

			title: 'Glass',
			elementId: 'styleGlass',
			turnOnCallback: function(){

				Array.prototype.slice.call( document.querySelectorAll( '.cubelet' )).forEach( function( e ){

					e.classList.add( 'purty' )
				})
			},
			turnOffCallback: function(){

				Array.prototype.slice.call( document.querySelectorAll( '.cubelet' )).forEach( function( e ){

					e.classList.remove( 'purty' )
				})
			}
		},{

			title: 'Text',
			elementId: 'styleText',
			turnOnCallback: function(){

				cube.hideStickers()
					.hidePlastics()
					.showTexts()
					//.setText('OMFG!')
			},
			turnOffCallback: function(){

				cube.showStickers()
					.showPlastics()
					.hideTexts()
			}
		}
	])
}




    //////////////////////
   //                  //
  //   Highlighters   //
 //                  //
//////////////////////


function createHighlightButtons(){

	function makeHighlighter( included ){

		return function(){

			var excluded = new ERNO.Group( cube.cubelets )

			excluded.remove( included )
			excluded.setOpacity( 0.15 )
			included.setOpacity()
		}
	}
	new ButtonGroup({

		title: 'Cubelets',//'All cubelets'
		elementId: 'highlights',
		turnOnCallback: makeHighlighter( cube )

	},[
		{
			title: 'Core',
			elementId: 'highlightCore',
			turnOnCallback: makeHighlighter( cube.core )
		},
		{
			title: 'Center cubelets',
			elementId: 'highlightCenters',
			turnOnCallback: makeHighlighter( cube.centers )
		},
		{
			title: 'Edge cubelets',
			elementId: 'highlightEdges',
			turnOnCallback: makeHighlighter( cube.edges )
		},
		{
			title: 'Corner cubelets',
			elementId: 'highlightCorners',
			turnOnCallback: makeHighlighter( cube.corners )
		},
		{
			title: 'Logo-face cubelets',
			elementId: 'highlightWhites',
			turnOnCallback: makeHighlighter( cube.hasColor( ERNO.RED ))
		}
	])
}




    ////////////////
   //            //
  //   Labels   //
 //            //
////////////////


function createLabelButtons(){

	new ButtonGroup({

		title: 'Labels',
		elementId: 'labels',
		exclusive: false

	},[
		{
			title: 'Faces',
			elementId: 'labelFaces',
			turnOnCallback:  function(){ cube.showFaceLabels() },
			turnOffCallback: function(){ cube.hideFaceLabels() }
		},
		{
			title: 'Numbers',
			elementId: 'labelNumbers',
			turnOnCallback:  function(){ cube.hideLogo(); cube.showIds() },
			turnOffCallback: function(){ cube.showLogo(); cube.hideIds() }
		}
	])
}




    /////////////////
   //             //
  //   Actions   //
 //             //
/////////////////


function createActionButtons(){

	new ButtonGroup({

		title: 'Ações',
		elementId: 'actions',
		exclusive: false

	},[
		{
			title: 'Rotacionar',
			elementId: 'actionRotate',
			turnOnCallback:  function(){ cube.autoRotate = true  },
			turnOffCallback: function(){ cube.autoRotate = false }
		},
		{
			title: 'Re-alinhar',
			elementId: 'actionRealign',
			turnOnCallback: function(){

				actionRotate.turnOff()
				realignCube()
				//setTimeout( function(){ actionRealign.turnOff() }, 1 )// Turned off in realignCube.
			}
		},
		{
			title: 'Embaralhar',
			elementId: 'actionShuffle',
			turnOnCallback:  function(){ cube.isShuffling = true  },
			turnOffCallback: function(){ cube.isShuffling = false }
		},
		{
			title: 'Desfazer',
			elementId: 'actionUndo',
			turnOnCallback:  function(){

				actionShuffle.turnOff()
				cube.taskQueue.add( function(){

					cube.undo()
					actionUndo.turnOff()
				})
			}
		},
		{
			title: 'Assistir & Aprender',
			elementId: 'actionDemo',
			turnOnCallback:  function(){ demoStart() },
			turnOffCallback: function(){ demoStop()  }
        },
        	{
			title: 'Resolver',
			elementId: 'actionSolve',
			turnOnCallback:  function(){
				realignCube()
				actionRotate.turnOff()
				cube.isShuffling = false
				cube.solve()
			}
		},
	])
}




    ////////////////
   //            //
  //   Others   //
 //            //
////////////////


function createOtherButtons(){

// 	new ButtonGroup({
//
// 		elementId: 'infoToggle',
// 		turnOnCallback: function(){
//
// 			document.getElementById( 'info' ).classList.add( 'show' )
// 			document.getElementById( 'infoToggle' ).src = 'assets/media/buttons/close.png'// bad form man!
// 		},
// 		turnOffCallback: function(){
//
// 			document.getElementById( 'info' ).classList.remove( 'show' )
// 			document.getElementById( 'infoToggle' ).src = 'assets/media/buttons/info.png'// bad form man!
// 		}
// 	})
	// infoToggle.turnOff()


	//  Invisible field at the bottom of the window
	//  that pulls of the navigation tray on mouse-over.

	document.getElementById( 'navRequester' ).addEventListener( 'mouseenter', function(){

		if( isDemoing === false ) document.querySelector( 'nav' ).classList.add( 'show' )
	})


	//  Enable the Chrome Cube Lab corner bug.

	Array.prototype.slice.call( document.querySelectorAll( '.chromeCubeLab' )).forEach( function( e ){

		function go( e ){

			window.open(
				'http://chrome.com/cubelab',
				'_blank',
				'resizable=yes, scrollbars=yes, titlebar=yes, menubar=yes, location=yes'
			)
			if( e && e.preventDefault ) e.preventDefault()
		}
		e.addEventListener( 'click', go )
		e.addEventListener( 'touchstart', go )
	})


	//  Let’s get social.
	//  (I’m not actually a big fan of social. I mean... who needs popularity, right?)

	Array.prototype.slice.call( document.querySelectorAll( '.share.facebook' )).forEach( function( e ){

		function go( e ){

			window.open(
				'https://www.facebook.com/sharer/sharer.php?u='+ escape( 'http://iamthecu.be' ),
				'facebook',
				'width=400,height=300,resizable=yes,scrollbars=yes,titlebar=yes,menubar=yes,location=yes'
			)
			if( e && e.preventDefault ) e.preventDefault()
		}
		e.addEventListener( 'click', go )
		e.addEventListener( 'touchstart', go )
	})
	Array.prototype.slice.call( document.querySelectorAll( '.share.twitter' )).forEach( function( e ){

		function go( e ){

			window.open(
				'https://twitter.com/share?text='+ escape( 'Rubik\'s Cube Explorer by @stewd_io:' ) +'&url=' + escape( 'http://iamthecu.be' ),
				'twitter',
				'width=500,height=300,resizable=yes,scrollbars=yes,titlebar=yes,menubar=yes,location=yes'
			)
			if( e && e.preventDefault ) e.preventDefault()
		}
		e.addEventListener( 'click', go )
		e.addEventListener( 'touchstart', go )
	})
	Array.prototype.slice.call( document.querySelectorAll( '.share.gplus' )).forEach( function( e ){

		function go( e ){

			window.open(
				'https://plus.google.com/share?url='+ escape( 'http://iamthecu.be' ),
				'gplus',
				'width=400,height=600,resizable=yes,scrollbars=yes,titlebar=yes,menubar=yes,location=yes'
			)
			if( e && e.preventDefault ) e.preventDefault()
		}
		e.addEventListener( 'click', go )
		e.addEventListener( 'touchstart', go )
	})
	Array.prototype.slice.call( document.querySelectorAll( '.share.tumblr' )).forEach( function( e ){

		function go( e ){

			window.open(
				'http://www.tumblr.com/share?v=3&u='+ escape( 'http://iamthecu.be' ) +'&t='+ escape( 'Rubik\'s Cube Explorer' ),
				'tumblr',
				'width=400,height=400,resizable=yes,scrollbars=yes,titlebar=yes,menubar=yes,location=yes'
			)
			if( e && e.preventDefault ) e.preventDefault()
		}
		e.addEventListener( 'click', go )
		e.addEventListener( 'touchstart', go )
	})
	Array.prototype.slice.call( document.querySelectorAll( '.share.email' )).forEach( function( e ){

		function go( e ){

			window.open(
				'mailto:?Subject='+ escape( 'Rubik\'s Cube Explorer' ) +'&Body='+ escape( 'http://iamthecu.be' ),
				'email',
				'width=400,height=300,resizable=yes,scrollbars=yes,titlebar=yes,menubar=yes,location=yes'
			)
			if( e && e.preventDefault ) e.preventDefault()
		}
		e.addEventListener( 'click', go )
		e.addEventListener( 'touchstart', go )
	})
}



