<?php
$rules = htmlspecialchars(json_encode([
    'first_name'    => 'required|alpha',
    'last_name'     => 'required|alpha',
    'email'         => 'required|email',
    'age'           => 'required|integer|min:18',
    'terms'         => 'accepted'
]));

$messages = htmlspecialchars(json_encode([
    'age.min'           => 'Sorry, you must be 18 years of age to sign up.',
    'terms.accepted'    => 'You must accept the terms of service.'
]));
?>

<html>
    <head>
        <title>jQuery Validator - Usage example</title>
        <link rel="stylesheet" type="text/css" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    </head>
    <body class="container" style="padding: 40px">

        <form action="#" id="signup"
            data-validation="<?= $rules ?>"
            data-validation-messages="<?= $messages ?>"
        >
            <p>
                <input type="text" name="first_name" placeholder="First name" />
                <input type="text" name="last_name" placeholder="Last name" />
            </p>
            <p>
                <input type="text" name="email" placeholder="Email address" />
            </p>
            <p>
                <input type="text" name="age" placeholder="Age" />
            </p>
            <p>
                <input type="checkbox" name="terms" /> <label for="terms">I accept the terms of service</label>

            <button type="submit">Submit</button>
            </p>
        </form>

        <script src="../jquery.min.js"></script>
        <script src="../validator.js"></script>
        <script src="example.js"></script>
    </body>
</html>