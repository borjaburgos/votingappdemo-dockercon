var app = angular.module('catsvsdogs', []);
var socket = io.connect("http://192.168.99.100:5002");

var bg1 = document.getElementById('background-stats-1');
var bg2 = document.getElementById('background-stats-2');
var bg3 = document.getElementById('background-stats-3');

app.controller('statsCtrl', function($scope){
  var randomColor = function(){
    var r = (Math.round(Math.random()* 127) + 127).toString(16);
    var g = (Math.round(Math.random()* 127) + 127).toString(16);
    var b = (Math.round(Math.random()* 127) + 127).toString(16);
    return '#' + r + g + b;
  };
  var animateStats = function(a,b,c){
    var percentA = a/(a+b+c)*100;
    var percentB = b/(a+b+c)*100;
    var percentC = 100 - percentA - percentB;
    bg1.style.width= percentA+"%";
    bg2.style.width = percentB+"%";
    bg3.style.width = percentC+"%";
  };

  var updateScores = function(){
    socket.on('scores', function (data) {
       data = JSON.parse(data);
       animateStats(data.cats, data.dogs, data.whales);
    });
  };

  var init = function(){
    document.body.style.opacity=1;
    updateScores();
    $scope.$apply(function(){
      $scope.color = [];
      $scope.color[0] = randomColor();
      $scope.color[1] = randomColor();
      $scope.color[2] = randomColor();
    });
  };
  socket.on('message',function(data){
    animateStats(data.cats, data.dogs, data.whales);
    init();
  });
});
