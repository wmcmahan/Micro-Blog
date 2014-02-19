'use strict';

// unit: Serice: UserPosts
describe('Service: UserPosts', function () {

    var scope, ctrl, httpMock, testService;

    beforeEach(module('trekApp'));

    beforeEach(inject(function ($rootScope, $httpBackend, UserPosts) {
        scope = $rootScope.$new();
        httpMock = $httpBackend;
        testService = UserPosts;
    }));


    it('should show users posts', function () {
        httpMock.expectGET('/api/v1/users').respond([{title: 'Post Title'} , {title: 'Posts Title 2'}]);
        var result = testService.get();
        httpMock.flush();
        expect(result.length).toEqual(2);
    });

    it('should post users posts', function () {
        httpMock.expectPOST('/api/v1/users').respond({title: 'Post Title'});
        var result = testService.save();
        httpMock.flush();
        expect(result.title).toEqual('Post Title');
    });

});


// unit: Service: Geolocation
describe('Service: geolocation', function () {

    var scope, ctrl, _geolocation , deferredSuccess, result;

    beforeEach(module('trekApp'));

    beforeEach(inject(function ($rootScope, $controller, $q, geolocation) {
        scope = $rootScope.$new();
        _geolocation = geolocation;

        deferredSuccess = $q.defer();
        deferredSuccess.resolve('user location');

        spyOn(geolocation, 'position').andReturn(deferredSuccess.promise);
    }));


    it('should set form scopes', function () {
        _geolocation.position().then(function(currentLocation){
            result = currentLocation;
        });

        scope.$apply();
        expect(result).toBe('user location');
    });

});