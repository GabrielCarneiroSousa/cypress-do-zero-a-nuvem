//const { text } = require("stream/consumers")

const { METHODS } = require("http")
const { url } = require("inspector")

//const { it } = require("node:test")

describe('Central de Atendimento ao Cliente TAT', () => {
  beforeEach(() => {
    cy.visit('./src/index.html') 
  })
  it('verifica o título da aplicação', () => {
     
      cy.title('Central de Atendimento ao Cliente TAT').should('be.equal','Central de Atendimento ao Cliente TAT') 
  })
   
  it('preenche os campos obrigatórios e envia o formulário', () => {
  
    cy.clock()

    cy.get('#firstName').type('Gabriel')
    cy.get('#lastName').type('Carneiro')
    cy.get('#email').type('teste@gmail.com')
    cy.get('#open-text-area').type('obrigado')
    cy.get('button[type="submit"]').click()
    

    cy.get('.success').should('be.visible')

    cy.tick(3000)

    cy.get('.success').should('not.be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulario com um email com formatacao invalida', () => {
    cy.clock()

    const longText = Cypress._.repeat(' teste teste teste teste', 10)

    cy.get('#firstName').type('Gabriel')
    cy.get('#lastName').type('Carneiro de Sousa')
    cy.get('#email').type('GabrielCarneiro,com')
    cy.get('#open-text-area').type(longText, {delay: 0 })
    cy.get('button[type="submit"]').click()

    cy.get('.error > strong').should('be.visible')

    cy.tick(3000)
    
    cy.get('.error > strong').should('not.visible')
  })

  it('campo telefone continua vazio, quando recebe algo que nao e numerico', () => {
    cy.get('#phone')
      .type('tem que continuar vazio')
        .should('have.value', '')
    cy.get('#phone-checkbox')
      .click()
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {

    cy.clock()

    cy.get('#firstName').type('Gabriel')
    cy.get('#lastName').type('Carneiro')
    cy.get('#email').type('teste@gmail.com')
    cy.get('#phone-checkbox').click()
    cy.get('#phone')
    cy.get('#open-text-area').type('obrigado')
    cy.get('button[type="submit"]').click()

    cy.get('.error > strong').should('be.visible')

    cy.tick(3000)

     cy.get('.error > strong').should('not.be.visible')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName')
      .type('Gabriel')
        .should('have.value', 'Gabriel')
          .clear()
            .should('have.value', '')
    cy.get('#lastName')
      .type('Carneiro')
        .should('have.value', 'Carneiro')
          .clear()
            .should('have.value', '')
    cy.get('#email')
      .type('teste@gmail.com')
        .should('have.value', 'teste@gmail.com')
          .clear()
            .should('have.value', '')
    cy.get('#phone')
      .type('11930160012')
        .should('have.value', '11930160012')
          .clear()
            .should('have.value', '')

  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {

    cy.clock()

    cy.get('button[type="submit"]').click()

    cy.get('.error > strong').should('be.visible')

    it('envia o formulario com sucesso usando um comando customizado', () => { 
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.sucess').should('be.visible')
    });

    cy.tick(3000)

    cy.get('.error > strong').should('not.be.visible')
  });


  // selecionando opcoes em campos de selecao suspensa 
  it('seleciona um produto (youtube) por seu texto', () => {
    cy.get('#product')
      .select('YouTube')
        .should('have.value', 'youtube')
  })

  it('seleciona o produto (mentoria) por seu valor (value) ', () => {
    cy.get('#product')
      .select('mentoria')
        .should('have.value', 'mentoria')
  })

  it('Seleciona o produto (Blog) por seu indice',() => {
    cy.get('#product')
      .select(1) // para selecionar por indice nao se usa aspas simples
        .should('have.value', 'blog')
  })



  //marcando inputs do tipo radio 
  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
        .should('be.checked')

  })


  // Apredendo a usar EACH e WRAP, selecionandos todos os campos de radio button
  it('marca cada tipo de atendimento', () => {
      cy.get('input[type="radio"]')
        .each(typeOfService => {
          cy.wrap(typeOfService)
            .check()
              .should('be.checked')
        })
      });


      //Aprendendo a usar uncheck, a primeira forma eu fiz sozinho, a segunda forma é a do curso 
      it('marca ambos checkboxes, depois desmarca o último', () => {
          cy.get('#email-checkbox')
            .check()
              .should('be.checked')
          cy.get('#phone-checkbox')
            .check()
             .should('be.checked')
                .uncheck()

      })

      it('marca ambos checkboxes, depois desmarca o último', ()=> {
        cy.get('input[type="checkbox"]')
          .check()  
            .should('be.checked') 
              .last()
                .uncheck()
                  .should('not.be.checked')
      })    //essa foi a forma do curso 

        it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('#firstName').type('Gabriel')
    cy.get('#lastName').type('Carneiro')
    cy.get('#email').type('teste@gmail.com')
    cy.get('#phone-checkbox').check()
    cy.get('#phone')
    cy.get('#open-text-area').type('obrigado')
    cy.get('button[type="submit"]').click()

    cy.get('.error > strong').should('be.visible')
        
  })


  //FAZENDO UPLOAD DE ARQUIVOS PRIMEIRA FORMA 
  it('seleciona um arquivo da pasta fixtures', () => {
     cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.json')
        .should( input =>{
          console.log(input[0].files[0].name)
        }) 
  });

  //SEGUNDA FORMA 
  it('seleciona um arquivo da pasta fixtures', () => {
      cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.json')
        .should( input =>{
          expect(input[0].files[0].name).to.equal('example.json')
        }) 
  });

  it('seleciona um arquivo simulando um drag-and-drop', ()=>{
     cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.json', { action: 'drag-drop'})
        .should( input =>{ //esse should recebe um argumento
          expect(input[0].files[0].name).to.equal('example.json')
        }) 

  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () =>{
    cy.fixture('example.json').as('sampleFile')
    cy.get('#file-upload')
      .selectFile('@sampleFile')
        .should( input =>{
          expect(input[0].files[0].name).to.equal('example.json')
        }) 
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () =>{
    cy.contains('a','Política de Privacidade')
      .should('have.attr', 'href', 'privacy.html') // should = deveria 
        .and('have.attr', 'target', '_blank') // and = E
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
      cy.contains('a','Política de Privacidade')
        .invoke('removeAttr','target')
          .click()
      cy.contains('h1','CAC TAT - Política de Privacidade')
        .should('be.visible')
  });


  it('exibe e oculta as mensagens de sucesso e erro usando .invoke()', ()=>{
  
  cy.get('.success')
      .should('not.be.visible')
        .invoke('show')
          .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')
             .invoke('hide')
                .should('not.be.visible')
  cy.get('.error')
      .should('not.be.visible')
        .invoke('show')
         .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios!')
              .invoke('hide')
                .should('not.be.visible')
})

  it('preenche o campo da área de texto usando o comando invoke.',()=>{
    cy.get('#firstName')  
      .invoke('val','Gabriel novo QA')
        .should('have.value', 'Gabriel novo QA')
  })

  it('faz uma requisição HTTP',()=>{
    cy.request('https://cac-tat-v3.s3.eu-central-1.amazonaws.com/index.html')
      .as('getRequest')
        .its('status')
          .should('be.equal', 200)
    cy.get('@getRequest')
      .its('statusText')
        .should('be.equal','OK')
    cy.get('@getRequest')
      .its('body')
        .should('include','CAC TAT')
  })

  it.only('Achando o gato',()=>{
    cy.get('#cat')
        .invoke('show')
          .should('be.visible')
            
  })
  })

