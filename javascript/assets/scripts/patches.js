    ////////////////
   //            //
  //   Custom   //
 //            //
////////////////

notationToERNO = function (notation) {
    switch (notation) {
        case "D":
            return ERNO.WHITE;
            break;
        case "U":
            return ERNO.YELLOW;
            break;
        case "F":
            return ERNO.RED;
            break;
        case "B":
            return ERNO.ORANGE;
            break;
        case "L":
            return ERNO.BLUE;
            break;
        case "R":
            return ERNO.GREEN;
            break;

        default:
            return ERNO.COLORLESS;
            break;
    }
};

name2Notation = function (obj) {
    switch (obj.name.toUpperCase()) {
        case "WHITE":
            return "D";
            break;
        case "YELLOW":
            return "U";
            break;
        case "RED":
            return "F";
            break;
        case "ORANGE":
            return "B";
            break;
        case "BLUE":
            return "L";
            break;
        case "GREEN":
            return "R";
            break;

        default:
            return "P";
            break;
    }
};

translateTwist = function (str) {
    let i = 0, twists = "";

    str.split(" ").filter((twist) => {
        if (twist.includes("'"))
            twist = twist.replace("'", "").toLowerCase();

        if (twist.includes("2"))
            twist = twist.replace("2", "").repeat(2);

        i++;
        twists += twist;
    });

    console.log(`${str} (${i} moves)`);
    cube.twist(twists);
};

    /////////////
   //         //
  //  Queue  //
 //         //
/////////////


//  Before we create the cube it’s a good idea to
//  patch our Queue function with this awesome shorthand.
//  (This makes writing Demos that much easier!)

ERNO.Queue.prototype.addSleep = function( t ){

	var that = this

	this.add( function(){

		that.isReady = false
		setTimeout( function(){ that.isReady = true }, t )
	})
}




    ///////////////
   //           //
  //  Cubelet  //
 //           //
///////////////


//  Patch every Cubelet’s .setOpacity() method
//  to use a custom Cube property for scale
//  so we can adjust opacity tween lengths on the fly later.

ERNO.Cubelet.prototype.setOpacity = function( opacityTarget, onComplete ){

	if( this.opacityTween ) this.opacityTween.stop()
	if( opacityTarget === undefined ) opacityTarget = 1
	if( opacityTarget !== this.opacity ){

		var
		that = this,
		tweenDuration = ( opacityTarget - this.opacity ).absolute().scale( 0, 1, 0, this.cube.opacityTweenDuration )

		this.opacityTween = new TWEEN.Tween({ opacity: this.opacity })
			.to({

				opacity: opacityTarget

			}, tweenDuration )
			.easing( TWEEN.Easing.Quadratic.InOut )
			.onUpdate( function(){

				that.css3DObject.element.style.opacity = this.opacity
				that.opacity = this.opacity
			})
			.onComplete( function(){

				if( onComplete instanceof Function ) onComplete()
			})
			.start( cube.time )
	}
}


//  Patch every Cubelet’s .setRadius() method
//  to use a custom Cube property for scale
//  so we can adjust radius tween lengths on the fly later.

ERNO.Cubelet.prototype.setRadius = function( radius, onComplete ){


	//  It's a shame that we can't do this whilst tweening
	//  but it's because the current implementation is altering the actual X, Y, Z
	//  rather than the actual radius. Can fix later.
	//  Current may produce unexpected results while shuffling. For example:
	//    cube.corners.setRadius( 90 )
	//  may cause only 4 corners instead of 6 to setRadius()
	//  because one side is probably engaged in a twist tween.

	if( this.isTweening === false ){

		radius = radius || 0
		if( this.radius === undefined ) this.radius = 0
		if( this.radius !== radius ){

			var
			tweenDuration = ( this.radius - radius ).absolute().scale( 0, 100, 0, this.cube.radiusTweenDuration ),
			obj = { radius:this.radius }

			this.isTweening = true
			new TWEEN.Tween( obj )
				.to( { radius: radius }, tweenDuration )
				.easing( TWEEN.Easing.Quartic.Out )
				.onUpdate( function(){

					this.position.set(

						this.addressX.multiply( this.size + obj.radius  ) + 0.2,
						this.addressY.multiply( this.size + obj.radius  ) + 0.2,
						this.addressZ.multiply( this.size + obj.radius  ) + 0.2
					)
					this.updateMatrix()
					this.matrixSlice.copy( this.matrix )
					this.radius = obj.radius

				}.bind( this ))
				.onComplete( function(){

					this.isTweening = false
					this.position.set(

						this.addressX.multiply( this.size + obj.radius  ) + 0.2,
						this.addressY.multiply( this.size + obj.radius  ) + 0.2,
						this.addressZ.multiply( this.size + obj.radius  ) + 0.2
					)
					this.updateMatrix()
					this.matrixSlice.copy( this.matrix )
					this.radius = obj.radius
					if( onComplete instanceof Function ) onComplete()

				}.bind( this ))
				.start( this.cube.time )
		}
	}
}


