'use strict';

(function() {
	// Items Controller Spec
	describe('Items Controller Tests', function() {
		// Initialize global variables
		var ItemsController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Items controller.
			ItemsController = $controller('ItemsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one item object fetched from XHR', inject(function(Items) {
			// Create sample item using the Items service
			var sampleItem = new Items({
				title: 'An Item about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample items array that includes the new item
			var sampleItems = [sampleItem];

			// Set GET response
			$httpBackend.expectGET('items').respond(sampleItems);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.items).toEqualData(sampleItems);
		}));

		it('$scope.findOne() should create an array with one item object fetched from XHR using a itemId URL parameter', inject(function(Items) {
			// Define a sample item object
			var sampleItem = new Items({
				title: 'An Item about MEAN',
				content: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.itemId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/items\/([0-9a-fA-F]{24})$/).respond(sampleItem);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.item).toEqualData(sampleItem);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Items) {
			// Create a sample item object
			var sampleItemPostData = new Items({
				title: 'An Item about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample item response
			var sampleItemResponse = new Items({
				_id: '525cf20451979dea2c000001',
				title: 'An Item about MEAN',
				content: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.title = 'An Item about MEAN';
			scope.content = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('items', sampleItemPostData).respond(sampleItemResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');

			// Test URL redirection after the item was created
			expect($location.path()).toBe('/items/' + sampleItemResponse._id);
		}));

		it('$scope.update() should update a valid item', inject(function(Items) {
			// Define a sample item put data
			var sampleItemPutData = new Items({
				_id: '525cf20451979dea2c000001',
				title: 'An Item about MEAN',
				content: 'MEAN Rocks!'
			});

			// Mock item in scope
			scope.item = sampleItemPutData;

			// Set PUT response
			$httpBackend.expectPUT(/items\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/items/' + sampleItemPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid itemId and remove the item from the scope', inject(function(Items) {
			// Create new item object
			var sampleItem = new Items({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new items array and include the item
			scope.items = [sampleItem];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/items\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleItem);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.items.length).toBe(0);
		}));
	});
}());