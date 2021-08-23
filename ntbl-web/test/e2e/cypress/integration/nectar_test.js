let userEmail = Cypress.env('USER_EMAIL'); // Change valuable user email
let userPassword = Cypress.env('USER_PW'); // Change valuable user password
let wineName = Cypress.env('WINE_TEST_NAME'); // Wine Name for testing
let apiUrl = Cypress.env('DEFAULT_API_URL'); // Server Api Url

describe('User Login ...', function() {
	it('Setting Page', function() {
		cy.visit('/');
		//Go to Setting page
		cy.setting(apiUrl);
	});
	it('Go to Sign in Page and Authentication', function() {
		cy.go('back');

		//tring to login with user email and password
		cy.contains('Sign in');

		cy.get('#login_email').type(userEmail);
		cy.get('#login_password').type(userPassword);
		cy.get('#login_button').click();

		cy.contains('My Wines');
	});
	it('New Nectar Tasting', function() {
		cy.contains('New Tasting');
		cy.get('#main-content')
			.find('div.my-wines-page')
			.find('a[href="/new-tasting"]')
			.click();

		//Chose the tasting method - Nectar tasting Here
		cy.contains('Nectar');
		cy.get('#main-content')
			.find('a[href="/new-tasting/nectar"]')
			.click();

		//Rating step
		cy.contains('Rating');

		cy.contains('Balance');
		cy.get('div.rating-step')
			.find('ul.rating-list>li')
			.eq(0)
			.find('span.scale>span')
			.eq(12)
			.click();

		cy.contains('Length');
		cy.get('div.rating-step')
			.find('ul.rating-list>li')
			.eq(1)
			.find('span.scale>span')
			.eq(13)
			.click();

		cy.contains('Intensity');
		cy.get('div.rating-step')
			.find('ul.rating-list>li')
			.eq(2)
			.find('span.scale>span')
			.eq(14)
			.click();

		cy.contains('Complexity');
		cy.get('div.rating-step')
			.find('ul.rating-list>li')
			.eq(3)
			.find('span.scale>span')
			.eq(15)
			.click();

		cy.contains('Sense of place');
		cy.get('div.rating-step')
			.find('ul.rating-list>li')
			.eq(4)
			.find('span.scale>span')
			.eq(16)
			.click();

		cy.contains('Quality');
		cy.get('div.rating-step')
			.find('ul.rating-list>li')
			.eq(5)
			.find('span.scale>span')
			.eq(17)
			.click();

		cy.contains('Drinkabillity');
		cy.get('div.rating-step')
			.find('ul.rating-list>li')
			.eq(6)
			.find('span.scale>span')
			.last()
			.click();

		//Go to next page by clicking next button
		cy.get('#main-content')
			.find('button.next-btn')
			.click();

		cy.contains('Info');
		cy.contains('Country')
			.next()
			.find('input')
			.type('France');
		cy.contains('Producer')
			.next()
			.find('input')
			.type('Test Producer');
		cy.contains('Region')
			.next()
			.find('input')
			.type('Paris');
		cy.contains('Name')
			.next()
			.find('input')
			.type(wineName);
		cy.contains('Vintage')
			.next()
			.find('input')
			.type('12 years Old');
		cy.contains('Grape')
			.next()
			.find('input')
			.type('Blend');
		cy.contains('Price')
			.next()
			.find('input')
			.type(150);
		cy.contains('Currency')
			.next()
			.find('input')
			.type('USD');

		//Save the Nectar tasting...
		cy.contains('Save').click();
		cy.location('pathname', {timeout: 10000}).should('include', '/new-tasting');

		//Go to my wine page
		cy.get('div.toggle-menu-btn').click();
		cy.get('#AppSideNav')
			.find('a[href="/wines"]')
			.click();

		//Search my wine with name

		cy.get('#search-input').type(wineName);
		cy.wait(2000); //waiting to get search value
		cy.get('#search-input')
			.type('{enter}')
			.trigger('input');
		cy.contains('Today')
			.next()
			.find('div.row>div')
			.first()
			.click();

		cy.get('span.wine-name').contains(wineName);
		cy.contains(wineName);
	});
});