//  What does this Cubelet look like?
//  (In ASCII-art form!)

ERNO.Cubelet.prototype.inspect = function( face ){

	if( face !== undefined ){


		//  Just a particular face's color -- called by Slice's inspector.

		return this[ face ].color || '!'
	}
	else {


		//  Full on ASCII-art inspection mode -- with console colors!

		var
		that    = this,
		id      = this.id,
		address = this.address,
		type    = this.type,
		color   = this.cube.color,
		LEFT    = 0,
		CENTER  = 1,
		getColorName = function( face, justification, minimumLength ){

			var colorName = that[ face ].color.name.toUpperCase()

			if( justification !== undefined && minimumLength !== undefined ){

				if( justification === CENTER ) colorName = colorName.justifyCenter( minimumLength )
				else if( justification === LEFT ) colorName = colorName.justifyLeft( minimumLength )
			}
			return colorName
		}

		if( id < 10 ) id = '0' + id
		if( address < 10 ) address = '0' + address
		console.log(

			'\n    ID         '+ id +
			'\n    Type       '+ type.toUpperCase() +'\n'+

			'\n    Address    '+ address +
			'\n    Address X  '+ this.addressX.toSignedString() +
			'\n    Address Y  '+ this.addressY.toSignedString() +
			'\n    Address Z  '+ this.addressZ.toSignedString() +'\n'+

			'\n    Engaged X  '+ this.isEngagedX +
			'\n    Engaged Y  '+ this.isEngagedY +
			'\n    Engaged Z  '+ this.isEngagedZ +
			'\n    Tweening   '+ this.isTweening +'\n'+

			'\n%c 0  Front      '+ getColorName( 'front', LEFT, 7 ) +'%c'+
			'\n%c 1  Up         '+ getColorName( 'up',    LEFT, 7 ) +'%c'+
			'\n%c 2  Right      '+ getColorName( 'right', LEFT, 7 ) +'%c'+
			'\n%c 3  Down       '+ getColorName( 'down',  LEFT, 7 ) +'%c'+
			'\n%c 4  Left       '+ getColorName( 'left',  LEFT, 7 ) +'%c'+
			'\n%c 5  Back       '+ getColorName( 'back',  LEFT, 7 ) +'%c\n' +

			'\n              -----------  %cback%c'+
			'\n            /    %cup%c     /|  %c5%c'+
			'\n           /     %c1%c     / | %c'+ getColorName( 'back' ) +'%c'+
			'\n          /%c'+ getColorName( 'up', CENTER, 11 ) +'%c/  |'+
			'\n  %cleft%c    -----------   %cright%c'+
			'\n   %c4%c     |           |   %c2%c'+
			'\n%c'+ getColorName( 'left', CENTER, 8 ) +'%c |   %cfront%c   |  %c'+ getColorName( 'right' ) +'%c'+
			'\n         |     %c0%c     |  /'+
			'\n         |%c'+ getColorName( 'front', CENTER, 11 ) +'%c| /'+
			'\n         |           |/'+
			'\n          -----------'+
			'\n               %cdown%c'+
			'\n                %c3%c'+
			'\n           %c'+ getColorName( 'down', CENTER, 11 ) +'%c\n',

			this.front.color.styleB, '',
			this.up.color.styleB,    '',
			this.right.color.styleB, '',
			this.down.color.styleB,  '',
			this.left.color.styleB,  '',
			this.back.color.styleB,  '',

			this.back.color.styleF,  '',
			this.up.color.styleF,    '',
			this.back.color.styleF,  '',
			this.up.color.styleF,    '',
			this.back.color.styleF,  '',
			this.up.color.styleF,    '',
			this.left.color.styleF,  '',
			this.right.color.styleF, '',
			this.left.color.styleF,  '',
			this.right.color.styleF, '',
			this.left.color.styleF,  '',
			this.front.color.styleF, '',
			this.right.color.styleF, '',
			this.front.color.styleF, '',
			this.front.color.styleF, '',
			this.down.color.styleF,  '',
			this.down.color.styleF,  '',
			this.down.color.styleF,  ''
		)
	}
}




    /////////////
   //         //
  //  Group  //
 //         //
