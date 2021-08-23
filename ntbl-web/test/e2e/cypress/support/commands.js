// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
//
//-- This is a setting command --
Cypress.Commands.add('setting', (url) => {
	//Go to Setting page
	cy.get('div.toggle-menu-btn').click();

	//Click the sidebar menu
	cy.get('#AppSideNav')
		.find('a[href="/settings"]')
		.click();

	cy.get('#settings-advanced').click();

	cy.get('#btnEditServerUrl').click();

	cy.get('input#server-url')
		.clear()
		.type(url);
	cy.get('#btnSaveServerUrl').click();
	cy.wait(1000);
});
