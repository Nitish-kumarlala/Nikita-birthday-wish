/* =========================================================
   BIRTHDAY SURPRISE WEBSITE
   COMPLETE SCRIPT
   ========================================================= */


/* =========================================================
   BASIC NAVIGATION
   ========================================================= */

const ids = [
    "welcome",
    "cake",
    "balloons",
    "memories",
    "bouquet",
    "letter"
];

const screens = [
    ...document.querySelectorAll(".screen")
];

const bar =
    document.getElementById("bar");


function go(id) {

    screens.forEach((screen) => {

        screen.classList.toggle(
            "active",
            screen.id === id
        );

    });

    const index =
        ids.indexOf(id);

    if (bar && index >= 0) {

        bar.style.width =
            ((index + 1) /
                ids.length) *
            100 +
            "%";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   WELCOME SCREEN
   ========================================================= */

const yes =
    document.getElementById("yes");

const no =
    document.getElementById("no");

const noText =
    document.getElementById("noText");


function moveNo() {

    if (!no) return;

    no.style.position = "fixed";

    no.style.left =
        8 +
        Math.random() * 75 +
        "vw";

    no.style.top =
        15 +
        Math.random() * 70 +
        "vh";

    if (noText) {

        noText.textContent =
            "Nice try 😌 The NO button is running away!";
    }
}


if (no) {

    no.addEventListener(
        "mouseenter",
        moveNo
    );

    no.addEventListener(
        "touchstart",
        (e) => {

            e.preventDefault();
            moveNo();

        }
    );

    no.addEventListener(
        "click",
        (e) => {

            e.preventDefault();
            moveNo();

        }
    );
}


if (yes) {

    yes.onclick = () => {

        go("cake");

    };
}


/* =========================================================
   CAKE GAME ELEMENTS
   ========================================================= */

const game =
    document.getElementById(
        "cakeGame"
    );

const falling =
    document.getElementById(
        "fallingPiece"
    );

const catcher =
    document.getElementById(
        "catcher"
    );

const stack =
    document.getElementById(
        "stack"
    );

const candlePiece =
    document.getElementById(
        "candlePiece"
    );

const startGame =
    document.getElementById(
        "startGame"
    );

const layerNo =
    document.getElementById(
        "layerNo"
    );

const score =
    document.getElementById(
        "score"
    );

const gameMsg =
    document.getElementById(
        "gameMsg"
    );


/* =========================================================
   CAKE GAME VARIABLES
   ========================================================= */

let gx = 280;

let running = false;

let candleFalling = false;

let candlePlaced = false;

let candleBlown = false;

let gameRAF = null;

let candleRAF = null;

let fallY = -80;

let fallSpeed = 2.25;

let layer = 1;

let scoreVal = 0;

let pieceX = 280;

let lastTime = 0;

let knifeReady = false;


/* =========================================================
   MOVE CAKE
   ========================================================= */

function setCatcher(x) {

    if (
        !game ||
        !catcher ||
        !stack
    ) {
        return;
    }

    const half =
        catcher.offsetWidth / 2;

    gx = Math.max(
        half,
        Math.min(
            game.clientWidth - half,
            x
        )
    );

    catcher.style.left =
        gx - half +
        "px";

    /*
       Complete cake moves together.
    */

    if (!candlePlaced) {

        stack.style.left =
            gx +
            "px";
    }

}


/* =========================================================
   POINTER POSITION
   ========================================================= */

function pointerX(e) {

    if (!game) return 0;

    const rect =
        game.getBoundingClientRect();

    const clientX =
        e.clientX ??
        e.touches?.[0]?.clientX ??
        0;

    return (
        clientX -
        rect.left
    );
}


/* =========================================================
   MOVE CAKE WITH MOUSE / TOUCH
   ========================================================= */

if (game) {

    game.addEventListener(
        "pointermove",
        (e) => {

            /*
               IMPORTANT:

               Cake moves during:
               1. Falling cake layers
               2. Falling candle

               Cake stops ONLY after
               candle is successfully placed.
            */

            if (
                running &&
                !candlePlaced
            ) {

                setCatcher(
                    pointerX(e)
                );

            }

        }
    );
}


/* =========================================================
   DRAG SUPPORT
   ========================================================= */

if (catcher) {

    catcher.addEventListener(
        "pointerdown",
        (e) => {

            catcher.setPointerCapture?.(
                e.pointerId
            );

        }
    );
}


/* =========================================================
   RESET FALLING CAKE PIECE
   ========================================================= */

function resetPiece() {

    if (
        !game ||
        !falling
    ) {
        return;
    }

    fallY = -65;

    pieceX =
        30 +
        Math.random() *
        Math.max(
            1,
            game.clientWidth - 60
        );

    falling.className =
        "falling-piece tier-piece piece" +
        layer;

    falling.style.top =
        fallY +
        "px";

    falling.style.left =
        pieceX -
        falling.offsetWidth / 2 +
        "px";

    falling.classList.remove(
        "hidden"
    );

    if (layerNo) {

        layerNo.textContent =
            layer;
    }

}


/* =========================================================
   CAKE ANIMATION
   ========================================================= */

function animate(time) {

    if (
        !running ||
        candleFalling ||
        candlePlaced
    ) {
        return;
    }

    if (!lastTime) {

        lastTime =
            time;
    }

    const dt =
        Math.min(
            32,
            time -
            lastTime
        );

    lastTime =
        time;

    fallY +=
        (fallSpeed * dt) /
        16.67;

    falling.style.top =
        fallY +
        "px";


    /*
       Piece reaches catcher area.
    */

    if (
        fallY >
        game.clientHeight -
        135
    ) {

        const catcherLeft =
            gx -
            catcher.offsetWidth / 2;

        const catcherRight =
            gx +
            catcher.offsetWidth / 2;

        const pieceLeft =
            pieceX -
            falling.offsetWidth / 2;

        const pieceRight =
            pieceX +
            falling.offsetWidth / 2;


        /*
           SUCCESS
        */

        if (
            pieceRight >
                catcherLeft &&
            pieceLeft <
                catcherRight
        ) {

            scoreVal += 100;

            if (score) {

                score.textContent =
                    scoreVal;
            }

            addStack(layer);


            /*
               FOURTH LAYER COMPLETE.

               DO NOT STOP RUNNING.

               Candle must fall while
               cake is still movable.
            */

            if (layer === 4) {

                falling.classList.add(
                    "hidden"
                );

                candleFalling =
                    true;

                running =
                    true;

                setTimeout(
                    () => {

                        candleDrop();

                    },
                    350
                );

                return;

            }


            /*
               Continue next cake layer.
            */

            layer++;

            resetPiece();

        }

        /*
           MISSED
        */

        else {

            if (gameMsg) {

                gameMsg.textContent =
                    "Missed it — catch the next layer!";
            }

            resetPiece();

        }

    }


    gameRAF =
        requestAnimationFrame(
            animate
        );
}


/* =========================================================
   ADD CAKE LAYER TO STACK
   ========================================================= */

function addStack(n) {

    if (!stack) return;

    const p =
        document.createElement(
            "div"
        );

    p.className =
        "stack-piece";

    p.style.width =
        190 -
        (n - 1) * 25 +
        "px";

    p.style.bottom =
        (n - 1) * 39 +
        "px";

    stack.appendChild(p);

    burst("✨");
}


/* =========================================================
   CANDLE DROP
   ========================================================= */

function candleDrop() {

    if (
        !game ||
        !candlePiece ||
        !stack
    ) {
        return;
    }


    /*
       Candle falling starts.

       Cake MUST remain movable.
    */

    running = true;

    candleFalling = true;

    candlePlaced = false;

    candleBlown = false;


    if (gameMsg) {

        gameMsg.textContent =
            "Catch the candle on top of your cake.";
    }


    candlePiece.classList.remove(
        "hidden"
    );

    candlePiece.style.display =
        "block";

    candlePiece.style.opacity =
        "1";


    let y = -90;

    let x =
        30 +
        Math.random() *
        Math.max(
            1,
            game.clientWidth - 60
        );


    candlePiece.style.left =
        x -
        14 +
        "px";

    candlePiece.style.top =
        y +
        "px";


    /*
       Actual top of fourth cake layer.

       Stack:
       bottom = 80px
       fourth layer bottom = 117px
       layer height = 42px
    */

    const cakeTop =
        game.clientHeight -
        80 -
        117 -
        42;


    const topCakeWidth =
        105;


    function drop() {

        if (
            !candleFalling ||
            candlePlaced
        ) {
            return;
        }


        y += 2.3;

        candlePiece.style.top =
            y +
            "px";


        const candleHeight =
            candlePiece.offsetHeight ||
            70;

        const candleBottom =
            y +
            candleHeight;


        const cakeLeft =
            gx -
            topCakeWidth / 2;

        const cakeRight =
            gx +
            topCakeWidth / 2;


        /*
           Candle has reached top cake.
        */

        if (
            candleBottom >= cakeTop &&
            x >= cakeLeft &&
            x <= cakeRight
        ) {


            /*
               CANDLE SUCCESSFULLY LANDED
            */

            candleFalling =
                false;

            /*
               NOW freeze cake.
            */

            running =
                false;

            candlePlaced =
                true;


            scoreVal += 150;

            if (score) {

                score.textContent =
                    scoreVal;
            }


            /*
               EXACT candle position
               on top of layer 4.
            */

            candlePiece.style.left =
                gx -
                14 +
                "px";

            candlePiece.style.top =
                cakeTop -
                candleHeight +
                "px";


            candlePiece.style.display =
                "block";

            candlePiece.style.opacity =
                "1";


            /*
               Keep cake fixed.
            */

            catcher.style.left =
                gx -
                catcher.offsetWidth / 2 +
                "px";

            stack.style.left =
                gx +
                "px";


            if (gameMsg) {

                gameMsg.textContent =
                    "Perfect! Now slide to blow out the candle 💨";
            }


            /*
               SHOW BLOW SLIDER
            */

            createBlowSlider();

            return;
        }


        /*
           Candle missed the cake.

           It restarts.
           Cake remains movable.
        */

        if (
            y >
            game.clientHeight + 60
        ) {

            y = -90;

            x =
                30 +
                Math.random() *
                Math.max(
                    1,
                    game.clientWidth - 60
                );

            candlePiece.style.left =
                x -
                14 +
                "px";

            candlePiece.style.top =
                y +
                "px";
        }


        candleRAF =
            requestAnimationFrame(
                drop
            );
    }


    candleRAF =
        requestAnimationFrame(
            drop
        );
}


/* =========================================================
   BLOW CANDLE SLIDER
   ========================================================= */

function createBlowSlider() {

    const old =
        document.getElementById(
            "inGameBlow"
        );

    if (old) {

        old.remove();
    }


    const blowBox =
        document.createElement(
            "div"
        );

    blowBox.id =
        "inGameBlow";


    blowBox.innerHTML = `
        <div class="blow-title">
            Slide to blow out the candle 💨
        </div>

        <input
            id="gameBlowSlider"
            type="range"
            min="0"
            max="100"
            value="0"
        >
    `;


    /*
       Put slider OUTSIDE cakeGame
       so overflow:hidden cannot hide it.
    */

    const parent =
        game?.parentElement ||
        document.body;

    parent.appendChild(
        blowBox
    );


    /*
       Force visible styling.
    */

    blowBox.style.display =
        "block";

    blowBox.style.width =
        "min(430px, 88%)";

    blowBox.style.margin =
        "15px auto";

    blowBox.style.padding =
        "13px 18px";

    blowBox.style.background =
        "#ffffff";

    blowBox.style.border =
        "1px solid #f2cad9";

    blowBox.style.borderRadius =
        "18px";

    blowBox.style.boxShadow =
        "0 10px 30px rgba(141,61,91,.12)";

    blowBox.style.position =
        "relative";

    blowBox.style.zIndex =
        "100";

    blowBox.style.textAlign =
        "center";


    const title =
        blowBox.querySelector(
            ".blow-title"
        );

    if (title) {

        title.style.color =
            "#d54e7a";

        title.style.fontWeight =
            "700";

        title.style.fontSize =
            "14px";

        title.style.marginBottom =
            "8px";
    }


    const slider =
        document.getElementById(
            "gameBlowSlider"
        );

    if (!slider) {
        return;
    }


    slider.style.width =
        "100%";

    slider.style.display =
        "block";

    slider.style.cursor =
        "pointer";

    slider.style.accentColor =
        "#ed5f8e";


    slider.addEventListener(
        "input",
        function () {

            /*
               Prevent multiple completion.
            */

            if (candleBlown) {
                return;
            }


            if (
                Number(this.value) <
                90
            ) {
                return;
            }


            candleBlown =
                true;


            /*
               Turn flame off.
            */

            const flame =
                candlePiece
                    ? candlePiece.querySelector("i")
                    : null;

            if (flame) {

                flame.style.opacity =
                    "0";

                flame.style.animation =
                    "none";
            }


            if (gameMsg) {

                gameMsg.textContent =
                    "Wish made! Candle blown! ✨";
            }


            blowBox.innerHTML = `
                <div
                    style="
                        color:#d54e7a;
                        font-weight:700;
                        font-size:14px;
                        padding:5px;
                    "
                >
                    Wish made! ✨🎂
                </div>
            `;


            burst("🎉");


            /*
               Fade candle.
            */

            if (candlePiece) {

                candlePiece.style.transition =
                    "opacity .5s ease";

                setTimeout(
                    () => {

                        candlePiece.style.opacity =
                            "0";

                    },
                    150
                );
            }


            /*
               Cake remains frozen.
            */

            running =
                false;

            candleFalling =
                false;

            candlePlaced =
                true;


            /*
               After blow → cake cut.
            */

            setTimeout(
                () => {

                    showCakeCut();

                },
                900
            );

        }
    );
}


/* =========================================================
   SHOW CAKE CUT
   ========================================================= */

function showCakeCut() {

    const blowBox =
        document.getElementById(
            "inGameBlow"
        );

    if (blowBox) {

        blowBox.remove();
    }


    const knifeStage =
        document.getElementById(
            "knifeStage"
        );

    if (!knifeStage) {

        if (gameMsg) {

            gameMsg.textContent =
                "Candle blown! Cake-cut section not found.";
        }

        return;
    }


    /*
       Show cake cutting section.
    */

    knifeStage.classList.remove(
        "hidden"
    );

    knifeStage.style.display =
        "block";


    const cutMsg =
        document.getElementById(
            "cutMsg"
        );

    if (cutMsg) {

        cutMsg.textContent =
            "Slide to cut the cake 🔪🎂";
    }


    knifeReady =
        false;


    setupKnife();


    knifeStage.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


/* =========================================================
   KNIFE SETUP
   ========================================================= */

function setupKnife() {

    const area =
        document.getElementById(
            "knifeArea"
        );

    const knife =
        document.getElementById(
            "knife"
        );


    if (
        !area ||
        !knife ||
        knifeReady
    ) {
        return;
    }


    knifeReady =
        true;


    let dragging =
        false;

    let startX =
        0;

    let lastX =
        0;


    knife.addEventListener(
        "pointerdown",
        (e) => {

            dragging =
                true;

            startX =
                e.clientX;

            lastX =
                e.clientX;

            knife.setPointerCapture?.(
                e.pointerId
            );

        }
    );


    knife.addEventListener(
        "pointermove",
        (e) => {

            if (!dragging) {
                return;
            }


            lastX =
                e.clientX;


            const rect =
                area.getBoundingClientRect();


            let x =
                e.clientX -
                rect.left -
                knife.offsetWidth / 2;


            let y =
                e.clientY -
                rect.top -
                knife.offsetHeight / 2;


            x =
                Math.max(
                    0,
                    Math.min(
                        rect.width -
                            knife.offsetWidth,
                        x
                    )
                );


            y =
                Math.max(
                    0,
                    Math.min(
                        rect.height -
                            knife.offsetHeight,
                        y
                    )
                );


            knife.style.left =
                x +
                "px";

            knife.style.top =
                y +
                "px";

        }
    );


    knife.addEventListener(
        "pointerup",
        finishKnife
    );

    knife.addEventListener(
        "pointercancel",
        finishKnife
    );


    function finishKnife() {

        if (!dragging) {
            return;
        }


        dragging =
            false;


        const distance =
            lastX -
            startX;


        if (
            distance >
            Math.max(
                100,
                area.clientWidth *
                0.25
            )
        ) {

            cutCake();

        } else {

            const cutMsg =
                document.getElementById(
                    "cutMsg"
                );

            if (cutMsg) {

                cutMsg.textContent =
                    "Swipe the knife farther from left to right →";
            }
        }
    }
}


/* =========================================================
   CUT CAKE
   ========================================================= */

function cutCake() {

    if (
        knifeReady === "done"
    ) {
        return;
    }


    knifeReady =
        "done";


    const cake =
        document.querySelector(
            "#knifeStage .cut-tier"
        );

    const knife =
        document.getElementById(
            "knife"
        );

    const cutMsg =
        document.getElementById(
            "cutMsg"
        );


    if (cake) {

        cake.classList.add(
            "sliced"
        );
    }


    if (knife) {

        knife.classList.add(
            "knife-cut"
        );
    }


    if (cutMsg) {

        cutMsg.textContent =
            "Cake cut! 🎂❤️";
    }


    burst("🎂");


    /*
       After cake cut →
       balloons.
    */

    setTimeout(
        () => {

            go("balloons");

            setupBalloons();

        },
        900
    );
}


/* =========================================================
   START CAKE GAME
   ========================================================= */

if (startGame) {

    startGame.onclick = () => {


        /*
           Cancel old animations.
        */

        if (gameRAF) {

            cancelAnimationFrame(
                gameRAF
            );
        }

        if (candleRAF) {

            cancelAnimationFrame(
                candleRAF
            );
        }


        const oldBlow =
            document.getElementById(
                "inGameBlow"
            );

        if (oldBlow) {

            oldBlow.remove();
        }


        running =
            true;

        candleFalling =
            false;

        candlePlaced =
            false;

        candleBlown =
            false;

        knifeReady =
            false;


        layer =
            1;

        scoreVal =
            0;


        if (score) {

            score.textContent =
                "0";
        }


        if (stack) {

            stack.innerHTML =
                "";
        }


        if (falling) {

            falling.classList.remove(
                "hidden"
            );

            falling.style.opacity =
                "1";
        }


        if (candlePiece) {

            candlePiece.classList.add(
                "hidden"
            );

            candlePiece.style.display =
                "none";

            candlePiece.style.opacity =
                "1";
        }


        const knifeStage =
            document.getElementById(
                "knifeStage"
            );

        if (knifeStage) {

            knifeStage.classList.add(
                "hidden"
            );

            knifeStage.style.display =
                "none";
        }


        if (gameMsg) {

            gameMsg.textContent =
                "Move the base under the falling cake layer.";
        }


        startGame.classList.add(
            "hidden"
        );


        setCatcher(
            game.clientWidth / 2
        );


        resetPiece();


        lastTime =
            0;


        gameRAF =
            requestAnimationFrame(
                animate
            );
    };
}


/* =========================================================
   OLD BLOW SECTION
   DISABLED
   ========================================================= */

/*
   The old #blow slider is intentionally NOT used.

   The actual blow slider is created only after
   the candle lands on the cake.
*/

const oldBlow =
    document.getElementById(
        "blow"
    );

if (oldBlow) {

    oldBlow.oninput =
        null;
}


/* =========================================================
   BALLOONS
   ========================================================= */

const balloonMessages = [

    "You are my first female best friend. ❤️",

    "You are my favorite cousin. 🤍",

    "You know how much I love you. ❤️",

    "It's your birthday, but I'm the one who's excited! 🎉"

];


let balloonSetupDone =
    false;


function setupBalloons() {

    if (balloonSetupDone) {
        return;
    }


    balloonSetupDone =
        true;


    const balloons =
        [
            ...document.querySelectorAll(
                ".balloon"
            )
        ];


    const message =
        document.getElementById(
            "bmsg"
        );


    const next =
        document.getElementById(
            "balloonNext"
        );


    let popped =
        0;


    /*
       Reset messages.
    */

    if (message) {

        message.textContent =
            "4 surprises are waiting…";
    }


    if (next) {

        next.classList.add(
            "hidden"
        );
    }


    balloons.forEach(
        (balloon, index) => {

            balloon.addEventListener(
                "click",
                () => {


                    if (
                        balloon.classList.contains(
                            "popped"
                        )
                    ) {
                        return;
                    }


                    balloon.classList.add(
                        "popped"
                    );


                    popped++;


                    balloonBurst(
                        balloon
                    );


                    /*
                       SHOW MESSAGE
                       AFTER POP.
                    */

                    if (message) {

                        message.textContent =
                            balloonMessages[
                                index
                            ];

                        message.classList.remove(
                            "hidden"
                        );
                    }


                    /*
                       All balloons popped.
                    */

                    if (
                        popped ===
                        balloons.length
                    ) {

                        setTimeout(
                            () => {

                                if (message) {

                                    message.textContent =
                                        "All four messages were meant for you. ❤️🎈";
                                }


                                if (next) {

                                    next.classList.remove(
                                        "hidden"
                                    );
                                }

                            },
                            700
                        );
                    }

                }
            );

        }
    );
}


/* =========================================================
   BALLOON BURST EFFECT
   ========================================================= */

function balloonBurst(balloon) {

    const rect =
        balloon.getBoundingClientRect();


    for (
        let i = 0;
        i < 14;
        i++
    ) {

        const star =
            document.createElement(
                "span"
            );


        star.className =
            "balloon-star";


        star.textContent =
            i % 2 === 0
                ? "✦"
                : "✨";


        star.style.position =
            "fixed";

        star.style.left =
            rect.left +
            rect.width / 2 +
            "px";

        star.style.top =
            rect.top +
            rect.height / 2 +
            "px";

        star.style.zIndex =
            "9999";

        star.style.pointerEvents =
            "none";

        star.style.fontSize =
            "18px";


        document.body.appendChild(
            star
        );


        const angle =
            (Math.PI * 2 * i) /
            14;


        const distance =
            50 +
            Math.random() * 70;


        const animation =
            star.animate(
                [
                    {
                        transform:
                            "translate(-50%, -50%) scale(.3)",
                        opacity: 1
                    },
                    {
                        transform:
                            `translate(
                                calc(-50% + ${
                                    Math.cos(angle) *
                                    distance
                                }px),
                                calc(-50% + ${
                                    Math.sin(angle) *
                                    distance
                                }px)
                            ) scale(1.1)`,
                        opacity: 0
                    }
                ],
                {
                    duration: 750,
                    easing: "ease-out",
                    fill: "forwards"
                }
            );


        animation.onfinish =
            () => {

                star.remove();

            };
    }
}


/* =========================================================
   BALLOON NEXT BUTTON
   ========================================================= */

const balloonNext =
    document.getElementById(
        "balloonNext"
    );


if (balloonNext) {

    balloonNext.onclick =
        () => {

            go("memories");

        };
}


/* =========================================================
   MEMORY PHOTO SLIDER
   ========================================================= */

const photos = [

    [
        "photos/photo1.jpg",
        "A little moment worth remembering."
    ],

    [
        "photos/photo2.jpg",
        "Some moments deserve their own place."
    ],

    [
        "photos/photo3.jpg",
        "One of those moments that stays."
    ],

    [
        "photos/photo4.jpg",
        "Some memories are impossible to forget."
    ],

    [
        "photos/photo5.jpg",
        "Five little memories. One beautiful journey. ❤️"
    ]

];


let photoIndex =
    0;


const photo =
    document.getElementById(
        "photo"
    );

const photoCaption =
    document.getElementById(
        "pcap"
    );

const photoCount =
    document.getElementById(
        "count"
    );

const dots =
    document.getElementById(
        "dots"
    );

const prev =
    document.getElementById(
        "prev"
    );

const next =
    document.getElementById(
        "next"
    );


/*
   Create 5 dots.
*/

if (dots) {

    dots.innerHTML =
        "";

    photos.forEach(
        (_, index) => {

            const dot =
                document.createElement(
                    "i"
                );


            dot.className =
                "dot";


            dot.addEventListener(
                "click",
                () => {

                    showPhoto(
                        index
                    );

                }
            );


            dots.appendChild(
                dot
            );
        }
    );
}


/*
   Show selected photo.
*/

function showPhoto(index) {

    photoIndex =
        (
            index +
            photos.length
        ) %
        photos.length;


    const item =
        photos[
            photoIndex
        ];


    if (photo) {

        photo.style.opacity =
            "0";


        setTimeout(
            () => {

                photo.src =
                    item[0];


                photo.onload =
                    () => {

                        photo.style.opacity =
                            "1";
                    };


                /*
                   Cached image support.
                */

                if (
                    photo.complete
                ) {

                    photo.style.opacity =
                        "1";
                }

            },
            120
        );
    }


    if (photoCaption) {

        photoCaption.textContent =
            item[1];
    }


    if (photoCount) {

        photoCount.textContent =
            String(
                photoIndex + 1
            ).padStart(2, "0") +
            " / 05";
    }


    if (dots) {

        [
            ...dots.children
        ].forEach(
            (dot, i) => {

                dot.classList.toggle(
                    "on",
                    i === photoIndex
                );

            }
        );
    }
}


/*
   Previous arrow.
*/

if (prev) {

    prev.onclick =
        (e) => {

            e.preventDefault();

            e.stopPropagation();

            showPhoto(
                photoIndex - 1
            );
        };
}


/*
   Next arrow.
*/

if (next) {

    next.onclick =
        (e) => {

            e.preventDefault();

            e.stopPropagation();

            showPhoto(
                photoIndex + 1
            );
        };
}


/*
   First photo.
*/

showPhoto(0);


/* =========================================================
   OPEN BOUQUET BUTTON
   ========================================================= */

const memNext =
    document.getElementById(
        "memNext"
    );


if (memNext) {

    memNext.onclick =
        (e) => {

            e.preventDefault();

            go("bouquet");

        };
}


/* =========================================================
   BOUQUET
   ========================================================= */

const bouquetButton =
    document.getElementById(
        "bouquetBtn"
    );

const chats =
    [
        ...document.querySelectorAll(
            "#chats > div"
        )
    ];

const surpriseBtn =
    document.getElementById(
        "surpriseBtn"
    );


let chatIndex =
    0;


if (bouquetButton) {

    bouquetButton.onclick =
        () => {


            bouquetButton.classList.add(
                "open"
            );


            const chatBox =
                document.getElementById(
                    "chats"
                );


            if (chatBox) {

                chatBox.classList.remove(
                    "hidden"
                );
            }


            /*
               Hide all messages first.
            */

            chats.forEach(
                (chat) => {

                    chat.style.display =
                        "none";
                }
            );


            chatIndex =
                0;


            revealChat();

        };
}


/*
   Reveal bouquet messages
   one by one.
*/

function revealChat() {

    if (
        chatIndex >=
        chats.length
    ) {


        if (surpriseBtn) {

            surpriseBtn.classList.remove(
                "hidden"
            );
        }


        return;
    }


    const chat =
        chats[
            chatIndex
        ];


    chat.style.display =
        "block";


    chatIndex++;


    setTimeout(
        revealChat,
        850
    );
}


/*
   Go to final letter.
*/

if (surpriseBtn) {

    surpriseBtn.onclick =
        () => {

            go("letter");

        };
}


/* =========================================================
   FINAL LETTER
   ========================================================= */

const finalText = `Happy Birthday, Nikita! ❤️🎂 Again!

I genuinely wish you good health, happiness, peace and everything you want to achieve in life. May God bless you with all the success you deserve, keep you away from bad people, negativity and every evil eye, and always surround you with good, genuine and positive people. ✨🧿

I really wanted to wish you personally, face to face, but since I'm a little far away, this is my small message to you. ❤️

Honestly, as 2026 is coming to an end, meeting you is definitely one of the best things that happened to me this year. It's only been a few months, but you've become someone I can talk to without thinking twice. There's a different kind of comfort with you — somewhere between a best friend and a sibling. 🤍

Keep shining, keep growing, keep studying, keep making money, but most importantly, keep doing everything happily. Because everything feels better when you're happy. 🌻

Really enjoying this journey with you. Stay the same, stay close, and keep being you. ❤️

Happy Birthday once again, Kuchu muchu! 🎉
May you always stay blessed, happy and protected. 🧿✨`;


/* =========================================================
   LETTER BOX
   ========================================================= */

const box =
    document.getElementById(
        "box"
    );

const replay =
    document.getElementById(
        "replay"
    );


if (box) {

    box.onclick =
        () => {


            /*
               Prevent double clicking.
            */

            if (
                box.classList.contains(
                    "open"
                )
            ) {
                return;
            }


            box.classList.add(
                "open"
            );


            setTimeout(
                () => {

                    const letterText =
                        document.getElementById(
                            "letterText"
                        );

                    const typedMessage =
                        document.getElementById(
                            "typedMessage"
                        );

                    const cursor =
                        document.getElementById(
                            "cursor"
                        );

                    const signature =
                        document.getElementById(
                            "signature"
                        );


                    if (letterText) {

                        letterText.classList.remove(
                            "hidden"
                        );
                    }


                    if (typedMessage) {

                        typedMessage.textContent =
                            "";
                    }


                    if (cursor) {

                        cursor.classList.remove(
                            "hidden"
                        );
                    }


                    if (signature) {

                        signature.classList.add(
                            "hidden"
                        );
                    }


                    if (replay) {

                        replay.classList.add(
                            "hidden"
                        );
                    }


                    let i =
                        0;


                    const timer =
                        setInterval(
                            () => {


                                if (
                                    typedMessage
                                ) {

                                    typedMessage.textContent +=
                                        finalText[
                                            i
                                        ] ||
                                        "";
                                }


                                i++;


                                if (
                                    i >=
                                    finalText.length
                                ) {


                                    clearInterval(
                                        timer
                                    );


                                    if (cursor) {

                                        cursor.classList.add(
                                            "hidden"
                                        );
                                    }


                                    if (signature) {

                                        signature.classList.remove(
                                            "hidden"
                                        );
                                    }


                                    if (replay) {

                                        replay.classList.remove(
                                            "hidden"
                                        );
                                    }


                                    burst(
                                        "💗"
                                    );

                                }

                            },
                            24
                        );

                },
                650
            );

        };
}


/* =========================================================
   REPLAY
   ========================================================= */

if (replay) {

    replay.onclick =
        () => {

            location.reload();

        };
}


/* =========================================================
   CONFETTI / BURST
   ========================================================= */

function burst(symbol) {

    const confetti =
        document.getElementById(
            "confetti"
        );


    if (!confetti) {
        return;
    }


    for (
        let i = 0;
        i < 12;
        i++
    ) {

        const item =
            document.createElement(
                "span"
            );


        item.textContent =
            symbol;


        item.style.cssText =
            `
            position:fixed;
            left:${40 + Math.random() * 20}%;
            top:${45 + Math.random() * 15}%;
            z-index:99999;
            font-size:22px;
            pointer-events:none;
            animation:float 2s ease forwards;
            `;


        confetti.appendChild(
            item
        );


        setTimeout(
            () => {

                item.remove();

            },
            2100
        );
    }
}


/* =========================================================
   INITIAL STATE
   ========================================================= */

go("welcome");