/////////////


//  Ok. So now we have to patch 'hasProperty'
//  because the minified seems to have borked it.
//  Also, because our inheritence chain is also borked
//  we have to manually assign it to both Groups and Slices.

ERNO.Group.prototype.hasProperty = ERNO.Slice.prototype.hasProperty = function( property, value ){

	var results = new ERNO.Group()

	this.cubelets.forEach( function( cubelet ){

		if( cubelet[ property ] === value ) results.add( cubelet )
	})
	return results
}


//  It’s a shame we lost all our inspectors in the final version.
//  Let’s add them back in.

ERNO.Group.prototype.inspect = function( face ){

	this.cubelets.forEach( function( cubelet ){

		cubelet.inspect( face )
	})
	return this
}




    /////////////
   //         //
  //  Slice  //
 //         //
/////////////


ERNO.Slice.prototype.inspect = function( type, side ){

	var
	getColorName = function( cubelet ){

		return cubelet[ side ].color.name.toUpperCase().justifyCenter( 9 )
	},
	sideLabel = ''

	if( side === undefined ){

		if( this.face !== undefined ) side = this.face
        else side = 'front'
	}
	if( side instanceof ERNO.Direction ) side = side.name
    if (side !== this.face) sideLabel = side + 's'

    if (["front", "up", "right"].indexOf(this.face) >= 0) {
        return (cube.state.array[name2Notation(this.origin[side].color)] = [
            name2Notation(this.northWest[side].color), // 0
            name2Notation(this.north[side].color), // 1
            name2Notation(this.northEast[side].color), // 3

            name2Notation(this.west[side].color), // 4
            name2Notation(this.origin[side].color), // 5
            name2Notation(this.east[side].color), // 6

            name2Notation(this.southWest[side].color), // 7
            name2Notation(this.south[side].color), // 8
            name2Notation(this.southEast[side].color), // 9
        ]);
    } else if (["left", "back"].indexOf(this.face) >= 0) {
        return (cube.state.array[name2Notation(this.origin[side].color)] = [
            name2Notation(this.northEast[side].color), // 3
            name2Notation(this.east[side].color), // 6
            name2Notation(this.southEast[side].color), // 9

            name2Notation(this.north[side].color), // 1
            name2Notation(this.origin[side].color), // 5
            name2Notation(this.south[side].color), // 8

            name2Notation(this.northWest[side].color), // 0
            name2Notation(this.west[side].color), // 4
            name2Notation(this.southWest[side].color) // 7
        ]);
    } else {
        return (cube.state.array[name2Notation(this.origin[side].color)] = [
            name2Notation(this.southWest[side].color), // 7
            name2Notation(this.west[side].color), // 4
            name2Notation(this.northWest[side].color), // 0

            name2Notation(this.south[side].color), // 8
            name2Notation(this.origin[side].color), // 5
            name2Notation(this.north[side].color), // 1

            name2Notation(this.southEast[side].color), // 9
            name2Notation(this.east[side].color), // 6
            name2Notation(this.northEast[side].color) // 3
        ]);
    }

	if( compact ){

		console.log(

			'\n' + this.name.capitalize().justifyLeft( 10 ) +
			'%c '+ this.northWest.id.toPaddedString( 2 ) +' %c '+
			'%c '+ this.north.id.toPaddedString( 2 ) +' %c '+
			'%c '+ this.northEast.id.toPaddedString( 2 ) +' %c '+
			'\n' + sideLabel +'\n'+

			'          %c '+ this.west.id.toPaddedString( 2 ) +' %c '+
			'%c '+ this.origin.id.toPaddedString( 2 ) +' %c '+
			'%c '+ this.east.id.toPaddedString( 2 ) +' %c '+
			'\n\n'+
			'          %c '+ this.southWest.id.toPaddedString( 2 ) +' %c '+
			'%c '+ this.south.id.toPaddedString( 2 ) +' %c '+
			'%c '+ this.southEast.id.toPaddedString( 2 ) +' %c '+
			'\n',

			this.northWest  [side].color.styleB, '',
			this.north      [side].color.styleB, '',
			this.northEast  [side].color.styleB, '',

			this.west       [side].color.styleB, '',
			this.origin     [side].color.styleB, '',
			this.east       [side].color.styleB, '',

			this.southWest  [side].color.styleB, '',
			this.south      [side].color.styleB, '',
			this.southEast  [side].color.styleB, ''
        )
	}
	else {

		console.log(

			'\n          %c           %c %c           %c %c           %c '+
			'\n'+ this.name.capitalize().justifyLeft( 10 ) +
			'%c northWest %c '+
			'%c   north   %c '+
			'%c northEast %c '+
			'\n' + sideLabel.justifyLeft( 10 ) +
			'%c '+ this.northWest.id.toPaddedString( 2 ).justifyCenter( 9 ) +' %c '+
			'%c '+ this.north.id.toPaddedString( 2 ).justifyCenter( 9 ) +' %c '+
			'%c '+ this.northEast.id.toPaddedString( 2 ).justifyCenter( 9 ) +' %c '+
			'\n' +
			'          %c ' + getColorName( this.northWest ) +' %c '+
			'%c '+ getColorName( this.north ) +' %c '+
			'%c '+ getColorName( this.northEast ) +' %c '+
			'\n          %c           %c %c           %c %c           %c '+


			'\n\n          %c           %c %c           %c %c           %c '+
			'\n          %c    west   %c '+
			'%c   origin  %c '+
			'%c    east   %c '+
			'\n' +
			'          %c ' + this.west.id.toPaddedString( 2 ).justifyCenter( 9 ) +' %c '+
			'%c '+ this.origin.id.toPaddedString( 2 ).justifyCenter( 9 ) +' %c '+
			'%c '+ this.east.id.toPaddedString( 2 ).justifyCenter( 9 ) +' %c '+
			'\n' +
			'          %c ' + getColorName( this.west ) +' %c '+
			'%c '+ getColorName( this.origin ) +' %c '+
			'%c '+ getColorName( this.east ) +' %c '+
			'\n          %c           %c %c           %c %c           %c '+


			'\n\n          %c           %c %c           %c %c           %c '+
			'\n          %c southWest %c '+
			'%c   south   %c '+
			'%c southEast %c '+
			'\n' +
			'          %c ' + this.southWest.id.toPaddedString( 2 ).justifyCenter( 9 ) +' %c '+
			'%c '+ this.south.id.toPaddedString( 2 ).justifyCenter( 9 ) +' %c '+
			'%c '+ this.southEast.id.toPaddedString( 2 ).justifyCenter( 9 ) +' %c '+
			'\n' +
			'          %c ' + getColorName( this.southWest ) +' %c '+
			'%c '+ getColorName( this.south ) +' %c '+
			'%c '+ getColorName( this.southEast ) +' %c '+
			'\n          %c           %c %c           %c %c           %c\n',


			this.northWest[ side ].color.styleB, '',
			this.north[     side ].color.styleB, '',
			this.northEast[ side ].color.styleB, '',
			this.northWest[ side ].color.styleB, '',
			this.north[     side ].color.styleB, '',
			this.northEast[ side ].color.styleB, '',
			this.northWest[ side ].color.styleB, '',
			this.north[     side ].color.styleB, '',
			this.northEast[ side ].color.styleB, '',
			this.northWest[ side ].color.styleB, '',
			this.north[     side ].color.styleB, '',
			this.northEast[ side ].color.styleB, '',
			this.northWest[ side ].color.styleB, '',
			this.north[     side ].color.styleB, '',
			this.northEast[ side ].color.styleB, '',

			this.west[      side ].color.styleB, '',
			this.origin[    side ].color.styleB, '',
			this.east[      side ].color.styleB, '',
			this.west[      side ].color.styleB, '',
			this.origin[    side ].color.styleB, '',
			this.east[      side ].color.styleB, '',
			this.west[      side ].color.styleB, '',
			this.origin[    side ].color.styleB, '',
			this.east[      side ].color.styleB, '',
			this.west[      side ].color.styleB, '',
			this.origin[    side ].color.styleB, '',
			this.east[      side ].color.styleB, '',
			this.west[      side ].color.styleB, '',
			this.origin[    side ].color.styleB, '',
			this.east[      side ].color.styleB, '',

			this.southWest[ side ].color.styleB, '',
			this.south[     side ].color.styleB, '',
			this.southEast[ side ].color.styleB, '',
			this.southWest[ side ].color.styleB, '',
			this.south[     side ].color.styleB, '',
			this.southEast[ side ].color.styleB, '',
			this.southWest[ side ].color.styleB, '',
			this.south[     side ].color.styleB, '',
			this.southEast[ side ].color.styleB, '',
			this.southWest[ side ].color.styleB, '',
			this.south[     side ].color.styleB, '',
			this.southEast[ side ].color.styleB, '',
			this.southWest[ side ].color.styleB, '',
			this.south[     side ].color.styleB, '',
			this.southEast[ side ].color.styleB, ''
		)
	}
}




    ////////////
   //        //
  //  Cube  //
 //        //
