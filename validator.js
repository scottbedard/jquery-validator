/**
 * jQuery Validator
 * 
 * Scott Bedard
 * http://scottbedard.net
 */
$(function() {

    $.fn.validate = function(responses) {

        var $form = this,
            validation = $(this).data('validation'),
            customMessages = $(this).data('validation-messages'),
            validationErrors = [],
            validationResponse = [],
            regexable = {
                'alpha':        /^[a-z]+$/i,
                'alpha_dash':   /^[a-z0-9-_]+$/i,
                'alpha_num':    /^[a-z0-9]+$/i,
                'boolean':      /^(true|false|1|0)$/i,
                'email':        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'integer':      /^-?\d+$/,
                'ip':           /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
            }

        function validationFailed(element, rule, param, type) {
            validationErrors.push({
                "element": element,
                "rule": rule,
                "param": param,
                "type": type
            })
        }

        // Loop through form elements, and run the validation
        var $inputs = $(this).find('input,select,textarea')
        $inputs.each(function() {
            var element = $(this),
                elementName = $(this).attr('name'),
                rules = validation[elementName],
                value = $(this).val().toLowerCase()

            if (!rules)
                return true

            rules.split('|').forEach(function(rule) {

                // Parse rule from parameters
                var paramBreak = rule.indexOf(':')
                if (paramBreak != -1) {
                    param = rule.slice(paramBreak + 1).toLowerCase()
                    rule = rule.slice(0, paramBreak).toLowerCase()
                    if (param.indexOf(',') != -1)
                        param = param.split(',')
                } else {
                    param = false
                }

                // Rules that can be checked with a regex
                if (regexable[rule]) {
                    var expression = regexable[rule]
                    if (value !== '' && expression.test(value) == false)
                        validationFailed(elementName, rule, param)
                }

                // Rules that require additional logic
                else {

                    // accepted
                    if (rule == 'accepted' && value.length) {
                        var expression = /^(on|yes|1)$/i
                        if ($(element).is(':checkbox') == false && expression.test(value) == false)
                            validationFailed(elementName, rule, param)
                        else if ($(element).is(':checkbox') && $(element).is(':checked') == false)
                            validationFailed(elementName, rule, param)
                    }

                    // active_url (not supported)

                    // after:date
                    else if (rule == 'after') {
                        if (typeof param != 'string')
                            validationFailed(elementName, rule, param)
                        var $afterDate = $form.find('*[name="' + param + '"]')
                        if (!$afterDate.length || strtotime(value) <= strtotime($afterDate.val()))
                           validationFailed(elementName, rule, param) 
                    }

                    // array (not supported)

                    // before:date
                    else if (rule == 'before') {
                        if (typeof param != 'string')
                            validationFailed(elementName, rule, param)
                        var $beforeDate = $form.find('*[name="' + param + '"]')
                        if (!$beforeDate.length || strtotime(value) >= strtotime($beforeDate.val()))
                           validationFailed(elementName, rule, param) 
                    }

                    // between:min,max
                    else if (rule == 'between' && value.length) {
                        if (!param[0] || !param[1])
                            validationFailed(elementName, rule, param)
                        var min = intval(param[0]),
                            max = intval(param[1])
                        if (is_numeric(value)) {
                            value = intval(value)
                            if (value < min || value > max)
                                validationFailed(elementName, rule, param, 'numeric')
                        } else {
                            if (value.length < min || value.length > max)
                                validationFailed(elementName, rule, param, 'string')
                        }
                    }

                    // confirmed
                    else if (rule == 'confirmed' && value.length) {
                        var $confirmation = $form.find('*[name="' + elementName + '_confirmation"]')
                        if (!$confirmation.length || $confirmation.val() != value)
                           validationFailed(elementName, rule, param) 
                    }

                    // date
                    else if (rule == 'date' && !strtotime(value) && value.length)
                        validationFailed(elementName, rule, param)

                    // date_format:format (not supported)

                    // different:field
                    else if (rule == 'different' && value.length) {
                        if (typeof param != 'string')
                            validationFailed(elementName, rule, param)
                        var $different = $form.find('*[name="' + param + '"]')
                        if (!$different.length || $different.val().toLowerCase() == value)
                            validationFailed(elementName, rule, param)
                    }

                    // digits
                    else if (rule == 'digits' && value.length) {
                        if (!is_numeric(value) || !is_numeric(param) || value.length != parseInt(param))
                            validationFailed(elementName, rule, param)
                    }

                    // digits_between:min,max
                    else if (rule == 'digits_between' && value.length) {
                        if (!param[0] || !param[1] || value.length < param[0] || value.length > param[1])
                            validationFailed(elementName, rule, param)
                    }

                    // exists:table,column (not supported)

                    // image (not supported)

                    // in:foo,bar,...
                    else if (rule == 'in' && param.indexOf(value) == -1 && value.length)
                            validationFailed(elementName, rule, param)

                    // max:value
                    else if (rule == 'max' && value.length) {
                        if (typeof param != 'string')
                            validationFailed(elementName, rule, param)
                        if (is_numeric(value) && intval(value) > param)
                            validationFailed(elementName, rule, param, 'numeric')
                        if (!is_numeric(value) && value.length > param)
                            validationFailed(elementName, rule, param, 'string')
                    }

                    // mimes:foo,bar,... (not supported)

                    // min:value
                    else if (rule == 'min' && value.length) {
                        if (typeof param != 'string')
                            validationFailed(elementName, rule, param)
                        if (is_numeric(value) && intval(value) < param)
                            validationFailed(elementName, rule, param, 'numeric')
                        if (!is_numeric(value) && value.length < param)
                            validationFailed(elementName, rule, param, 'string')
                    }

                    // not_in:foo,bar,...
                    else if (rule == 'not_in' && param.indexOf(value) != -1 && value.length)
                        validationFailed(elementName, rule, param)

                    // numeric
                    else if (rule == 'numeric' && !is_numeric(value) && value.length)
                        validationFailed(elementName, rule, param)

                    // regex
                    else if (rule == 'regex' && value.length) {
                        if (typeof param != 'string')
                            validationFailed(elementName, rule, param)
                        var start = param.indexOf('/'),
                            end = param.indexOf('/', 2),
                            flags = param.slice(end + 1),
                            expression = new RegExp(param.slice(start + 1, end), flags)
                        if (expression.test(value) == false)
                            validationFailed(elementName, rule, param)
                    }

                    // required
                    else if (rule == 'required' && !value.length)
                        validationFailed(elementName, rule, param)

                    // required_if:foo,bar,...
                    else if (rule == 'required_if') {
                        if (!param[0] || !param[1])
                           validationFailed(elementName, rule, param)
                        var field = param[0],
                            notInValues = param.slice(1);
                        var $required_if = $form.find('*[name="' + field + '"]')
                        if ($required_if.length && notInValues.indexOf($required_if.val()) != -1 && !value.length)
                            validationFailed(elementName, rule, param)
                    }

                    // required_with:foo,bar,...
                    else if (rule == 'required_with') {
                        var failed = false
                        if (typeof param == 'string')
                            param = [param]
                        param.forEach(function(field) {
                            var $required_with = $form.find('*[name="' + field + '"]')
                            if ($required_with.length && $required_with.val().length && !value.length)
                                failed = true
                        })
                        if (failed)
                            validationFailed(elementName, rule, param)
                    }

                    // required_with_all:foo,bar,...
                    else if (rule == 'required_with_all') {
                        var all = true
                        if (typeof param == 'string')
                            param = [param]
                        param.forEach(function(field) {
                            var $required_with_all = $form.find('*[name="' + field + '"]')
                            if (!$required_with_all.length || !$required_with_all.val().length)
                                all = false
                        })
                        if (all && !value.length)
                            validationFailed(elementName, rule, param)
                    }

                    // required_without:foo,bar,...
                    else if (rule == 'required_without') {
                        var notPresent = false
                        if (typeof param == 'string')
                            param = [param]
                        param.forEach(function(field) {
                            var $required_without = $form.find('*[name="' + field + '"]')
                            if (!$required_without.length || !$required_without.val().length)
                                notPresent = true
                        })
                        if (notPresent && !value.length)
                            validationFailed(elementName, rule, param)
                    }

                    // required_without_all:foo,bar,...
                    else if (rule == 'required_without_all') {
                        var withoutAll = true
                        if (typeof param == 'string')
                            param = [param]
                        param.forEach(function(field) {
                            var $required_without_all = $form.find('*[name="' + field + '"]')
                            if ($required_without_all.length && $required_without_all.val().length)
                                withoutAll = false
                        })
                        if (withoutAll && !value.length)
                            validationFailed(elementName, rule, param)
                    }

                    // same:field
                    else if (rule == 'same' && value.length) {
                        if (typeof param != 'string')
                            validationFailed(elementName, rule, param)
                        var $same = $form.find('*[name="' + param + '"]')
                        if (!$same.length || $same.val().toLowerCase() != value)
                            validationFailed(elementName, rule, param)
                    }

                    // size:value
                    else if (rule == 'size' && value.length) {
                        if (typeof param != 'string')
                            validationFailed(elementName, rule, param)
                        if (is_numeric(value) && intval(value) != param)
                            validationFailed(elementName, rule, param, 'numeric')
                        else if (!is_numeric(value) && value.length != param)
                            validationFailed(elementName, rule, param, 'string')
                    }

                    // timezone (not supported)

                    // unique (not supported)

                    // url (not supported)                    
                }
            });
        });

        // Process validation errors
        validationErrors.forEach(function(validationError) {
            var element = validationError['element'],
                rule    = validationError['rule'],
                param   = validationError['param'],
                type    = validationError['type'];

            if (customMessages)
                var customMessage = customMessages[element + '.' + rule]

            // If we have a custom message, add it to the reponse array
            if (customMessage)
                validationResponse.push(customMessage)

            // Otherwise use the default message
            else {
                switch(rule) {
                    case 'accepted':
                        defaultMessage = 'The :element field must be accepted.'; break
                    case 'after':
                        defaultMessage = 'The :element field must be a valid date after :param.'; break
                    case 'alpha':
                        defaultMessage = 'The :element field must consist entirely of alphabetic characters.'; break
                    case 'alpha_dash':
                        defaultMessage = 'The :element field must consist entirely of alphabetic characters, hyphens, and underscores.'; break
                    case 'alpha_num':
                        defaultMessage = 'The :element field must consist entirely of alphabetic and numeric characters.'; break
                    case 'before':
                        defaultMessage = 'The :element field must be a valid date before :param.'; break
                    case 'between':
                        defaultMessage = type == 'numeric'
                            ? 'The :element field must have a value between ' + param[0] + ' and ' + param[1] + '.'
                            : 'The :element field must be between ' + param[0] + ' and ' + param[1] + ' characters long.'; break
                    case 'boolean':
                        defaultMessage = 'The :element field must be a boolean value.'; break
                    case 'confirmed':
                        defaultMessage = 'The :element field must be confirmed.'; break
                    case 'date':
                        defaultMessage = 'The :element field must be a valid date format.'; break
                    case 'different':
                        defaultMessage = 'The :element field must be different from the :param field.'; break
                    case 'digits':
                        defaultMessage = 'The :element field must be :param digits long.'; break
                    case 'digits_between':
                        defaultMessage = 'The :element field must be between ' + param[0] + ' and ' + param[1] + 'digits long.'; break
                    case 'email':
                        defaultMessage = 'The :element field must be a valid email address.'; break
                    case 'in':
                        defaultMessage = 'The :element field must be a value in :param.'; break
                    case 'integer':
                        defaultMessage = 'The :element field must be an integer.'; break
                    case 'ip':
                        defaultMessage = 'The :element field must be a valid IP address.'; break
                    case 'max':
                        defaultMessage = type == 'numeric'
                            ? 'The :element field must be less than or equal to :param.'
                            : 'The :element may not be longer than :param characters long.'; break
                    case 'min':
                        defaultMessage = type == 'numeric'
                            ? 'The :element field must be greater than or equal to :param.'
                            : 'The :element must be at least :param characters long.'; break
                    case 'not_in':
                        defaultMessage = 'The :element field must not be a value in :param.'; break
                    case 'numeric':
                        defaultMessage = 'The :element field must be a numeric value.'; break
                    case 'regex':
                        defaultMessage = 'The :element field must match the regular expression :param.'; break
                    case 'required':
                        defaultMessage = 'The :element field is required.'; break
                    case 'required_if':
                        defaultMessage = 'The :element field is required if the ' + param.shift() + ' field is equal to ' + param.join(', ') + '.'; break
                    case 'required_with':
                        defaultMessage = 'The :element field is required if any :param fields are filled.'; break
                    case 'required_with_all':
                        defaultMessage = 'The :element field is required if all :param fields are filled.'; break
                    case 'required_without':
                        defaultMessage = 'The :element field is required if any :param fields are not filled.'; break
                    case 'required_without_all':
                        defaultMessage = 'The :element field is required if all :param fields are not filled.'; break
                    case 'same':
                        defaultMessage = 'The :element field must match the :param field.'; break
                    case 'size':
                        defaultMessage = type == 'numeric'
                            ? 'The :element field must be equal to :param.'
                            : 'The :element must be :param characters long.'; break
                }
                defaultMessage = defaultMessage.replace(':element', element)
                if (typeof param == 'string')
                    defaultMessage = defaultMessage.replace(':param', param)
                if (typeof param == 'object')
                    defaultMessage = defaultMessage.replace(':param', param.join(', '))
                validationResponse.push(defaultMessage)
            }
        })

        if (!validationResponse.length)
            return false;

        return !responses ? validationResponse : validationResponse.slice(0, responses);

        /**
         * PHPJS helpers
         */
        function strtotime(e,t){function a(e,t,a){var n,r=c[t];"undefined"!=typeof r&&(n=r-w.getDay(),0===n?n=7*a:n>0&&"last"===e?n-=7:0>n&&"next"===e&&(n+=7),w.setDate(w.getDate()+n))}function n(e){var t=e.split(" "),n=t[0],r=t[1].substring(0,3),s=/\d+/.test(n),u="ago"===t[2],i=("last"===n?-1:1)*(u?-1:1);if(s&&(i*=parseInt(n,10)),o.hasOwnProperty(r)&&!t[1].match(/^mon(day|\.)?$/i))return w["set"+o[r]](w["get"+o[r]]()+i);if("wee"===r)return w.setDate(w.getDate()+7*i);if("next"===n||"last"===n)a(n,r,i);else if(!s)return!1;return!0}var r,s,u,i,w,c,o,d,D,f,g,l=!1;if(!e)return l;if(e=e.replace(/^\s+|\s+$/g,"").replace(/\s{2,}/g," ").replace(/[\t\r\n]/g,"").toLowerCase(),s=e.match(/^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/),s&&s[2]===s[4])if(s[1]>1901)switch(s[2]){case"-":return s[3]>12||s[5]>31?l:new Date(s[1],parseInt(s[3],10)-1,s[5],s[6]||0,s[7]||0,s[8]||0,s[9]||0)/1e3;case".":return l;case"/":return s[3]>12||s[5]>31?l:new Date(s[1],parseInt(s[3],10)-1,s[5],s[6]||0,s[7]||0,s[8]||0,s[9]||0)/1e3}else if(s[5]>1901)switch(s[2]){case"-":return s[3]>12||s[1]>31?l:new Date(s[5],parseInt(s[3],10)-1,s[1],s[6]||0,s[7]||0,s[8]||0,s[9]||0)/1e3;case".":return s[3]>12||s[1]>31?l:new Date(s[5],parseInt(s[3],10)-1,s[1],s[6]||0,s[7]||0,s[8]||0,s[9]||0)/1e3;case"/":return s[1]>12||s[3]>31?l:new Date(s[5],parseInt(s[1],10)-1,s[3],s[6]||0,s[7]||0,s[8]||0,s[9]||0)/1e3}else switch(s[2]){case"-":return s[3]>12||s[5]>31||s[1]<70&&s[1]>38?l:(i=s[1]>=0&&s[1]<=38?+s[1]+2e3:s[1],new Date(i,parseInt(s[3],10)-1,s[5],s[6]||0,s[7]||0,s[8]||0,s[9]||0)/1e3);case".":return s[5]>=70?s[3]>12||s[1]>31?l:new Date(s[5],parseInt(s[3],10)-1,s[1],s[6]||0,s[7]||0,s[8]||0,s[9]||0)/1e3:s[5]<60&&!s[6]?s[1]>23||s[3]>59?l:(u=new Date,new Date(u.getFullYear(),u.getMonth(),u.getDate(),s[1]||0,s[3]||0,s[5]||0,s[9]||0)/1e3):l;case"/":return s[1]>12||s[3]>31||s[5]<70&&s[5]>38?l:(i=s[5]>=0&&s[5]<=38?+s[5]+2e3:s[5],new Date(i,parseInt(s[1],10)-1,s[3],s[6]||0,s[7]||0,s[8]||0,s[9]||0)/1e3);case":":return s[1]>23||s[3]>59||s[5]>59?l:(u=new Date,new Date(u.getFullYear(),u.getMonth(),u.getDate(),s[1]||0,s[3]||0,s[5]||0)/1e3)}if("now"===e)return null===t||isNaN(t)?(new Date).getTime()/1e3|0:0|t;if(!isNaN(r=Date.parse(e)))return r/1e3|0;if(w=t?new Date(1e3*t):new Date,c={sun:0,mon:1,tue:2,wed:3,thu:4,fri:5,sat:6},o={yea:"FullYear",mon:"Month",day:"Date",hou:"Hours",min:"Minutes",sec:"Seconds"},D="(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)",f="([+-]?\\d+\\s"+D+"|(last|next)\\s"+D+")(\\sago)?",s=e.match(new RegExp(f,"gi")),!s)return l;for(g=0,d=s.length;d>g;g++)if(!n(s[g]))return l;return w.getTime()/1e3}
        function is_numeric(a){var b=" \n\r\t\f\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";return("number"==typeof a||"string"==typeof a&&-1===b.indexOf(a.slice(-1)))&&""!==a&&!isNaN(a)}
        function intval(e,t){var n;var r=typeof e;if(r==="boolean"){return+e}else if(r==="string"){n=parseInt(e,t||10);return isNaN(n)||!isFinite(n)?0:n}else if(r==="number"&&isFinite(e)){return e|0}else{return 0}}
    }
})
