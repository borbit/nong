(function(ns) {
    var hasRequire = (typeof require !== 'undefined'),
        constants = hasRequire ? require('constants') : window.Pong.Constants;
    
    ns.GameState = function() {
        var gameState           = constants.GAME_STATE_IN_PROGRESS;
        var leftPlayerState     = constants.PLAYER_STATE_FREE;
        var rightPlayerState    = constants.PLAYER_STATE_FREE;
        
        function setGameState(state) {
            gameState = state;
        }
        
        function getGameState() {
            return gameState;
        }
        
        function setLeftPlayerState(state) {
            leftPlayerState = state;
        }
        
        function getLeftPlayerState() {
            return leftPlayerState;
        }
        
        function setRightPlayerState(state) {
            rightPlayerState = state;
        }
        
        function getRightPlayerState() {
            return rightPlayerState;
        }
        
        function getName() {
            return 'GameState';
        }
        
        function getData() {
            return {
                gameState: gameState,
                leftPlayerState: leftPlayerState,
                rightPlayerState: rightPlayerState
            };
        }
        
        function setData(data) {
            gameState           = data.gameState;
            leftPlayerState     = data.leftPlayerState;
            rightPlayerState    = data.rightPlayerState;
        }
        
        var self = {
            setGameState: setGameState,
            getGameState: getGameState,
            setLeftPlayerState: setLeftPlayerState,
            getLeftPlayerState: getLeftPlayerState,
            setRightPlayerState: setRightPlayerState,
            getRightPlayerState: getRightPlayerState,
            getName: getName,
            getData: getData,
            setData: setData
        };

        return self;
    };
    
    ns.JoinLeft = function() {
        function getName() {
            return 'JoinLeft';
        }
        
        function getData() {
            return {};
        }
        
        function setData() {
        }
        
        var self = {
            getName: getName,
            getData: getData,
            setData: setData
        };
        return self;
    };
    
    ns.JoinRight = function() {
        function getName() {
            return 'JoinRight';
        }
        
        function getData() {
            return {};
        }
        
        function setData() {
        }
        
        var self = {
            getName: getName,
            getData: getData,
            setData: setData
        };
        return self;
    };
    
}((typeof exports === 'undefined') ? window.Pong.Packets = {} : exports));