////////////


//  It’s good to have some reasonable defaults, eh?
//  Plus we can make changes value on the Cube instance
//  during a demo and revert to these later :)

ERNO.Cube.prototype.opacityTweenDuration = 200
ERNO.Cube.prototype.radiusTweenDuration = 100
ERNO.Cube.prototype.twistDuration = 700


//  Inspectah Deck

ERNO.Cube.prototype.inspect = function( compact, side ){

	compact = !compact

	this.front.inspect( compact, side )
	this.up.inspect(    compact, side )
	this.right.inspect( compact, side )
	this.down.inspect(  compact, side )
	this.left.inspect(  compact, side )
	this.back.inspect(  compact, side )
}


//  This nearly killed me -- trying to figure out why my twistQueue
//  suddenly stopped responding.
//  So I just re-wrote undo like so:

ERNO.Cube.prototype.undo = function(){

	var
	that  = this,
	wasOk = false

	this.taskQueue.add( function(){

		if( that.twistQueue.history.length ){

			var move = that.twistQueue.history.pop()

			that.twistQueue.future = []//  We might have shit queued up.
			that.twistQueue.add( move.getInverse())
			wasOk = true
		}
	}, function(){

		if( wasOk ) that.twistQueue.history.pop()
	})
}


//  Yikes. The Cube’s shuffle method’s done been borked.
//  First of all, we should be using Cube.isShuffling
//  and then let the Cube’s loop take action against that.
//  But alas, someone disconnected that boolean from
//  doing anything useful...
//  Secondly, I want my shuffles to be un-doable!
//  What was all that business about hiding shuffles?!?

