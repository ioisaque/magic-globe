//		  					|************|
//		  					|*U1**U2**U3*|
//		  					|************|
//		  					|*U4**U5**U6*|
//		  					|************|
//		  					|*U7**U8**U9*|
//		  					|************|
//		  		************|************|************|************
//		  		*L1**L2**L3*|*F1**F2**F3*|*R1**R2**R3*|*B1**B2**B3*
//		  		************|************|************|************
//		  		*L4**L5**L6*|*F4**F5**F6*|*R4**R5**R6*|*B4**B5**B6*
//		  		************|************|************|************
//		  		*L7**L8**L9*|*F7**F8**F9*|*R7**R8**R9*|*B7**B8**B9*
//		  		************|************|************|************
//		  					|************|
//		  					|*D1**D2**D3*|
//		  					|************|
//		  					|*D4**D5**D6*|
//		  					|************|
//		  					|*D7**D8**D9*|
//		  					|************|

///////////////
//           //
//   Start   //
//           //
///////////////

document.addEventListener("DOMContentLoaded", function () {
    createCube();
    createControls();
    createBoards();

    // createStyleButtons()
    // createLabelButtons()
    // createHighlightButtons()
    createActionButtons();
    createOtherButtons();

    $("#cube-container").on("click", function () {
        navigator.clipboard.writeText(cube.state.get());
    });

    $("#actionAlgorithm").on("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            $("#actionSolve").click();
        }
    });
});

//////////////
//          //
//   Cube   //
//          //
//////////////

