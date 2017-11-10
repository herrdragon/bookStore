var app = angular.module('alphauno', ['ui.router', 'jkAngularRatingStars', 'ngMaterial']);

app.config(['$stateProvider', '$urlRouterProvider',
function ($stateProvider, $urlRouterProvider) {
   // $urlRouterProvider.otherwise('/home');
    $stateProvider
     .state("home", {
          //controller:'MainCtrl',
          url:"/home",
          templateUrl: "views/home.html",
          controller: function($scope) {
            $scope.readOnly = true;
            $scope.sf  = localStorage.sf  == 'true'? true:false;
            $scope.ts  = localStorage.ts  == 'true'? true:false;
            $scope.sh  = localStorage.sh  == 'true'? true:false;
            $scope.adv = localStorage.adv == 'true'? true:false;
            $scope.all = localStorage.all == 'true'? true:false;
            if (!$scope.sf && !$scope.sh && !$scope.adv && !$scope.all) {$scope.ts = true;}
          },
    		  resolve: {
                  ListOfbooks: function($http){
                      books = [];
                      $http.get("http://localhost:8080/books/list", {},{headers:{"Content-Type":"application/json"}}).then(function(response) {books = response.data;}, function(err) {    });
                      return books;
                  }
		  }
      })
      .state("register", {
          controller:'MainCtrl',
          url:"/register",
          templateUrl: 'views/register.html'
      })
      .state("profile", {
          controller:'MainCtrl',
          url:"/profile",
          templateUrl: 'views/profile.html'
      })
      .state("personal", {
          controller:'MainCtrl',
          parent:'profile',
          url:"/personal",
          templateUrl: 'views/personal.html'
      })
      .state("shipping", {
          controller:'MainCtrl',
          parent:'profile',
          url:"/shipping",
          templateUrl: 'views/shipping.html'
      })
      .state("cc", {
          controller:'MainCtrl',
          parent:'profile',
          url:"/cc",
          templateUrl: 'views/cc.html'
      })
      .state("ShoppingCart", {
          controller:'MainCtrl',
          url:"/ShoppingCart",
          templateUrl: 'views/ShoppingCart.html'
      })
       .state("bookDetails", {
          // controller:'MainCtrl',
          url:"/bookDetails/:bookid",
            templateUrl: 'views/bookDetails.html',
            controller: function($scope){
                $scope.book = book;
            },
            resolve: {
                book: function($stateParams) {
                    book = "emptyBook";
                    for(var i = 0; i < books.length; i++){
                        if(books[i].ID == $stateParams.bookid){
                            // console.log("book found");
                            // console.log(books[i]);
                            book = books[i];
                            return books[i];
                        }
                    }
                }
            }
      })

}]);

