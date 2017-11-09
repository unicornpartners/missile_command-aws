// Unicorn Command
var unicornCommand = (function() {
  var canvas = document.querySelector( 'canvas' ),
      ctx = canvas.getContext( '2d' );

  // Constants
  var CANVAS_WIDTH  = canvas.width,
      CANVAS_HEIGHT = canvas.height,
      UNICORN = {
        active: 1,
        exploding: 2,
        imploding: 3,
        exploded: 4
      };

  // Variables
  var score = 0,
      level = 1,
      cities = [],
      antiUnicornBatteries = [],
      playerUnicorns = [],
      enemyUnicorns = [],
      timerID;

  // Create cities and anti unicorn batteries at the start of the game
  var initialize = function() {
    // Bottom left position of city
    cities.push( new City( 80,  430 ) );
    cities.push( new City( 130, 430 ) );
    cities.push( new City( 180, 430 ) );
    cities.push( new City( 300, 430 ) );
    cities.push( new City( 350, 430 ) );
    cities.push( new City( 400, 430 ) );

    // Top middle position of anti unicorn battery
    antiUnicornBatteries.push( new AntiUnicornBattery( 35,  410 ) );
    antiUnicornBatteries.push( new AntiUnicornBattery( 255, 410 ) );
    antiUnicornBatteries.push( new AntiUnicornBattery( 475, 410 ) );
    initializeLevel();
  };

  // Reset various variables at the start of a new level
  var initializeLevel = function() {
    $.each( antiUnicornBatteries, function( index, amb ) {
      amb.unicornsLeft = 10;
    });
    playerUnicorns = [];
    enemyUnicorns = [];
    createEmemyUnicorns();
    drawBeginLevel();
  };

  // Create a certain number of enemy unicorns based on the game level
  var createEmemyUnicorns = function() {
    var targets = viableTargets(),
        numUnicorns = ( (level + 7) < 30 ) ? level + 7 : 30;
    for( var i = 0; i < numUnicorns; i++ ) {
      enemyUnicorns.push( new EnemyUnicorn(targets) );
    }
  };

  // Get a random number between min and max, inclusive
  var rand = function( min, max ) {
    return Math.floor( Math.random() * (max - min + 1) ) + min;
  };

  // Show various graphics shown on most game screens
  var drawGameState = function() {
    drawBackground();
    drawCities();
    drawAntiUnicornBatteries();
    drawScore();
  };

  var drawBeginLevel = function() {
    drawGameState();
    drawLevelMessage();
  };

  // Show current score
  var drawScore = function() {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px arial';
    ctx.fillText( 'Score ' + score, 25, 25 );
  };

  // Show message before a level begins
  var drawLevelMessage = function() {
    ctx.fillStyle = '#ff7cd8';
    ctx.font = 'bold 20px arial';
    ctx.fillText( 'CLICK TO START LEVEL', 130, 180 );
    ctx.fillStyle = 'white';
    ctx.fillText( ' ' + level, 370, 180 );

    ctx.fillText( '' + getMultiplier(), 195, 245 );
    ctx.fillStyle = '#ff7cd8';
    ctx.fillText( 'X  POINTS', 215, 245 );

    ctx.fillText( 'DEFEND', 100, 355 );
    ctx.fillText( 'CITIES', 330, 355 );
  };

  // Show bonus points at end of a level
  var drawEndLevel = function( unicornsLeft, unicornsBonus,
                               citiesSaved, citiesBonus ) {
    drawGameState();
    ctx.fillStyle = '#ff7cd8';
    ctx.font = 'bold 20px arial';
    ctx.fillText( 'BONUS POINTS', 150, 149 );
    ctx.fillStyle = 'white';
    ctx.fillText( '' + unicornsBonus, 170, 213 );
    ctx.fillStyle = '#ff7cd8';
    ctx.fillText( 'Unicorns Left: ' + unicornsLeft, 230, 213 );
    ctx.fillStyle = 'white';
    ctx.fillText( '' + citiesBonus, 170, 277 );
    ctx.fillStyle = '#ff7cd8';
    ctx.fillText( 'Cities Saved: ' + citiesSaved, 230, 277 );
  };

  // Show simple graphic at end of game
  var drawEndGame = function() {
    ctx.fillStyle = 'white';
    ctx.fillRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );

    // Yellow hexagon
    ctx.fillStyle = '#d695ef';
    ctx.beginPath();
    ctx.moveTo( 255, 30  );
    ctx.lineTo( 396, 89  );
    ctx.lineTo( 455, 230 );
    ctx.lineTo( 396, 371 );
    ctx.lineTo( 255, 430 );
    ctx.lineTo( 114, 371 );
    ctx.lineTo( 55,  230 );
    ctx.lineTo( 114, 89  );
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 85px arial';
    ctx.fillText( 'THE END', 70, 260 );

    ctx.fillStyle = '#d695ef';
    ctx.font = 'bold 26px arial';
    ctx.fillText( 'Final Score: ' + score, 80, 20 );
    ctx.fillText( 'CLICK TO PLAY NEW GAME', 80, 458 );

  };

  // Draw all active cities
  var drawCities = function() {
    $.each( cities, function( index, city ) {
      if( city.active ) {
        city.draw();
      }
    });
  };

  // Draw unicorns in all anti unicorn batteries
  var drawAntiUnicornBatteries = function() {
    $.each( antiUnicornBatteries, function( index, amb ) {
      amb.draw();
    });
  };

  // Get the factor by which the score earned in a level will
  // be multiplied by (maximum factor of 6)
  var getMultiplier = function() {
    return ( level > 10 ) ? 6 : Math.floor( (level + 1) / 2 );
  };

  // Show the basic game background
  var drawBackground = function() {
    // Black background
    ctx.fillStyle = '#6b41e8';
    ctx.fillRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );

    // Yellow area at bottom of screen for cities and
    // anti unicorn batteries
    ctx.fillStyle = '#c188d7';
    ctx.beginPath();
    ctx.moveTo( 0, 460 );
    ctx.lineTo( 0,  430 );
    ctx.lineTo( 25, 410 );
    ctx.lineTo( 45, 410 );
    ctx.lineTo( 70, 430 );
    ctx.lineTo( 220, 430 );
    ctx.lineTo( 245, 410 );
    ctx.lineTo( 265, 410 );
    ctx.lineTo( 290, 430 );
    ctx.lineTo( 440, 430 );
    ctx.lineTo( 465, 410 );
    ctx.lineTo( 485, 410 );
    ctx.lineTo( 510, 430 );
    ctx.lineTo( 510, 460 );
    ctx.closePath();
    ctx.fill();
  };

  // Constructor for a City
  function City( x, y ) {
    this.x = x;
    this.y = y;
    this.active = true;
  }

  // Show a city based on its position
  City.prototype.draw = function() {
    var x = this.x,
        y = this.y;

    ctx.fillStyle = '#fd9fe1';
    ctx.beginPath();
    ctx.moveTo( x, y );
    ctx.lineTo( x, y - 10 );
    ctx.lineTo( x + 10, y - 10 );
    ctx.lineTo( x + 15, y - 15 );
    ctx.lineTo( x + 20, y - 10 );
    ctx.lineTo( x + 30, y - 10 );
    ctx.lineTo( x + 30, y );
    ctx.closePath();
    ctx.fill();
  };

  // Constructor for an Anti Unicorn Battery
  function AntiUnicornBattery( x, y ) {
    this.x = x;
    this.y = y;
    this.unicornsLeft = 10;
  }

  AntiUnicornBattery.prototype.hasUnicorn = function() {
    return !!this.unicornsLeft;
  };

  // Show the unicorns left in an anti unicorn battery
  AntiUnicornBattery.prototype.draw = function() {
    var x, y;
    var delta = [ [0, 0], [-6, 6], [6, 6], [-12, 12], [0, 12],
                  [12, 12], [-18, 18], [-6, 18], [6, 18], [18, 18] ];

    var base_image = new Image();
    base_image.src = 'assets/images/unicorn.png';

    for( var i = 0, len = this.unicornsLeft; i < len; i++ ) {
      x = this.x + delta[i][0] - 8;
      y = this.y + delta[i][1];

      // Draw a unicorn
      ctx.drawImage(base_image, x, y);
    }
  };

  // Constructor for a Unicorn, which may be the player's unicorn or
  // the enemy's unicorn.
  // The options argument used to create the unicorn is expected to
  // have startX, startY, endX, and endY to define the unicorn's path
  // as well as color and trailColor for the unicorn's appearance
  function Unicorn( options ) {
    this.startX = options.startX;
    this.startY = options.startY;
    this.endX = options.endX;
    this.endY = options.endY;
    this.color = options.color;
    this.trailColor = options.trailColor;
    this.x = options.startX;
    this.y = options.startY;
    this.state = UNICORN.active;
    this.width = 2;
    this.height = 2;
    this.explodeRadius = 0;
  }

  // Draw the path of a unicorn or an exploding unicorn
  Unicorn.prototype.draw = function() {
    if( this.state === UNICORN.active ){
      ctx.strokeStyle = this.trailColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo( this.startX, this.startY );
      ctx.lineTo( this.x, this.y );
      ctx.stroke();

      ctx.fillStyle = this.color;
      ctx.fillRect( this.x - 1, this.y - 1, this.width, this.height );
    } else if( this.state === UNICORN.exploding ||
               this.state === UNICORN.imploding ) {

      var gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.explodeRadius);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(3.9 / 10, 'transparent');
      gradient.addColorStop(4 / 10, '#fea3aa');
      gradient.addColorStop(4.9 / 10, '#fea3aa');
      gradient.addColorStop(5 / 10, '#f8b88b');
      gradient.addColorStop(5.9 / 10, '#f8b88b');
      gradient.addColorStop(6 / 10, '#faf884');
      gradient.addColorStop(6.9 / 10, '#faf884');
      gradient.addColorStop(7 / 10, '#baed91');
      gradient.addColorStop(7.9 / 10, '#baed91');
      gradient.addColorStop(8 / 10, '#b2cefe');
      gradient.addColorStop(8.9 / 10, '#b2cefe');
      gradient.addColorStop(9 / 10, '#f2a2e8');
      gradient.addColorStop(10 / 10, '#f2a2e8');
      ctx.fillStyle = gradient;

      // ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc( this.x, this.y, this.explodeRadius, 0, Math.PI, true);
      ctx.closePath();

      explodeOtherUnicorns( this, ctx );

      ctx.fill();
    }
  };

  // Handle update to help with animating an explosion
  Unicorn.prototype.explode = function() {
    if( this.state === UNICORN.exploding ) {
      this.explodeRadius++;
    }
    if( this.explodeRadius > 30 ) {
      this.state = UNICORN.imploding;
    }
    if( this.state === UNICORN.imploding ) {
      this.explodeRadius--;
      if( this.groundExplosion ) {
        ( this.target[2] instanceof City ) ? this.target[2].active = false
                                        : this.target[2].unicornsLeft = 0;
      }
    }
    if( this.explodeRadius < 0 ) {
      this.state = UNICORN.exploded;
    }
  };

  // Constructor for the Player's Unicorn, which is a subclass of Unicorn
  // and uses Unicorn's constructor
  function PlayerUnicorn( source, endX, endY ) {
    // Anti unicorn battery this unicorn will be fired from
    var amb = antiUnicornBatteries[source];

    Unicorn.call( this, { startX: amb.x,  startY: amb.y,
                          endX: endX,     endY: endY,
                          color: '#ff42c1', trailColor: 'white' } );

    var xDistance = this.endX - this.startX,
        yDistance = this.endY - this.startY;
    // Determine a value to be used to scale the orthogonal directions
    // of travel so the unicorns travel at a constant speed and in the
    // right direction
    var scale = (function() {
      var distance = Math.sqrt( Math.pow(xDistance, 2) +
                                Math.pow(yDistance, 2) ),
          // Make unicorn fired from central anti unicorn battery faster
          distancePerFrame = ( source === 1 ) ? 20 : 12;

      return distance / distancePerFrame;
    })();

    this.dx = xDistance / scale;
    this.dy = yDistance / scale;
    amb.unicornsLeft--;
  }

  // Make PlayerUnicorn inherit from Unicorn
  PlayerUnicorn.prototype = Object.create( Unicorn.prototype );
  PlayerUnicorn.prototype.constructor = PlayerUnicorn;

  // Update the location and/or state of this unicorn of the player
  PlayerUnicorn.prototype.update = function() {
    if( this.state === UNICORN.active && this.y <= this.endY ) {
      // Target reached
      this.x = this.endX;
      this.y = this.endY;
      this.state = UNICORN.exploding;
    }
    if( this.state === UNICORN.active ) {
      this.x += this.dx;
      this.y += this.dy;
    } else {
      this.explode();
    }
  };

  // Create a unicorn that will be shot at indicated location
  var playerShoot = function( x, y ) {
    if( y >= 50 && y <= 370 ) {
      var source = whichAntiUnicornBattery( x );
      if( source === -1 ){ // No unicorns left
        return;
      }
      playerUnicorns.push( new PlayerUnicorn( source, x, y ) );
    }
  };

  // Constructor for the Enemy's Unicorn, which is a subclass of Unicorn
  // and uses Unicorn's constructor
  function EnemyUnicorn( targets ) {
    var startX = rand( 0, CANVAS_WIDTH ),
        startY = 0,
        // Create some variation in the speed of unicorns
        offSpeed = rand(80, 120) / 100,
        // Randomly pick a target for this unicorn
        target = targets[ rand(0, targets.length - 1) ],
        framesToTarget;

    Unicorn.call( this, { startX: startX,  startY: startY,
                          endX: target[0], endY: target[1],
                          color: 'white', trailColor: '#ff42c1' } );

    framesToTarget = ( 650 - 30 * level ) / offSpeed;
    if( framesToTarget < 20 ) {
      framesToTarget = 20;
    }
    this.dx = ( this.endX - this.startX ) / framesToTarget;
    this.dy = ( this.endY - this.startY ) / framesToTarget;

    this.target = target;
    // Make unicorns heading to their target at random times
    this.delay = rand( 0, 50 + level * 15 );
    this.groundExplosion = false;
  }

  // Make EnemyUnicorn inherit from Unicorn
  EnemyUnicorn.prototype = Object.create( Unicorn.prototype );
  EnemyUnicorn.prototype.constructor = EnemyUnicorn;

  // Update the location and/or state of an enemy unicorn.
  // The unicorn doesn't begin it's flight until its delay is past.
  EnemyUnicorn.prototype.update = function() {
    if( this.delay ) {
      this.delay--;
      return;
    }
    if( this.state === UNICORN.active && this.y >= this.endY ) {
      // Unicorn has hit a ground target (City or Anti Unicorn Battery)
      this.x = this.endX;
      this.y = this.endY;
      this.state = UNICORN.exploding;
      this.groundExplosion = true;
    }
    if( this.state === UNICORN.active ) {
      this.x += this.dx;
      this.y += this.dy;
    } else {
      this.explode();
    }
  };

  // When a unicorn that did not hit the ground is exploding, check if
  // any enemy unicorn is in the explosion radius; if so, cause that
  // enemy unicorn to begin exploding too.
  var explodeOtherUnicorns = function( unicorn, ctx ) {
    if( !unicorn.groundExplosion ){
      $.each( enemyUnicorns, function( index, otherUnicorn ) {
        if( ctx.isPointInPath( otherUnicorn.x, otherUnicorn.y ) &&
            otherUnicorn.state === UNICORN.active ) {
          score += 25 * getMultiplier();
          otherUnicorn.state = UNICORN.exploding;
        }
      });
    }
  };

  // Get targets that may be attacked in a game Level. All targets
  // selected here may not be attacked, but no target other than those
  // selected here will be attacked in a game level.
  // Note that at most 3 cities may be attacked in any level.
  var viableTargets = function() {
    var targets = [];

    // Include all active cities
    $.each( cities, function( index, city ) {
      if( city.active ) {
        targets.push( [city.x + 15, city.y - 10, city] );
      }
    });

    // Randomly select at most 3 cities to target
    while( targets.length > 3 ) {
      targets.splice( rand(0, targets.length - 1), 1 );
    }

    // Include all anti unicorn batteries
    $.each( antiUnicornBatteries, function( index, amb ) {
      targets.push( [amb.x, amb.y, amb]);
    });

    return targets;
  };

  // Operations to be performed on each game frame leading to the
  // game animation
  var nextFrame = function() {
    drawGameState();
    updateEnemyUnicorns();
    drawEnemyUnicorns();
    updatePlayerUnicorns();
    drawPlayerUnicorns();
    checkEndLevel();
  };

  // Check for the end of a Level, and then if the game is also ended
  var checkEndLevel = function() {
    if( !enemyUnicorns.length ) {
      // Stop animation
      stopLevel();
      $( '.container' ).off( 'click' );
      var unicornsLeft = totalUnicornsLeft(),
          citiesSaved  = totalCitiesSaved();

      !citiesSaved ? endGame( unicornsLeft )
                   : endLevel( unicornsLeft, citiesSaved );
    }
  };

  // Handle the end of a level
  var endLevel = function( unicornsLeft, citiesSaved ) {
    var unicornsBonus = unicornsLeft * 5 * getMultiplier(),
        citiesBonus = citiesSaved * 100 * getMultiplier();

    drawEndLevel( unicornsLeft, unicornsBonus,
                  citiesSaved, citiesBonus );

    // Show the new game score after 2 seconds
    setTimeout( function() {
      score += unicornsBonus + citiesBonus;
      drawEndLevel( unicornsLeft, unicornsBonus,
                    citiesSaved, citiesBonus );
    }, 2000 );

    setTimeout( setupNextLevel, 4000 );
  };

  // Move to the next level
  var setupNextLevel = function() {
    level++;
    initializeLevel();
    setupListeners();
  };

  // Handle the end of the game
  var endGame = function( unicornsLeft ) {
    score += unicornsLeft * 5 * getMultiplier();
    drawEndGame();

    $( 'body' ).on( 'click', 'div', function() {
      location.reload();
    });
  };

  // Get unicorns left in all anti unicorn batteries at the end of a level
  var totalUnicornsLeft = function() {
    var total = 0;
    $.each( antiUnicornBatteries, function(index, amb) {
      total += amb.unicornsLeft;
    });
    return total;
  };

  // Get count of undestroyed cities
  var totalCitiesSaved = function() {
    var total = 0;
    $.each( cities, function(index, city) {
      if( city.active ) {
        total++;
      }
    });
    return total;
  };

  // Update all enemy unicorns and remove those that have exploded
  var updateEnemyUnicorns = function() {
    $.each( enemyUnicorns, function( index, unicorn ) {
      unicorn.update();
    });
    enemyUnicorns = enemyUnicorns.filter( function( unicorn ) {
      return unicorn.state !== UNICORN.exploded;
    });
  };

  // Draw all enemy unicorns
  var drawEnemyUnicorns = function() {
    $.each( enemyUnicorns, function( index, unicorn ) {
      unicorn.draw();
    });
  };

  // Update all player's unicorns and remove those that have exploded
  var updatePlayerUnicorns = function() {
    $.each( playerUnicorns, function( index, unicorn ) {
      unicorn.update();
    });
    playerUnicorns = playerUnicorns.filter( function( unicorn ) {
      return unicorn.state !== UNICORN.exploded;
    });
  };

  // Draw all player's unicorns
  var drawPlayerUnicorns = function() {
    $.each( playerUnicorns, function( index, unicorn ) {
      unicorn.draw();
    });
  };

  // Stop animating a game level
  var stopLevel = function() {
    clearInterval( timerID );
  };

  // Start animating a game level
  var startLevel = function() {
    var fps = 30;
    timerID = setInterval( nextFrame, 1000 / fps );
  };

  // Determine which Anti Unicorn Battery will be used to serve a
  // player's request to shoot a unicorn. Determining factors are
  // where the unicorn will be fired to and which anti unicorn
  // batteries have unicorn(s) to serve the request
  var whichAntiUnicornBattery = function( x ) {
    var firedToOuterThird = function( priority1, priority2, priority3) {
      if( antiUnicornBatteries[priority1].hasUnicorn() ) {
        return priority1;
      } else if ( antiUnicornBatteries[priority2].hasUnicorn() ) {
        return priority2;
      } else {
        return priority3;
      }
    };

    var firedtoMiddleThird = function( priority1, priority2 ) {
      if( antiUnicornBatteries[priority1].hasUnicorn() ) {
        return priority1;
      } else {
        return priority2;
      }
    };

    if( !antiUnicornBatteries[0].hasUnicorn() &&
        !antiUnicornBatteries[1].hasUnicorn() &&
        !antiUnicornBatteries[2].hasUnicorn() ) {
      return -1;
    }
    if( x <= CANVAS_WIDTH / 3 ){
      return firedToOuterThird( 0, 1, 2 );
    } else if( x <= (2 * CANVAS_WIDTH / 3) ) {
      if ( antiUnicornBatteries[1].hasUnicorn() ) {
        return 1;
      } else {
        return ( x <= CANVAS_WIDTH / 2 ) ? firedtoMiddleThird( 0, 2 )
                                         : firedtoMiddleThird( 2, 0 );
      }
    } else {
      return firedToOuterThird( 2, 1, 0 );
    }
  };

  // Attach event Listeners to handle the player's input
  var setupListeners = function() {
    $( '.container' ).one( 'click', function() {
      startLevel();

      $( '.container' ).on( 'click', function( event ) {
        playerShoot( event.pageX - this.offsetLeft,
                     event.pageY - this.offsetTop );
      });
    });
  };

  return {
    initialize: initialize,
    setupListeners: setupListeners
  };

})();

$( document ).ready( function() {
  unicornCommand.initialize();
  unicornCommand.setupListeners();
});