function createCube() {
    //  We have to create a Cube instance
    //  and that will give us the cube of course,
    //  but also access to the camera, etc.

    window.cube = new ERNO.Cube();

    const URL = new URLSearchParams(window.location.search);
    cube.state.set(URL.get("state"));

    //  Camera adjustments.
    //  The default puts the cube up nice and close,
    //  but we need to sit a bit further away
    //  so we can read the text around the cube.

    cube.camera.position.z = 2800; //3000
    cube.camera.fov = 25;
    cube.camera.updateProjectionMatrix();

    //  We have a cube and have fixed our camera.
    //  Now lets choreograph the cube’s entrance.
    //  We’ll spin up from the bottom and reverse-explode.
    //  (Can’t really call it imploding, can we?)

    cube.position.y = -2000;
    new TWEEN.Tween(cube.position)
        .to(
            {
                y: 90,
            },
            1000 * 2
        )
        .easing(TWEEN.Easing.Quartic.Out)
        .start(cube.time);
    cube.rotation.set(
        (120).degreesToRadians(),
        (420).degreesToRadians(),
        (20).degreesToRadians()
    );
    new TWEEN.Tween(cube.rotation)
        .to(
            {
                x: (20).degreesToRadians(),
                y: (-30).degreesToRadians(),
                z: (0).degreesToRadians(),
            },
            1000 * 4
        )
        .easing(TWEEN.Easing.Quartic.Out)
        .onComplete(function () {
            cube.isReady = true;
        })
        .start(cube.time);
    cube.isReady = false;
    cube.twistDuration = 250;
    cube.autoRotate = false;

    //  And we want each Cubelet to begin in an exploded position and tween inward.

    cube.cubelets.forEach(function (cubelet) {
        //  Originally it wasn’t necessary to hold onto this position
        //  because we knew for use setting position{} to 0,0,0 later
        //  would put the cube back together.
        //  But those were the easy days when the API was handled by
        //  one single person ;)

        var tmp = {
            x: cubelet.position.x,
            y: cubelet.position.y,
            z: cubelet.position.z,
        };

        //  We want to start with each Cubelet exploded out away from the Cube center.
        //  We’re reusing the x, y, and z we created far up above to handle Cubelet positions.

        var distance = 1000;
        cubelet.position.set(
            cubelet.addressX * distance,
            cubelet.addressY * distance,
            cubelet.addressZ * distance
        );

        //  Let’s vary the arrival time of flying Cubelets based on their type.
        //  A nice extra little bit of sauce!

        var delay;
        if (cubelet.type === "core") delay = 0;
        if (cubelet.type === "center") delay = (200).random(500);
        if (cubelet.type === "edge") delay = (800).random(1000);
        if (cubelet.type === "corner") delay = (1100).random(1500);

        //  We want those cubelets to go home, which used to be 0,0,0.
        //  Alas, now we have to rely on a cloned previous position.

        new TWEEN.Tween(cubelet.position)
            .to(
                {
                    x: tmp.x, //0,
                    y: tmp.y, //0,
                    z: tmp.z, //0
                },
                1000
            )
            .delay(delay)
            //.easing( TWEEN.Easing.Quadratic.Out )
            .easing(TWEEN.Easing.Quintic.Out)
            .onComplete(function () {
                cubelet.isTweening = false;
            })
            .start(cube.time);

        cubelet.isTweening = true;
    });

    //  THIS IS WHERE WE DEFINE THE CUBE FACE COLORS
    [
        //  	 						 				  					 |************|
        //  	 						 				  					 |*U1**U2**U3*|
        //  	 						 				  					 |************|
        // 			 					  					 	 			 |*U4**U5**U6*|
        // 			 					  					 	 			 |************|
        // 			 					  					 	 			 |*U7**U8**U9*|
        //  	 						 				  					 |************|
        //  		  					 			 ************|************|************|************
        //  		  					 			 *L1**L2**L3*|*F1**F2**F3*|*R1**R2**R3*|*B1**B2**B3*
        //  		  					 			 ************|************|************|************
        // 		  					 				 *L4**L5**L6*|*F4**F5**F6*|*R4**R5**R6*|*B4**B5**B6*
        // 		  					 				 ************|************|************|************
        //  	  					 				 *L7**L8**L9*|*F7**F8**F9*|*R7**R8**R9*|*B7**B8**B9*
        //  	  					 				 ************|************|************|************
        //  	 						 				  					 |************|
        //  	 						 				  					 |*D1**D2**D3*|
        //  	 						 				  					 |************|
        //  	 						 				  					 |*D4**D5**D6*|
        //  	 						 				  					 |************|
        //  	 						 				  					 |*D7**D8**D9*|
        //  	 						 				  					 |************|

        //  Front slice

        //      F      	        U               R      	        D               L               B                F      	        U               R      	        D               L               B               F      	        U               R      	        D               L               B
        //////////////  //////////////  //////////////  //////////////  //////////////  //////////////   //////////////  //////////////  //////////////  //////////////  //////////////  //////////////   //////////////  //////////////  //////////////  //////////////  //////////////  //////////////
        [
            notationToERNO(cube.state.array.F[0]),
            notationToERNO(cube.state.array.U[6]),
            ,
            ,
            notationToERNO(cube.state.array.L[2]),
        ],
        [
            notationToERNO(cube.state.array.F[1]),
            notationToERNO(cube.state.array.U[7]),
            ,
            ,
            ,
        ],
        [
            notationToERNO(cube.state.array.F[2]),
            notationToERNO(cube.state.array.U[8]),
            notationToERNO(cube.state.array.R[0]),
            ,
            ,
        ], //   1,  2, 3
        [
            notationToERNO(cube.state.array.F[3]),
            ,
            ,
            ,
            notationToERNO(cube.state.array.L[5]),
        ],
        [notationToERNO(cube.state.array.F[4]), , , , ,],
        [
            notationToERNO(cube.state.array.F[5]),
            ,
            notationToERNO(cube.state.array.R[3]),
            ,
            ,
        ], //   4,  5, 6
        [
            notationToERNO(cube.state.array.F[6]),
            ,
            ,
            notationToERNO(cube.state.array.D[0]),
            notationToERNO(cube.state.array.L[8]),
        ],
        [
            notationToERNO(cube.state.array.F[7]),
            ,
            ,
            notationToERNO(cube.state.array.D[1]),
            ,
        ],
        [
            notationToERNO(cube.state.array.F[8]),
            ,
            notationToERNO(cube.state.array.R[6]),
            notationToERNO(cube.state.array.D[2]),
            ,
        ], //   7,  8, 9

        //  Standing slice

        //      F      	        U               R      	        D               L               B                F      	        U               R      	        D               L               B               F      	        U               R      	        D               L               B
        //////////////  //////////////  //////////////  //////////////  //////////////  //////////////   //////////////  //////////////  //////////////  //////////////  //////////////  //////////////   //////////////  //////////////  //////////////  //////////////  //////////////  //////////////
        [
            ,
            notationToERNO(cube.state.array.U[3]),
            ,
            ,
            notationToERNO(cube.state.array.L[1]),
        ],
        [, notationToERNO(cube.state.array.U[4]), , , ,],
        [
            ,
            notationToERNO(cube.state.array.U[5]),
            notationToERNO(cube.state.array.R[1]),
            ,
            ,
        ], //   10, 11, 12
        [, , , , notationToERNO(cube.state.array.L[4])],
        [, , , , ,],
        [, , notationToERNO(cube.state.array.R[4]), , ,], //  13, XX, 14
        [
            ,
            ,
            ,
            notationToERNO(cube.state.array.D[3]),
            notationToERNO(cube.state.array.L[7]),
        ],
        [, , , notationToERNO(cube.state.array.D[4]), ,],
        [
            ,
            ,
            notationToERNO(cube.state.array.R[7]),
            notationToERNO(cube.state.array.D[5]),
            ,
        ], //  15, 16, 17

        //  Back slice

        //      F      	        U               R      	        D               L               B                F      	        U               R      	        D               L               B                 F      	        U               R      	        D               L               B
        //////////////  //////////////  //////////////  //////////////  //////////////  //////////////   //////////////  //////////////  //////////////  //////////////  //////////////  //////////////     //////////////  //////////////  //////////////  //////////////  //////////////  //////////////
        [
            ,
            notationToERNO(cube.state.array.U[0]),
            ,
            ,
            notationToERNO(cube.state.array.L[0]),
            notationToERNO(cube.state.array.B[2]),
        ],
        [
            ,
            notationToERNO(cube.state.array.U[1]),
            ,
            ,
            ,
            notationToERNO(cube.state.array.B[1]),
        ],
        [
            ,
            notationToERNO(cube.state.array.U[2]),
            notationToERNO(cube.state.array.R[2]),
            ,
            ,
            notationToERNO(cube.state.array.B[0]),
        ], //  18, 19, 20
        [
            ,
            ,
            ,
            ,
            notationToERNO(cube.state.array.L[3]),
            notationToERNO(cube.state.array.B[5]),
        ],
        [, , , , , notationToERNO(cube.state.array.B[4])],
        [
            ,
            ,
            notationToERNO(cube.state.array.R[5]),
            ,
            ,
            notationToERNO(cube.state.array.B[4]),
        ], //  21, 22, 23
        [
            ,
            ,
            ,
            notationToERNO(cube.state.array.D[6]),
            notationToERNO(cube.state.array.L[6]),
            notationToERNO(cube.state.array.B[8]),
        ],
        [
            ,
            ,
            ,
            notationToERNO(cube.state.array.D[7]),
            ,
            notationToERNO(cube.state.array.B[7]),
        ],
        [
            ,
            ,
            notationToERNO(cube.state.array.R[8]),
            notationToERNO(cube.state.array.D[8]),
            ,
            notationToERNO(cube.state.array.B[6]),
        ], //  24, 25, 26
    ].forEach(function (cubeletColorMap, cubeletId) {
        cubeletColorMap.forEach(function (faceColor, faceIndex) {
            var c =
                cube.cubelets[cubeletId].faces[faceIndex].element.querySelector(
                    ".sticker"
                ).classList;

            while (c.length) c.remove(c[0]);
            c.add("sticker", faceColor.name);
            cube.cubelets[cubeletId].faces[faceIndex].color = faceColor;
        });
    });

    //  Those cube face labels are just too damn far out!
    //  Let’s reel ’em in a little, eh?

    cube.object3D.children.forEach(function (child) {
        if (
            child instanceof THREE.CSS3DObject &&
            child.element.classList.contains("faceLabel")
        ) {
            child.position.multiplyScalar(0.8);
        }
    });

    //  Also, we want to force the instance to use
    //  ERNO.Cube.prototype.showFaceLabels(), etc:

    delete cube.showFaceLabels;
    delete cube.hideFaceLabels;

    //  Ok, look... It’s way past my bedtime.
    //  I don’t even know why this works / didn’t work before.
    //  The exact same code is over in patches.js
    //  but somehow it doesn’t work there. WHYWHYHWYHWYW?
    //  Sincerely, Mr. tears and flowers.

    ERNO.Cubelet.prototype.setOpacity = function (opacityTarget, onComplete) {
        if (this.opacityTween) this.opacityTween.stop();
        if (opacityTarget === undefined) opacityTarget = 1;
        if (opacityTarget !== this.opacity) {
            var that = this,
                tweenDuration = (opacityTarget - this.opacity)
                    .absolute()
                    .scale(0, 1, 0, this.cube.opacityTweenDuration);

            this.opacityTween = new TWEEN.Tween({ opacity: this.opacity })
                .to(
                    {
                        opacity: opacityTarget,
                    },
                    tweenDuration
                )
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(function () {
                    that.css3DObject.element.style.opacity = this.opacity;
                    that.opacity = this.opacity;
                })
                .onComplete(function () {
                    if (onComplete instanceof Function) onComplete();
                })
                .start(cube.time);
        }
    };

    //  Now, after all that math and choreography
    //  we should probably actually draw the cube to somewhere!

    document
        .getElementById("cube-container")
        .appendChild(cube.renderer.domElement);

    //  Be default the Cube Id labels are zero-indexed.
    //  Great for coders, not for average Joe.
    //  Also, we want to pretend the Core isn’t a real Cubelet.
    //  The trick here is, the elements don’t exist for a few cycles...
    //  NOTE: We should only have to update cubelets 0 to 13
    //  but for some reason FireFox is very upset about this whole thing
    //  so we’ll loop through to 26 to make FF happy again.

    setTimeout(function () {
        var i;

        for (i = 0; i <= 26; i++) {
            cube.cubelets[i].faces.forEach(function (face) {
                var e = face.element.querySelector(".underline");

                if (i < 13) e.innerHTML = +e.innerText + 1;
                else if (i === 13) e.innerHTML = "&#10084;";
                else e.innerHTML = +e.innerText;
            });
        }
        cube.showLogo();
    }, 100);

    //  And hey, our top matter is still invisible.
    //  Let’s bring it out, shall we?

    // setTimeout(function () {
    //     document.getElementById("infoToggle").classList.add("show");
    // }, 2000);

    //  I like it when I can ask for help.
    //  You might too.

    window.help =
        "\nHi! Want to learn what Magic Globe can do?" +
        "\nGet curious. Try out some of these commands:\n" +
        "\n  cube.twist( 'rdRD'.multiply( 6 ))" +
        "\n  cube.inspect()" +
        "\n  cube.front.inspect()" +
        "\n  cube.front.northEast.inspect()" +
        "\n  cube.front.northWest.up.color.name" +
        "\n  cube.standing.setOpacity( 0.5 )" +
        "\n  cube.corners.setRadius( 90 )" +
        "\n  cube.hasColors( ERNO.RED, ERNO.BLUE ).showIds()" +
        "\n\nAlso worth noting, the cubelet indexes and addresses are zero-indexed in the code, " +
        "but the numbers you see rendered on the cube are one-indexed (more intuitive for non-coder folk). " +
        "The rendered numbering also skips over the Core cubelet. " +
        "If that all sounds confusing, have a look at this:\n" +
        "\n  cube.showIds().setOpacity( 0.1 ).core.setOpacity()" +
        "\n  cube.hasAddress(  0 ).setOpacity()" +
        "\n  cube.hasAddress( 26 ).setOpacity()" +
        "\n\nHappy cubing, Isaque. <3" +
        "\n\n";
    console.log(help);

    //  Kick it off, Mate!

    cube.taskQueue.add(function () {
        // demoStart()
    });
}

