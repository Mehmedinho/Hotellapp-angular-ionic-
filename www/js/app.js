angular.module('ArtistApp', ['ionic'])

// Lägg till denna metod för att visa flikarna längst ner på Android.
.config(function($ionicConfigProvider) {
  $ionicConfigProvider.platform.android.tabs.position("bottom");
 })

.config(function($stateProvider, $urlRouterProvider){

$stateProvider
.state("tabs" , {
  url : "/tab" ,
  abstract:true,
  templateUrl : "templates/tabs.html"
})

.state("tabs.home" , {
  url : "/home" ,
  views : {
    "home-tab" : {
      templateUrl : "templates/home.html"
    }
  }
})

.state("tabs.list" , {
  url : "/list" ,
  views : {
    "list-tab" : {
      controller : "ListController",
      templateUrl: "templates/list.html"
    }
  }
})
.state("tabs.detail", {
  url : "/list/:aID",
  views :{
    "list-tab" : {
      templateUrl : "templates/detail.html" ,
      controller : "ListController"
    }
  }
})

  $urlRouterProvider.otherwise("/tab/home");
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


// My Controllers
.controller("ListController",function($scope,$http,$state,$stateParams,$ionicPopup,$timeout,$filter){

  // Hämta JSON-listan via HTTP
  $http.get('../model/data.json')
       .success(function(data){
         $scope.artists = data;

         $scope.whichartist = $state.params.aID;
         console.log($scope.whichartist);

         // $state innehåller all info om en aktuell state
         console.log("$state : " + $state);

         // $stateParams innehåller enbart info om
         // parametrar t.ex. aID som vi skickar via href
         // Titta i filen list.html under ion-item
         console.log("$stateParams : " + $stateParams.aID);

        })


  $scope.data = {};

  
  $scope.submit = function(){

    
      console.log($scope.data);

      $scope.showAlert = function(){

      };
      var alertPopup = $ionicPopup.alert({
      scope:$scope,
      title: "Bokning godkänd",
      template: "<h5> <br> Start datum:" +" "+ $scope.data.dates1 + "</h5>" +
      "<h5> <br> Slut datum:" +" "+ $scope.data.dates2 +"</h5>" +
      "<h7> <br> Vuxna:" +" "+ $scope.data.vuxna + "</h7>" +
      "<h7> <br> Barn:" +" "+ $scope.data.barn + "</h7>" +
      "<h5> <br> Namn:" +" "+ $scope.data.name + "</h5>" +
      "<h5> <br> Efternamn:" +" "+ $scope.data.efternamn + "</h5>" +
      "<h6> <br> Email:" +" "+ $scope.data.email + "</h6>" +
      "<h5> <br> Telefonnummer:" +" "+ $scope.data.number + "</h5>" +
      "<h5> <br> Hotel:" +" "+ $scope.whichartist + "</h5>" +
      "<h4> <br> Pris:" +" "+ $scope.totalPrice + "</h4>"
      
      
     
    });

  }

  $scope.diffDate = function(dates1, dates2){

    var startdatum = new Date(dates1);
    var slutdatum = new Date(dates2);
    
    var timeDiff = Math.abs(slutdatum.getTime() - startdatum.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    var diffD=parseInt(diffDays);
    if(diffD==0){
      diffD = 1;
    }
    $scope.diffD=diffD;
    return diffD;
};

$scope.today = $filter("date")(Date.now(), 'yyyy-MM-dd');

$scope.getbookdate=function(){
$scope.bookdate= $filter("date")($scope.data.dates1, 'yyyy-MM-dd');
console.log($scope.bookdate);
}

$scope.confirm=function(){
$scope.totalPrice = ($scope.data.price-0) * $scope.diffD;
$scope.data.days = $scope.diffD;
$scope.data.totPrice = $scope.totalPrice;
console.log($scope.diffD);
console.log($scope.totalPrice);
}

//$scope.totPrice = function(diffD, price){
  //var pricesingle = price;
  //var total = parseInt(days) * parseInt(pricesingle);
  //$scope.tot=total;
  //return total;
//};

   

  $scope.doRefresh = function() {
    $http.get('../model/data.json')
    .success(function(data){
      $scope.artists = data;
     })
     .finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    });

  }

})
