# Client

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.4.

## File structure

- auth: Handles auth pages, register and login
- component: Contains reuseable component
- pages: Handles authorized pages
- service: Http request and interface

## Api

Handles api request using angular http client

Add `provideHttpClient` to app.config to inject http client

[Check docs here](https://angular.dev/guide/http)


## Login component 

[docs here](https://angular.dev/guide/forms/template-driven-forms)

Uses the template driven form

Define `ngSubmit` in form tag and bind form to ng submit with `ngForm`

In the input tag define the `ngModel` and `name` attribute

The button should have the type attribute as `submit`

