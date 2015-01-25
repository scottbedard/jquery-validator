<html>
    <body>

    <?php
    $rules = [
        'accept_cbox'               => 'accepted',
        'accept_text'               => 'accepted',
        'after_text'                => 'after:somedate',
        'alpha_text'                => 'alpha',
        'alpha_dash_text'           => 'alpha_dash',
        'alpha_num_text'            => 'alpha_num',
        'before_text'               => 'before:someotherdate',
        'between_num'               => 'between:4,6',
        'between_text'              => 'between:4,6',
        'boolean_text'              => 'boolean',
        'confirmed_text'            => 'confirmed',
        'date_text'                 => 'date',
        'different_text'            => 'different:somedifferent_text',
        'digits_text'               => 'digits:3',
        'digits_between_text'       => 'digits_between:3,5',
        'email_text'                => 'email',
        'in_text'                   => 'in:foo,bar,baz',
        'integer_text'              => 'integer',
        'ip_text'                   => 'ip',
        'max_num'                   => 'max:5',
        'max_text'                  => 'max:5',
        'min_num'                   => 'min:5',
        'min_text'                  => 'min:5',
        'not_in_text'               => 'not_in:foo,bar,baz',
        'numeric_text'              => 'numeric',
        'regex_text'                => 'regex:/^[a-z]+$/i',
        'required_text'             => 'required',
        'required_if_text'          => 'required_if:foo,bar,baz',
        'required_with_text'        => 'required_with:one,two,three',
        'required_with_all_text'    => 'required_with_all:cat,dog',
        'required_without_text'     => 'required_without:monkey,fish',
        'required_without_all_text' => 'required_without_all:elephant,snake',
        'same_text'                 => 'same:same_field',
        'size_num'                  => 'size:5',
        'size_text'                 => 'size:5'
    ];

    $messages = [
        'email_text.email' => 'Invalid email address.'
    ];

    var_dump ($rules);
    ?>

    <form id="form"
        data-validation="<?= htmlspecialchars(json_encode($rules)) ?>"
        data-validation-messages="<?= htmlspecialchars(json_encode($messages)) ?>"
    >

        <!-- accepted -->
        <p><input type="checkbox" name="accept_cbox" id="accept_cbox" checked> accepted checkbox</p>
        <p><input type="text" name="accept_text" value="yes"> accepted text</p>

        <!-- alpha -->
        <p><input type="text" name="alpha_text" value="works"> alpha</p>

        <!-- after:date -->
        <p>
            <input type="text" name="somedate" value="<?= date("Y-m-d H:i:s") ?>">&nbsp;&nbsp;&nbsp;
            <input type="text" name="after_text" value="2025"> after
        </p>

        <!-- alpha_dash -->
        <p><input type="text" name="alpha_dash_text" value="works-_"> alpha_dash</p>

        <!-- alpha_num -->
        <p><input type="text" name="alpha_num_text" value="works123"> alpha_num</p>

        <!-- before:date -->
        <p>
            <input type="text" name="someotherdate" value="<?= date("Y-m-d H:i:s") ?>">&nbsp;&nbsp;&nbsp;
            <input type="text" name="before_text" value="2012"> before
        </p>

        <!-- boolean -->
        <p>
            <input type="text" name="between_num" value="5">&nbsp;&nbsp;&nbsp;
            <input type="text" name="between_text" value="hello"> between
        </p>

        <!-- boolean -->
        <p><input type="text" name="boolean_text" value="true"> boolean text</p>

        <!-- confirmed -->
        <p>
            <input type="text" name="confirmed_text" value="confirmed">&nbsp;&nbsp;&nbsp;
            <input type="text" name="confirmed_text_confirmation" value="confirmed"> confirmed
        </p>

        <!-- date -->
        <p><input type="text" name="date_text" value="<?= date("Y-m-d H:i:s") ?>"> date</p>

        <!-- different:field -->
        <p>
            <input type="text" name="different_text" value="hello">&nbsp;&nbsp;&nbsp;
            <input type="text" name="somedifferent_text" value="world"> different
        </p>

        <!-- digits:value -->
        <p><input type="text" name="digits_text" value="123"> digits</p>

        <!-- digits_between:min,max -->
        <p><input type="text" name="digits_between_text" value="123"> digits_between</p>

        <!-- email -->
        <p><input type="text" name="email_text" value="foo@bar.com"> email</p>

        <!-- in:foo,bar,... -->
        <p><input type="text" name="in_text" value="foo"> in</p>

        <!-- integer -->
        <p><input type="text" name="integer_text" value="5"> integer</p>

        <!-- ip -->
        <p><input type="text" name="ip_text" value="127.0.0.1"> ip</p>

        <!-- max:value -->
        <p>
            <input type="text" name="max_num" value="5">&nbsp;&nbsp;&nbsp;
            <input type="text" name="max_text" value="hello"> max
        </p>

        <!-- min:value -->
        <p>
            <input type="text" name="min_num" value="5">&nbsp;&nbsp;&nbsp;
            <input type="text" name="min_text" value="hello"> min
        </p>

        <!-- not_in:foo,bar,... -->
        <p><input type="text" name="not_in_text" value="hello"> not_in</p>

        <!-- numeric -->
        <p><input type="text" name="numeric_text" value="-4.5"> numeric</p>

        <!-- regex -->
        <p><input type="text" name="regex_text" value="hello"> regex</p>

        <!-- required -->
        <p><input type="text" name="required_text" value="required"> required</p>

        <!-- required_if:foo,bar -->
        <p>
            <input type="text" name="required_if_text" value="works">&nbsp;&nbsp;&nbsp;
            <input type="text" name="foo" value="bar"> required_if
        </p>

        <!-- required_with:foo,bar,... -->
        <p>
            <input type="text" name="required_with_text" value="works">&nbsp;&nbsp;&nbsp;
            <input type="text" name="one" value="one">&nbsp;&nbsp;&nbsp;
            <input type="text" name="two"> required_with
        </p>

        <!-- required_with_all:foo,bar,... -->
        <p>
            <input type="text" name="required_with_all_text" value="works">&nbsp;&nbsp;&nbsp;
            <input type="text" name="cat" value="cat">&nbsp;&nbsp;&nbsp;
            <input type="text" name="dog" value="dog"> required_with_all
        </p>

        <!-- required_without:foo,bar,... -->
        <p>
            <input type="text" name="required_without_text" value="works">&nbsp;&nbsp;&nbsp;
            <input type="text" name="monkey" value="money">&nbsp;&nbsp;&nbsp;
            <input type="text" name="fish"> required_without
        </p>

        <!-- required_without_all:foo,bar,... -->
        <p>
            <input type="text" name="required_without_all_text" value="works">&nbsp;&nbsp;&nbsp;
            <input type="text" name="elephant" value="elephant">&nbsp;&nbsp;&nbsp;
            <input type="text" name="snake" value="snake"> required_without_all
        </p>

        <!-- same:field -->
        <p>
            <input type="text" name="same_text" value="same">&nbsp;&nbsp;&nbsp;
            <input type="text" name="same_field" value="same"> same
        </p>

        <!-- size:value -->
        <p>
            <input type="text" name="size_num" value="5">&nbsp;&nbsp;&nbsp;
            <input type="text" name="size_text" value="hello"> size
        </p>
    </form>

    <button id="validate">Validate</button>

    <script src="../jquery.min.js"></script>
    <script src="../validator.min.js"></script>
    <script src="test.js"></script>
    </body>
</html>