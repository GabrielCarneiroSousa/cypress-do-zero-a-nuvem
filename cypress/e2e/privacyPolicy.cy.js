 
 //forma de testar uma pagina de forma independente.
 /*it('testa a página da política de privacidade de forma independente', ()=>{
    cy.visit('./src/privacy.html') //usado para visitar a pagina de forma direta

    cy.contains('p', 'Talking About Testing')
        .should('be.visible')
    cy.contains('h1','CAC TAT - Política de Privacidade')
        .should('be.visible')
  })  */
// APRENDENDO A USAR O LODASH PONTO TIMES
Cypress._.times(3,() => {
     it('testa a página da política de privacidade de forma independente', ()=>{
    cy.visit('./src/privacy.html') //usado para visitar a pagina de forma direta

    cy.contains('p', 'Talking About Testing')
        .should('be.visible')
    cy.contains('h1','CAC TAT - Política de Privacidade')
        .should('be.visible')
  })
})