app.controller('MainCtrl', function($scope, $http, $state, $timeout) {
    $scope.currentuser = $scope.currentuser;
    $scope.username = $scope.username;
    $scope.email = $scope.email;
    $scope.password = $scope.password;
    $scope.minpassword = 6;
    $scope.maxpassword = 20;
    $scope.books = [];
    $scope.authorization = localStorage.authorization;
    simpleCart.update();
  var LaterCart = simpleCart.copy( "LaterCart" );

    $scope.getBooks = function() {
        $http.get("http://localhost:8080/books/list", {},
                   {headers:{"Content-Type":"application/json"}}).then(function(response) {
            $scope.books = response.data;
            // console.log($scope.books);
        }, function(err) {
            $('#mMessgTitle').text("Loading Error");
            $('#mMessgText').text(err.data.ErrorMsg);
            $('#mMessg').modal('show');
        });
    }
    $scope.getBooks();

    $scope.sortRating = function() {
		if($scope.sortParameter != 'Rating'){
			$scope.sortParameter = 'Rating';
			$scope.functionToSort = $scope.sortRating();
		} else
		$scope.functionToSort = !$scope.functionToSort;
        // console.log($scope.reverse);
    }

    $scope.sortParameter = 'Title';
    $scope.functionToSort = $scope.sortTitle;

    $scope.sortRating = function() {
    		if($scope.sortParameter != 'Rating'){
    			$scope.sortParameter = 'Rating';
    			$scope.functionToSort = $scope.sortRating();
    		} else
    		$scope.functionToSort = !$scope.functionToSort;
            // console.log($scope.reverse);
        }



	$scope.sortTitle = function() {
		if($scope.sortParameter != 'Title'){
		$scope.sortParameter = 'Title';
		$scope.functionToSort = $scope.sortTitle();
		} else
        $scope.functionToSort = !$scope.functionToSort;
        // console.log($scope.reverse);
    }

    $scope.display = function() {
        $scope.alertDisplayed = true;
      $timeout(function() {
        $scope.alertDisplayed = false;
      }, 2000)
    };
    $scope.alertDisplayed = false;

    $scope.getShippAddress = function(id) {
        $http.get("http://localhost:8080/address/shipping/" + id, {},
                   {headers:{"Content-Type":"application/json"}}).then(function(response) {
            $scope.shippingAddress = response.data.shipping;
            console.log($scope.shippingAddress);
        }, function(err) {
            $('#mMessgTitle').text("Loading Error");
            $('#mMessgText').text(err.data.ErrorMsg);
            $('#mMessg').modal('show');
        });
    }

    $scope.getCC = function(id) {
        $http.get("http://localhost:8080/user/cc/" + id, {},
                   {headers:{"Content-Type":"application/json"}}).then(function(response) {
            $scope.creditCards = response.data.cc;
            console.log($scope.creditCards);
        }, function(err) {
            $('#mMessgTitle').text("Loading Error");
            $('#mMessgText').text(err.data.ErrorMsg);
            $('#mMessg').modal('show');
        });
    }

    $scope.getUser = function() {
        $scope.currentuser = [];
        $scope.currentuser.push(JSON.parse(localStorage.user));
        if (localStorage.home) {$scope.currentuser.push(JSON.parse(localStorage.home));}
    }
    if (localStorage.user) {$scope.getUser()}

    $scope.login = function() {
        if (!$scope.username || !$scope.password) {
            $('#mMessgTitle').text("Login Error");
            $('#mMessgText').text("The Login and Password are required");
            $('#mMessg').modal('show');
            return false;
        }
        $http.defaults.withCredentials = true;
        $http.post("http://localhost:8080/user/login", {username:$scope.username, password:$scope.password},
                   {headers:{"Content-Type":"application/json"}}).then(function(response) {
                    // console.log(response);return;
            if (response.data.login) {
                $scope.authorization = localStorage.authorization = response.data.authorization;
                localStorage.user = JSON.stringify(response.data.user);
                $scope.currentuser = [];
                $scope.currentuser.push(JSON.parse(localStorage.user));
                if (response.data.home) {
                    localStorage.home = JSON.stringify(response.data.home);
                    $scope.currentuser.push(JSON.parse(localStorage.home));
                } else {
                    $scope.currentuser[1] = "";
                }
                // console.log($scope.currentuser[0]);
                // console.log($scope.currentuser[1]);
                $state.go("home");
                $scope.username = "";
                $scope.password = "";
            } else {
                $('#mMessgTitle').text("Login Error");
                $('#mMessgText').text("Username and Password don't match");
                $('#mMessg').modal('show');
                $scope.username = "";
                $scope.password = "";
            }

        }, function(err) {
            alert("An ERROR occurred")
        });
    }

    $scope.logout = function() {
        $http.post("http://localhost:8080/user/logout", {}, {headers:{"authorization":$scope.authorization}})
        .then(function() {
            $scope.authorization = localStorage.authorization = "";
            $scope.currentuser = localStorage.user = localStorage.home = "";
            $state.go("home");
        });
    };

    $scope.register = function() {
        if (!$scope.username || !$scope.password || !$scope.email) {
            $('#mMessgTitle').text("Register Error");
            $('#mMessgText').text("All fields are required");
            $('#mMessg').modal('show');
            return false;
        }

        $http.post("http://localhost:8080/user/create", {username:$scope.username, password:$scope.password, Email:$scope.email},
                   {headers:{"Content-Type":"application/json"}}).then(function(response) {
                    // console.log(response.data.registration);return;
                    if (response.data.registration) {
                        $('#mMessgTitle').text("Registration Success");
                        $('#mMessgText').text("You can login now");
                        $('#mMessg').modal('show');
                        $state.go("home");
                    } else {
                        $('#mMessgTitle').text("Registration Error");
                        $('#mMessgText').text("Please try again later");
                        $('#mMessg').modal('show');
                    }

        }, function(err) {
            $('#mMessgTitle').text("Registration Error");
            $('#mMessgText').text(err.data.ErrorMsg);
            $('#mMessg').modal('show');
            $scope.password = "";
        });
    }

    $scope.updateUser = function() {
            if (!$scope.currentuser[0].username || !$scope.currentuser[0].Email) {
                $('#mMessgTitle').text("Register Error");
                $('#mMessgText').text("All fields are required");
                $('#mMessg').modal('show');
                return false;
            }
            $http.put("http://localhost:8080/user/editUser", {ID:$scope.currentuser[0].ID, username:$scope.currentuser[0].username,
                Nickname:$scope.currentuser[0].Nickname, Password:$scope.currentuser[0].password, Email:$scope.currentuser[0].Email,
                FirstName:$scope.currentuser[0].FirstName, MiddleInitial:$scope.currentuser[0].MiddleInitial,
                LastName:$scope.currentuser[0].LastName, Country:$scope.currentuser[1].Country,
                City:$scope.currentuser[1].City, Street:$scope.currentuser[1].Street,
                State:$scope.currentuser[1].State, ZipCode:$scope.currentuser[1].ZipCode, Type:0
              }, {headers:{"Content-Type":"application/json", "authorization":localStorage.authorization}}).then(function(response) {
                  // console.log(response.data.update);return;
                  if (response.data.update == true) {
                      localStorage.user = JSON.stringify(response.data.user);
                      $scope.currentuser = [];
                      $scope.currentuser.push(JSON.parse(localStorage.user));
                      if (response.data.home) {
                          localStorage.home = JSON.stringify(response.data.home);
                          $scope.currentuser.push(JSON.parse(localStorage.home));
                      } else {
                          $scope.currentuser[1] = $scope.currentuser[1];
                      }
                      $scope.password = "";
                      $('#mMessgTitle').text("Profile");
                      $('#mMessgText').text("Update successful");
                      $('#mMessg').modal('show');
                  } else {
                      $('#mMessgTitle').text("Registration Error");
                      $('#mMessgText').text("WRONG PASSWORD!");
                      $('#mMessg').modal('show');
                      $scope.password = "";
                  }
              }, function(err) {
                  $('#mMessgTitle').text("Registration Error");
                  $('#mMessgText').text(err.data.ErrorMsg);
                  $('#mMessg').modal('show');
                  $scope.password = "";
              });
      }

    $scope.updateAddress = function(shipping){
        $http.put("http://localhost:8080/user/editAddress", {shipping},
            {headers:{"Content-Type":"application/json", "authorization":localStorage.authorization}}).then(function (response) {
                console.log(response.data);
                $scope.getShippAddress($scope.currentuser[0].ID);
                $state.go("profile/shipping");
        }, function (err) {
                $('#mMessgTitle').text("Update Shipping Error");
                $('#mMessgText').text(err.data.ErrorMsg);
                $('#mMessg').modal('show');
        });
    }

    $scope.addAddress = function(){
        $http.post("http://localhost:8080/user/addAddress", {OwnerID:$scope.currentuser[0].ID, Country:$scope.country,
            City:$scope.city, State:$scope.state, Street:$scope.street, ZipCode:$scope.zipcode, Type:$scope.type},
            {headers:{"Content-Type":"application/json", "authorization":localStorage.authorization}}).then(function (response) {
                $scope.getShippAddress($scope.currentuser[0].ID);
                $scope.country=$scope.city=$scope.state=$scope.street=$scope.zipcode="";
                $state.go("profile/shipping");
        }, function (err) {
                $('#mMessgTitle').text("Add Shipping Error");
                $('#mMessgText').text(err.data.ErrorMsg);
                $('#mMessg').modal('show');
        });
    }

    $scope.updateCC = function(cc){
        // console.log(cc);return;
        $http.put("http://localhost:8080/user/editCC", {cc},
            {headers:{"Content-Type":"application/json", "authorization":localStorage.authorization}}).then(function (response) {
                console.log(response.data);
                $scope.getCC($scope.currentuser[0].ID);
                $state.go("profile/cc");
        }, function (err) {
                $('#mMessgTitle').text("Update CC Error");
                $('#mMessgText').text(err.data.ErrorMsg);
                $('#mMessg').modal('show');
        });
    }

    $scope.addCC = function(){
        $http.post("http://localhost:8080/user/addCC", {OwnerID:$scope.currentuser[0].ID, FirstName:$scope.FirstName,
            MiddleInitial:$scope.MiddleInitial, LastName:$scope.LastName, Number:$scope.Number, SecurityCode:$scope.SecurityCode,
            ExpirationDate:$scope.ExpirationDate, Country:$scope.Country, City:$scope.City, State:$scope.State,
            Street:$scope.Street, ZipCode:$scope.ZipCode, Type:$scope.type},
            {headers:{"Content-Type":"application/json", "authorization":localStorage.authorization}}).then(function (response) {
                $scope.getCC($scope.currentuser[0].ID);
                $scope.ExpirationDate=$scope.FirstName=$scope.Country=$scope.City=$scope.State=$scope.Street=
                $scope.SecurityCode=$scope.Number=$scope.MiddleInitial=$scope.LastName=$scope.ZipCode="";
                $state.go("profile/cc");
        }, function (err) {
                $('#mMessgTitle').text("Add CC Error");
                $('#mMessgText').text(err.data.ErrorMsg);
                $('#mMessg').modal('show');
        });
    }
    $scope.goShop = function(){
      $state.go("ShoppingCart");
    }


});

app.run(['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
        }
])
