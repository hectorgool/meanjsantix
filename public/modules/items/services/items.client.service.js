'use strict';

//Items service used for communicating with the items REST endpoints

angular.module('items').factory('Items', ['$resource',
	function($resource) {
		return $resource('items/:itemId', {
			itemId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])//;santo
.factory('ItemSlug', ['$resource',
	function($resource) {
		return $resource('item/:itemSlug', {
			itemSlug: '@slug'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