//////////////////
//              //
//   Controls   //
//              //
//////////////////

function createControls() {
    //  Let’s treat the demo segements as a screen saver.
    //  We’ll boot up with it, but a keypress or mousepress
    //  will turn it off and pull up the nav menu.
    //  Idling for a while will bring it back into play.

    window.idleSeconds = 0;
    window.isDemoing = false; // Trick it such that the nav won’t popup on startup since we're automagically starting demo!
    setInterval(function () {
        if (isDemoing === false) idleSeconds++;
        if (idleSeconds > 120) {
            //console.log( 'Idled long enough for demo to engage.' )
            idleSeconds = 0;
            //demoStart()
        }
    }, 1000);
    window.addEventListener("mousemove", function () {
        idleSeconds = 0;
    });
    function ifTouchedAnything(e) {
        idleSeconds = 0;
        if (isDemoing === true) demoStop();
        //if( e && e.preventDefault ) e.preventDefault()
    }
    //window.addEventListener( 'mousedown', ifTouchedAnything )
    //window.addEventListener( 'touchstart', ifTouchedAnything )

    //  Keys go pressy pressy.

    document.addEventListener(
        "keydown",
        function (event) {
            var key = event.which || event.keyCode,
                info = document.getElementById("info"),
                infoIsOpen = info?.classList.contains("show") ? true : false,
                nav = document.querySelector("nav");

            //  Regardless of what was pressed
            //  we can’t really say the user’s been idle, eh?

            idleSeconds = 0;
            if (isDemoing === true) demoStop();

            //  Life will be easier for users if we map arrow keys to
            //  the Cube orientation changes. We’ll do what we can,
            //  which leaves out rotations about the Z axis, but I don’t
            //  think the average user is going to miss them.

            if (key === 37) cube.twist("Y");
            //  Left
            else if (key === 39) cube.twist("y");
            //  Right
            else if (key === 38) cube.twist("X");
            //  Up
            else if (key === 40) cube.twist("x");
            //  Down
            //  Easy escape plan for both the Info box and Nav panel.
            else if (key === 27) {
                if (infoIsOpen) infoToggle.turnOff();
                else nav.classList.remove("show");
            }

            //  Use 'i' to toggle the Info box.
            else if (key === 73) {
                if (infoIsOpen) infoToggle.turnOff();
                else infoToggle.turnOn();
            }

            //  Do ya want an Undo button? Well do ya, punk?
            else if (key === 90) {
                if (event.ctrlKey || event.metaKey) cube.undo();
            }

            //  Big old spacebar opens up the nav.
            else if (key === 32) nav.classList.add("show");
        },
        false
    );

    function navOpen(e) {
        idleSeconds = 0;
        if (isDemoing === true) demoStop();
        else document.querySelector("nav").classList.add("show");
        if (e && e.preventDefault) e.preventDefault();
    }
    document
        .getElementById("cube-container")
        .addEventListener("click", navOpen);
    document
        .getElementById("cube-container")
        .addEventListener("touchstart", navOpen);

    //  Enable the “close navigation” button.

    function navClose(e) {
        document.querySelector("nav").classList.remove("show");
        if (e && e.preventDefault) e.preventDefault();
    }
    // document.querySelector("nav .closer").addEventListener("click", navClose);
    // document
    //     .querySelector("nav .closer")
    //     .addEventListener("touchstart", navClose);
}