ERNO.Cube.prototype.shuffle = function(){

	var possibleMoves = this.shuffleMethod


	//  Has our Cube been twisted at all yet?
	//  If so lets take the inverse of the most recent move
	//  And remove that from our list of possible next moves!

	if( this.twistQueue.history.length ){

		possibleMoves = possibleMoves.replace(
			this.twistQueue.history[ this.twistQueue.history.length - 1 ].getInverse().command , '' )
	}


	//  Here’s a one-liner for you:
	//  Split the String into an Array,
	//  take a random value from that Array,
	//  and send it to the twistQueue via Cube.twist()
	//  which can validate and extrapolate a valid Twist
	//  from just about anything, including a String!

	this.twist( possibleMoves.split( '' ).rand())
}


//  A little patch here to add an opacity tween.
//  Strange though... the API now seems to bake
//  this right into the cube instance so...
//  have to delete it once it’s created like this:
//  delete cube.showFaceLabels

ERNO.Cube.prototype.showFaceLabels = function (){

	Array.prototype.slice.call( document.querySelectorAll( '.faceLabel' )).forEach( function( e ){

		e.style.display = 'block'
		e.classList.add( 'fadeIn' )
	})
	this.showingFaceLabels = true
	return this
}
ERNO.Cube.prototype.hideFaceLabels = function (){

	Array.prototype.slice.call( document.querySelectorAll( '.faceLabel' )).forEach( function( e ){

		e.classList.remove( 'fadeIn' )
	})
	this.showingFaceLabels = true
	return this
}


