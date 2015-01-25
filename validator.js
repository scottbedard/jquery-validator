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
            defaultMessages = {
                'accepted': 'The :element must be accepted.',
                'after': 'The :element must be a date after :param.',
                'alpha': 'The :element may only contain letters.',
                'alpha_dash': 'The :element may only contain letters, numbers, and dashes.',
                'alpha_num': 'The :element may only contain letters and numbers.',
                'before': 'The :element must be a date before :param.',
                'between': {
                    'numeric':  'The :element must be between :param - :param.',
                    'string':   'The :element must be between :param - :param characters.'
                },
                'boolean' : 'The :element must be a boolean.',
                'confirmed': 'The :element confirmation does not match.',
                'date': 'The :element is not a valid date.',
                'different': 'The :element and :param must be different.',
                'digits': 'The :element must be :param digits.',
                'digits_between': 'The :element must be between :param and :param digits.',
                'email': 'The :element format is invalid.',
                'in': 'The selected :element is invalid.',
                'integer': 'The :element must be an integer.',
                'ip': 'The :element must be a valid IP address.',
                'max': {
                    'numeric':  'The :element may not be greater than :param.',
                    'string':   'The :element may not be greater than :param characters.'
                },
                'min': {
                    'numeric':  'The :element must be at least :param.',
                    'string':   'The :element must be at least :param characters.'
                },
                'not_in': 'The selected :element is invalid.',
                'numeric': 'The :element must be a number.',
                'regex': 'The :element format is invalid.',
                'required': 'The :element field is required.',
                'required_if': 'The :element field is required when :param is :shifted.',
                'required_with': 'The :element field is required when :values is present.',
                'required_with_all': 'The :element field is required when :values is present.',
                'required_without': 'The :element field is required when :values is not present.',
                'required_without_all': 'The :element field is required when :values is not present.',
                'same': 'The :element and :param must match.',
                'size': {
                    'numeric':  'The :element must be :param.',
                    'string':   'The :element must be :param characters.'
                }
            },
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
            if (typeof(param) != 'object')
                param = [param];
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

            // Otherwise parse and push the default message
            else {
                var defaultMessage = defaultMessages[rule]
                if (typeof defaultMessage == 'object')
                    defaultMessage = defaultMessage[type]
                defaultMessage = defaultMessage.replace(':element', element);
                var paramCount = (defaultMessage.match(/\:param/g) || []).length;
                for (i = 0; i < paramCount; i++)
                    defaultMessage = defaultMessage.replace(':param', param[i])
                defaultMessage = defaultMessage.replace(':values', param.join(', '))
                param.shift()
                defaultMessage = defaultMessage.replace(':shifted', param.join(', '))
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
    
        // Search / replace helper
        function replaceIndex(string, at, repl) {
           return string.replace(/\S/g, function(match, i) {
                if( i === at ) return repl;
                return match;
            });
        }
    }
})
