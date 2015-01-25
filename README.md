# jQuery Validator
The goal of this tool is to mimic [Laravel validation](http://laravel.com/docs/validation) as closely as possible with jQuery. By doing this, you no longer have to worry about keeping the server and client validation synchronized. Just write your rules once, and move on to more important things. To get started, JSON encode your rules and place them in a form's ```data-validation``` attribute. From there, simply call ```validate()``` to see if everything checks out!

### Supported validation
For a list of available validation rules, check out the [Laravel documentation](http://laravel.com/docs/validation). There are a few rules that are not supported at this time. Unsupported rules include ```active_url```, ```array```, ```exists```, ```image```, ```mimes```, ```timezone```, ```unique```, ```url```, custom rules, and file validation.

### Basic usage
First thing's first, we need some validation rules
```php
$rules = [
    'first_name'    => 'required|alpha',
    'last_name'     => 'required|alpha',
    'email'         => 'required|email',
    'age'           => 'integer|min:18',
    'terms'         => 'accepted'
];

$dataValidation = htmlspecialchars(json_encode($rules));
```
Next lets build up our form, and attach our rules.
```html
<form action="#" id="signup" data-validation="<?= $dataValidation ?>">
    <input type="text" name="first_name" placeholder="First name" />
    <input type="text" name="last_name" placeholder="Last name" />
    <input type="text" name="email" placeholder="Email address" />
    <input type="text" name="age" placeholder="Age" />
    <button type="submit">Submit</button>
</form>
```
Now for the fun part, lets validate our form and let the user know if they've messed up.
```javascript
$(function() {

    $('#signup').submit(function(event) {
    
        var validationError = $(this).validate(1)
        
        if (validationError) {
            event.preventDefault()
            alert (validationError)
        }
        
    })
    
})
```
Finished, we now have client side validation running off the same rules governing the server side validation! The ```1``` value passed to ```validate()``` simply references how many error messages to return. If this is left out or set to zero, all errors will be returned.

### Custom messages
Lets make the above example just a little bit fancier with some custom error messages. To do this, simply take the error messages array from your Laravel validation and plug it into the form.
```php
$messages = [
    'age.min'           => 'Sorry, you must be 18 years of age to sign up.',
    'terms.accepted'    => 'You must accept the terms of service.'
];

$dataMessages = htmlspecialchars(json_encode($messages));
```
```html+php
<form action="#" id="signup"
    data-validation="<?= $dataValidation ?>"
    data-validation-messages="<?= $dataMessages ?>"
>
    ...
</form>
```