//  Somewhere along the line the API lost the ability to
//  display the logo. So let’s patch that too.

ERNO.Cube.prototype.showLogo = function(){

	cube.centers.hasColor( ERNO.RED ).cubelets[ 0 ].faces.forEach( function( face ){

		if( face.color === ERNO.RED ) face.element.querySelector( '.sticker' ).classList.add( 'stickerLogo' )
	})
}
ERNO.Cube.prototype.hideLogo = function(){

	var e = document.querySelector( '.stickerLogo' )
	if( e ) e.classList.remove( 'stickerLogo' )
}


//  Just a very slightly modified version of what it was already doing.
//  Why?
//  Mostly because the isShuffling part was commented out for some reason!!

ERNO.Cube.prototype.loop = (function(){

	var time = 0

	return function(){

		requestAnimationFrame( this.loop )

		var
		localTime = ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() ),
		frameDelta = localTime - ( time || localTime )

		time = localTime
		if( !this.paused ){


			//	Update the internal animation frame.

			this.time += frameDelta
			TWEEN.update( this.time )


			//	We'll need to resize the cube if our containing element has changed size.
			/*
			if( this.domElement.parentNode && (
				this.domElement.clientWidth  !== this.domElement.parentNode.clientWidth ||
				this.domElement.clientHeight !== this.domElement.parentNode.clientHeight )){

				this.setSize( this.domElement.parentNode.clientWidth, this.domElement.parentNode.clientHeight )
			}*/
			if( this.autoRotate ){

				this.rotation.x += this.rotationDelta.x * 3
				this.rotation.y += this.rotationDelta.y * 2
				this.rotation.z += this.rotationDelta.z * 1.5
			}


			//  If the Cube is "ready"
			//  and not a single cubelet is currently tweening
			//  regardless of it's resting state (engagement;
			//  meaning it could in theory not be tweening but
			//  has come to rest at where rotation % 90 !== 0.

			if( this.isReady && this.isTweening() === 0 ){

				// if( this.twistQueue.isReady ){


					var queue = this.undoing ? this.historyQueue : this.twistQueue;


					//  We have zero twists in the queue
					//  so perhaps we'd like to add some?

					if( queue.future.length === 0 ){


						//  If the Cube ought to be shuffling then
						//  add a random command to the twist queue.

						if( this.isShuffling ){

							// this.twist( this.shuffleMethod[ this.shuffleMethod.length.rand() ])
							this.shuffle()
						}


						//  If the cube ought to be solving and a solver exists
						//  and we're not shuffling, tweening, etc.

						if( this.isSolving && window.solver ){

							this.isSolving = window.solver.consider( this )
						}


						//  If we are doing absolutely nothing else
						//  then we can can try executing a task.

						else if( this.taskQueue.isReady === true ){

							var task = this.taskQueue.do()

							if( task instanceof Function ) task()
						}
					}


					//  Otherwise, we have some twists in the queue
					//  and we should put everything else aside and tend to those.

					else {

						var twist = queue.do()

						if( twist.command.toLowerCase() !== 'x' &&
							twist.command.toLowerCase() !== 'y' &&
							twist.command.toLowerCase() !== 'z' &&
							twist.degrees !== 0  ) this.moveCounter += this.undoing ? -1 : 1;


						//	If the twist we're about to execute does not actually change any Slices,
						//  ie, we're rotating back to 0, then we don't need to remember it.

						if( twist.degrees === 0 || twist.isShuffle ) queue.purge( twist )
						this.immediateTwist( twist )
					}
				//}
			}


			//  Our mouse controls should only be active if we’re not rotating.

			this.mouseInteraction.enabled = this.mouseControlsEnabled && !this.finalShuffle
			this.mouseInteraction.update()
			this.controls.enabled = this.mouseControlsEnabled && !this.mouseInteraction.active
			this.controls.update()
		}
	}
}())



