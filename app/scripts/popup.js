angular.module('demoApp', [])
    .controller('MainController', ['$scope', 'Demo',
        function ($scope, Demo) {
            'use strict';

            $scope.title = "Magic box";
            $scope.imageVisible = false;
            $scope.imageUrl = "";


            $scope.showImage = function (imageUrl) {
                $scope.imageVisible = true;
                $scope.imageUrl = imageUrl;
            };


            $scope.showGirl = function () {
                Demo.getRandomImage('3416684')
                    .then(function (response) {
                        console.log(response.image);
                        $scope.title = response.image.user.full_name;
                        $scope.showImage(response.image.images.low_resolution.url);
                    })
                    .catch();
            };

            $scope.showCat = function () {
                Demo.getRandomImage('7013409')
                    .then(function (response) {
                        console.log(response);
                        $scope.title = response.image.user.full_name;
                        $scope.showImage(response.image.images.low_resolution.url);
                    })
                    .catch();
            };



        }])
    .service('Demo', ['$http', '$q',
        function ($http, $q) {

            this.randomInt = function (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };

            this.get = function (url) {
                var d = $q.defer();
                $http.get(url)
                    .success(function (data) {
                        d.resolve(data);
                    })
                    .error(function (error) {
                        $log.error(error);
                        d.reject(error);
                    }
                );
                return d.promise;
            };

            this.generateUrl = function (account) {
                return "https://api.instagram.com/v1/users/" + account + '/media/recent?client_id=' + "bd542b40bc3a4042a464bc7d2706ba01";
            };

            this.parseImages = function (data) {
                var images = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].type == 'image') {
                        images.push({
                            image: data[i]
                        });
                    }
                }
                return images;
            };

            this.getRecentImages = function (account) {
                var d = $q.defer();
                this.get(this.generateUrl(account)).then(function (response) {
                    var images = this.parseImages(response.data);
                    this.images = images;
                    d.resolve(images);
                }.bind(this), function (error) {
                    $log.error(error);
                    d.reject(error);
                });
                return d.promise;
            };

            this.getRandomImage = function (account) {
                var d = $q.defer();
                this.getRecentImages(account)
                    .then(function (images) {
                        var randomImage = images[this.randomInt(0, images.length - 1)];
                        d.resolve(randomImage);
                    }.bind(this))
                    .catch(function (error) {
                        $log.error(error);
                        d.reject(error);
                    });
                return d.promise;
            };

        }]);


