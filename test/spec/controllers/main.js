'use strict';

describe('Controller: articleCtrl', function () {

  var articleCtrl,
    $scope,
    $http,
    mockedFeed, 
    $httpBackend;


  // load the controller's module
  beforeEach(module('trekApp','mockedPost'));

  beforeEach(inject(function ( _$http_ , _$httpBackend_) {
    $http = _$http_;
    $httpBackend = _$httpBackend_;
  }));


  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$controller_, _$rootScope_, defaultJSON) {
    
    $scope = _$rootScope_.$new();

    articleCtrl = _$controller_('articleCtrl', {
      $scope: $scope
    });

  }));



  it('should show users posts', function () {

    $httpBackend.whenGET('/api/v1/users').respond([{title: 'Post Title'}, {title: 'Posts Title 2'}]);

    $scope.getPosts();

    // $httpBackend.flush();

    expect($scope.posts.length).toEqual(2);
  });


});
