@HU-001 @login
Feature: HU-001 Iniciar sesión en Sauce Demo
  Como usuario de Sauce Demo
  Quiero poder iniciar sesión en la aplicación
  Para acceder a la página de productos

  Background:
    Given el usuario está en la página de login

  @ES-001 @smoke @positive
  Scenario: ES-001 Login exitoso con usuario estándar
    When el usuario ingresa credenciales válidas de usuario estándar
    Then el usuario debería ver la página de productos
    And el título de la página debería ser "Products"

  @ES-002 @negative
  Scenario: ES-002 Login fallido con usuario bloqueado
    When el usuario ingresa credenciales de usuario bloqueado
    Then el usuario debería ver un mensaje de error
    And el mensaje de error debería contener "locked out"

  @ES-003 @negative
  Scenario: ES-003 Login fallido con credenciales inválidas
    When el usuario ingresa credenciales inválidas
    Then el usuario debería ver un mensaje de error
    And el mensaje de error debería contener "do not match"