////////////////////
//                //
//   Billboards   //
//                //
////////////////////

//  We need to build some billboards alongside the cube
//  in 3D space for printing helpful caption text to.

function createBoard(id, x, y, z) {
    var board = new THREE.CSS3DObject(document.createElement("div"));

    x = x !== undefined ? x : cube.size + 42;
    y = y !== undefined ? y : 0;
    z = z !== undefined ? z : cube.size / -2;

    board.element.classList.add("board");
    board.element.id = id || "boardRight";
    board.position.set(x, y, z);
    cube.object3D.add(board);
    textify(board.element);
    //board.element.innerText = id
    window[id] = board.element;
    return board;
}
function createBoards() {
    createBoard("boardLeft", -cube.size, 0, cube.size / 2);
    createBoard("boardUp", cube.size / 2, 350, cube.size / -2);
    createBoard("boardRight", cube.size + 42, 0, cube.size / -2);
    createBoard("boardDown", cube.size / 2, -350 - 35, cube.size / 2);
}

//  Quick and dirty way to overload a DOM element
//  with some text typing trickery.

function textify(element, mpc) {
    if (typeof element === "string") element = document.getElementById(element);
    element.style.whiteSpace = "pre";
    element.textify = {
        kill: false,
        validateParams: function (params) {
            if (params === undefined) params = {};
            else if (typeof params === "string") params = { text: params };
            if (params.mpc === undefined) params.mpc = 20; //  Milliseconds per character
            if (params.beginAt === undefined) params.beginAt = 1;
            if (params.index === undefined) params.index = params.beginAt;
            if (params.delta === undefined) params.delta = 1;
            if (params.putDown === undefined) params.putDown = true;
            return params;
        },
        go: function (params) {
            params = this.validateParams(params);
            function step() {
                if (params.index > 0 && params.index < params.text.length) {
                    if (params.putDown) {
                        element.innerHTML =
                            params.text.substr(0, params.index) +
                            '<span style="visibility:hidden">' +
                            params.text.substr(params.index) +
                            "</span>";
                    } else {
                        //  Pick up (instead of Put Down)

                        element.innerHTML =
                            '<span style="visibility:hidden">' +
                            params.text.substr(0, params.index) +
                            "</span>" +
                            params.text.substr(params.index);
                    }
                    //console.log( element.innerHTML )
                    params.index += params.delta;
                    if (element.textify.kill === false)
                        setTimeout(step, params.mpc);
                } else {
                    element.innerHTML = params.text;
                    //console.log( element.innerHTML )
                    if (typeof params.callback === "function")
                        params.callback();
                }
            }
            step();
        },
        write: function (params) {
            params = this.validateParams(params);
            this.go(params);
        },
        unwrite: function (mpc) {
            var params = this.validateParams({ mpc: mpc });

            params.text = element.innerHTML;
            params.index = element.innerHTML.length - 1;
            params.delta = -1;
            params.callback = function () {
                element.innerHTML = "";
            };
            this.go(params);
        },
        erase: function (mpc) {
            var params = this.validateParams({ mpc: mpc });
            if (mpc === undefined) params.mpc = 10; //  Speedier default for erasures.

            params.putDown = false;
            params.text = element.innerHTML;
            params.callback = function () {
                element.innerHTML = "";
            };
            this.go(params);
        },
        add: function (params) {
            params = this.validateParams(params);
            params.text = element.innerHTML + params.text;
            params.beginAt = element.innerHTML.length;
            params.index = params.beginAt;
            this.go(params);
        },
        remove: function () {
            params = this.validateParams(params);
            // so... how do we remove N characters???
            //if reminaing text.length === 0:
            params.callback = this.destroy(); //???? assumes this is lowest layer... send DOM element as arg instead?
        },
    };
}
