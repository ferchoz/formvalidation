describe('api', function() {
    // Override the options
    $.extend($.fn.bootstrapValidator.DEFAULT_OPTIONS, {
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        }
    });

    beforeEach(function() {
        $([
            '<div class="container">',
                '<form class="form-horizontal" id="apiForm">',
                    '<div class="form-group">',
                        '<input type="text" name="username" data-bv-notempty />',
                    '</div>',
                    '<div class="form-group">',
                        '<input type="text" name="email" data-bv-emailaddress />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n')).appendTo('body');

        $('#apiForm').bootstrapValidator();

        this.bv     = $('#apiForm').data('bootstrapValidator');
        this.$email = this.bv.getFieldElements('email');
    });

    afterEach(function() {
        $('#apiForm').bootstrapValidator('destroy').parent().remove();
    });

    it('call revalidateField()', function() {
        this.$email.val('email@domain.com');
        this.bv.validate();
        expect(this.bv.isValidField('email')).toBeTruthy();

        this.$email.val('invalid#email.address');
        this.bv.revalidateField('email');
        expect(this.bv.isValidField(this.$email)).toEqual(false);
    });

    it('call destroy()', function() {
        this.bv.destroy();
        expect($('#apiForm').data('bootstrapValidator')).toBeUndefined();
        expect($('#apiForm').find('i[data-bv-icon-for]').length).toEqual(0);
        expect($('#apiForm').find('.help-block[data-bv-for]').length).toEqual(0);
        expect($('#apiForm').find('.has-feedback').length).toEqual(0);
        expect($('#apiForm').find('.has-success').length).toEqual(0);
        expect($('#apiForm').find('.has-error').length).toEqual(0);
        expect($('#apiForm').find('[data-bv-field]').length).toEqual(0);
    });
});

describe('container form option', function() {
    beforeEach(function() {
        $([
            '<form id="containerForm" class="form-horizontal">',
                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Full name</label>',
                    '<div class="col-lg-4">',
                        '<input type="text" class="form-control" name="firstName" required placeholder="First name" data-bv-notempty-message="The first name is required" />',
                    '</div>',
                    '<div class="col-lg-4">',
                        '<input type="text" class="form-control" name="lastName" required placeholder="Last name" data-bv-notempty-message="The last name is required" />',
                    '</div>',
                '</div>',
                '<div id="errors"></div>',
            '</form>'
        ].join('')).appendTo('body');
    });

    afterEach(function() {
        $('#containerForm').bootstrapValidator('destroy').remove();
    });

    it('form container declarative', function() {
        $('#containerForm')
            .attr('data-bv-container', '#errors')
            .bootstrapValidator();

        this.bv         = $('#containerForm').data('bootstrapValidator');
        this.$firstName = this.bv.getFieldElements('firstName');
        this.$lastName  = this.bv.getFieldElements('lastName');

        expect($('#errors').find('.help-block').length).toBeGreaterThan(0);

        this.$firstName.val('First');
        this.$lastName.val('');
        this.bv.validate();
        expect($('#errors').find('.help-block:visible[data-bv-for="firstName"]').length).toEqual(0);
        expect($('#errors').find('.help-block:visible[data-bv-for="lastName"]').length).toBeGreaterThan(0);
    });

    it('form container programmatically', function() {
        $('#containerForm').bootstrapValidator({
            container: '#errors'
        });

        this.bv         = $('#containerForm').data('bootstrapValidator');
        this.$firstName = this.bv.getFieldElements('firstName');
        this.$lastName  = this.bv.getFieldElements('lastName');

        expect($('#errors').find('.help-block').length).toBeGreaterThan(0);

        this.$firstName.val('');
        this.$lastName.val('Last');
        this.bv.validate();
        expect($('#errors').find('.help-block:visible[data-bv-for="firstName"]').length).toBeGreaterThan(0);
        expect($('#errors').find('.help-block:visible[data-bv-for="lastName"]').length).toEqual(0);

        this.bv.resetForm();
        this.$firstName.val('First');
        this.$lastName.val('Last');
        this.bv.validate();
        expect($('#errors').find('.help-block:visible').length).toEqual(0);
    });
});

describe('container field option', function() {
    beforeEach(function() {
        $([
            '<form id="containerForm" class="form-horizontal">',
                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Full name</label>',
                    '<div class="col-lg-4">',
                        '<input type="text" class="form-control" name="firstName" required placeholder="First name" data-bv-notempty-message="The first name is required" data-bv-container="#firstNameMessage" />',
                        '<span class="help-block" id="firstNameMessage" />',
                    '</div>',
                    '<div class="col-lg-4">',
                        '<input type="text" class="form-control" name="lastName" required placeholder="Last name" data-bv-notempty-message="The last name is required" />',
                        '<span class="help-block lastNameMessage" />',
                    '</div>',
                '</div>',
            '</form>'
        ].join('')).appendTo('body');

        $('#containerForm').bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                lastName: {
                    container: '.lastNameMessage'
                }
            }
        });

        this.bv         = $('#containerForm').data('bootstrapValidator');
        this.$firstName = this.bv.getFieldElements('firstName');
        this.$lastName  = this.bv.getFieldElements('lastName');
    });

    afterEach(function() {
        $('#containerForm').bootstrapValidator('destroy').remove();
    });

    it('field container declarative', function() {
        expect($.trim($('#firstNameMessage').text())).toEqual('The first name is required');
        expect($.trim($('.lastNameMessage').text())).toEqual('The last name is required');
    });

    it('field container programmatically', function() {
        this.$firstName.val('First');
        this.$lastName.val('');
        this.bv.validate();
        expect($('#firstNameMessage').find('.help-block:visible').length).toEqual(0);
        expect($('.lastNameMessage').find('.help-block:visible').length).toBeGreaterThan(0);

        this.bv.resetForm();
        this.$firstName.val('');
        this.$lastName.val('Last');
        this.bv.validate();
        expect($('#firstNameMessage').find('.help-block:visible').length).toBeGreaterThan(0);
        expect($('.lastNameMessage').find('.help-block:visible').length).toEqual(0);
    });
});

describe('container tooltip/popover', function() {
    beforeEach(function() {
        $([
            '<form id="containerForm" class="form-horizontal">',
                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Full name</label>',
                    '<div class="col-lg-4">',
                        '<input type="text" class="form-control" name="firstName" required placeholder="First name" data-bv-notempty-message="The first name is required" />',
                    '</div>',
                    '<div class="col-lg-4">',
                        '<input type="text" class="form-control" name="lastName" required placeholder="Last name" data-bv-notempty-message="The last name is required" />',
                    '</div>',
                '</div>',
                '<div id="errors"></div>',
            '</form>'
        ].join('')).appendTo('body');
    });

    afterEach(function() {
        $('#containerForm').bootstrapValidator('destroy').remove();
    });

    it('container declarative', function() {
        $('#containerForm')
            .attr('data-bv-container', 'tooltip')
            .find('[name="lastName"]')
                .attr('data-bv-container', 'popover')
                .end()
            .bootstrapValidator();

        this.bv         = $('#containerForm').data('bootstrapValidator');
        this.$firstName = this.bv.getFieldElements('firstName');
        this.$lastName  = this.bv.getFieldElements('lastName');

        this.bv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeDefined();
        expect(this.$firstName.parent().find('i').data('bs.tooltip').type).toEqual('tooltip');
        expect(this.$lastName.parent().find('i').data('bs.popover')).toBeDefined();
        expect(this.$lastName.parent().find('i').data('bs.popover').type).toEqual('popover');

        this.bv.resetForm();
        this.$firstName.val('First');
        this.$lastName.val('Last');
        this.bv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeUndefined();
        expect(this.$lastName.parent().find('i').data('bs.popover')).toBeUndefined();
    });

    it('container programmatically', function() {
        $('#containerForm').bootstrapValidator({
            container: 'tooltip',
            fields: {
                lastName: {
                    container: 'popover'
                }
            }
        });

        this.bv         = $('#containerForm').data('bootstrapValidator');
        this.$firstName = this.bv.getFieldElements('firstName');
        this.$lastName  = this.bv.getFieldElements('lastName');

        this.bv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeDefined();
        expect(this.$firstName.parent().find('i').data('bs.tooltip').type).toEqual('tooltip');
        expect(this.$lastName.parent().find('i').data('bs.popover')).toBeDefined();
        expect(this.$lastName.parent().find('i').data('bs.popover').type).toEqual('popover');

        this.bv.resetForm();
        this.$firstName.val('First');
        this.$lastName.val('Last');
        this.bv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeUndefined();
        expect(this.$lastName.parent().find('i').data('bs.popover')).toBeUndefined();
    });
});

describe('enable validators', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="enableForm">',
                '<div class="form-group">',
                    '<input type="text" name="fullName" class="form-control" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#enableForm').bootstrapValidator({
            fields: {
                fullName: {
                    validators: {
                        notEmpty: {
                            message: 'The full name is required and cannot be empty'
                        },
                        stringLength: {
                            min: 8,
                            max: 40,
                            message: 'The full name must be more than 8 and less than 40 characters long'
                        },
                        regexp: {
                            enabled: false,
                            regexp: /^[a-zA-Z\s]+$/,
                            message: 'The username can only consist of alphabetical, number, and space'
                        }
                    }
                }
            }
        });

        this.bv        = $('#enableForm').data('bootstrapValidator');
        this.$fullName = this.bv.getFieldElements('fullName');
    });

    afterEach(function() {
        $('#enableForm').bootstrapValidator('destroy').remove();
    });

    it('enable all validators', function() {
        this.$fullName.val('@ $full N@m3');
        this.bv.validate();
        expect(this.bv.isValid()).toBeTruthy();

        this.bv.resetForm();
        this.$fullName.val('Contain#$@');
        this.bv.enableFieldValidators('fullName', true);
        this.bv.validate();
        expect(this.bv.isValidField('fullName')).toEqual(false);
        expect(this.bv.isValid()).toEqual(false);
    });

    it('disable all validators', function() {
        this.bv.resetForm();
        this.bv.enableFieldValidators('fullName', false);
        this.bv.validate();
        expect(this.bv.isValid()).toBeTruthy();
    });

    it('enabled option particular validator', function() {
        this.$fullName.val('Contain@#$');
        this.bv.validate();
        expect(this.bv.isValid()).toBeTruthy();

        var messages = this.bv.getMessages('fullName');
        expect(messages.length).toEqual(0);
    });

    it('enable particular validators', function() {
        // Enable stringLength validator
        this.bv.resetForm();
        this.bv.enableFieldValidators('fullName', true, 'stringLength');
        this.bv.enableFieldValidators('fullName', true, 'regexp');
        this.$fullName.val('Full@');
        this.bv.validate();
        expect(this.bv.isValid()).toEqual(false);

        var messages = this.bv.getMessages('fullName');
        expect($.inArray('The full name must be more than 8 and less than 40 characters long', messages)).toBeGreaterThan(-1);
        expect($.inArray('The username can only consist of alphabetical, number, and space', messages)).toBeGreaterThan(-1);
    });

    it('disable particular validators', function() {
        // Disable stringLength validator
        this.bv.enableFieldValidators('fullName', false, 'stringLength');
        this.$fullName.val('Full');
        this.bv.validate();
        expect(this.bv.isValid()).toBeTruthy();

        var messages = this.bv.getMessages('fullName');
        expect($.inArray('The full name must be more than 8 and less than 40 characters long', messages)).toEqual(-1);

        // Disable regexp validator
        this.bv.enableFieldValidators('fullName', false, 'regexp');
        this.$fullName.val('Special@#$');
        this.bv.validate();
        expect(this.bv.isValid()).toBeTruthy();

        var messages = this.bv.getMessages('fullName');
        expect($.inArray('The username can only consist of alphabetical, number, and space', messages)).toEqual(-1);
    });
});

var My = {
    NameSpace: {
        onEmailValid: function(e, data) {
            $('#msg').html('My.NameSpace.onEmailValid() called, ' + data.field + ' is valid');
        },

        onEmailInvalid: function(e, data) {
            $('#msg').html('My.NameSpace.onEmailInvalid() called, ' + data.field + ' is invalid');
        },

        onFormValid: function(e) {
            $('#msg').html('My.NameSpace.onFormValid() called, form ' + $(e.target).attr('id') + ' is valid');
        },

        onFormInvalid: function(e) {
            $('#msg').html('My.NameSpace.onFormInvalid() called, form ' + $(e.target).attr('id') + ' is invalid');
        }
    }
};

// ---
// Form events
// ---

function onFormValid(e) {
    $('#msg').html('form ' + $(e.target).attr('id') + ' is valid');
};

function onFormInvalid(e) {
    $('#msg').html('form ' + $(e.target).attr('id') + ' is invalid');
};

describe('event form attribute callback global', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm" data-bv-onsuccess="onFormValid" data-bv-onerror="onFormInvalid" >',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" required data-bv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').bootstrapValidator();

        this.bv     = $('#eventForm').data('bootstrapValidator');
        this.$email = this.bv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').bootstrapValidator('destroy').remove();
    });

    it('call data-bv-onsuccess', function() {
        this.$email.val('email@domain.com');
        this.bv.validate();
        expect($('#msg').html()).toEqual('form eventForm is valid');
    });

    it('call data-bv-onerror', function() {
        this.$email.val('email@domain');
        this.bv.validate();
        expect($('#msg').html()).toEqual('form eventForm is invalid');
    });
});

describe('event form attribute callback namespace', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm" data-bv-onsuccess="My.NameSpace.onFormValid" data-bv-onerror="My.NameSpace.onFormInvalid" >',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" required data-bv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').bootstrapValidator();

        this.bv     = $('#eventForm').data('bootstrapValidator');
        this.$email = this.bv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').bootstrapValidator('destroy').remove();
    });

    it('call data-bv-onsuccess', function() {
        this.$email.val('email@domain.com');
        this.bv.validate();
        expect($('#msg').html()).toEqual('My.NameSpace.onFormValid() called, form eventForm is valid');
    });

    it('call data-bv-onerror', function() {
        this.$email.val('email@domain');
        this.bv.validate();
        expect($('#msg').html()).toEqual('My.NameSpace.onFormInvalid() called, form eventForm is invalid');
    });
});

describe('event form trigger', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-bv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm')
            .bootstrapValidator()
            .on('success.form.bv', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered success.form.bv event');
            })
            .on('error.form.bv', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered error.form.bv event');
            });

        this.bv     = $('#eventForm').data('bootstrapValidator');
        this.$email = this.bv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').bootstrapValidator('destroy').remove();
    });

    it('trigger success.form.bv', function() {
        this.$email.val('email@domain.com');
        this.bv.validate();
        expect($('#msg').html()).toEqual('form eventForm triggered success.form.bv event');
    });

    it('trigger error.form.bv', function() {
        this.$email.val('email@domain');
        this.bv.validate();
        expect($('#msg').html()).toEqual('form eventForm triggered error.form.bv event');
    });
});

describe('event form programmatically', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-bv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').bootstrapValidator({
            onSuccess: function(e) {
                $('#msg').html('onSuccess() called');
            },
            onError: function(e) {
                $('#msg').html('onError() called');
            }
        });

        this.bv     = $('#eventForm').data('bootstrapValidator');
        this.$email = this.bv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').bootstrapValidator('destroy').remove();
    });

    it('call onSuccess()', function() {
        this.$email.val('email@domain.com');
        this.bv.validate();
        expect($('#msg').html()).toEqual('onSuccess() called');
    });

    it('call onError()', function() {
        this.$email.val('email@domain');
        this.bv.validate();
        expect($('#msg').html()).toEqual('onError() called');
    });
});

// ---
// Field events
// ---

function onEmailValid(e, data) {
    $('#msg').html(data.field + ' is valid');
};

function onEmailInvalid(e, data) {
    $('#msg').html(data.field + ' is invalid');
};

describe('event field attribute callback global', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-bv-emailaddress data-bv-onsuccess="onEmailValid" data-bv-onerror="onEmailInvalid" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').bootstrapValidator();

        this.bv     = $('#eventForm').data('bootstrapValidator');
        this.$email = this.bv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').bootstrapValidator('destroy').remove();
    });

    it('call data-bv-onsuccess', function() {
        this.$email.val('email@domain.com');
        this.bv.validate();
        expect($('#msg').html()).toEqual('email is valid');
    });

    it('call data-bv-onerror', function() {
        this.$email.val('email@domain');
        this.bv.validate();
        expect($('#msg').html()).toEqual('email is invalid');
    });
});

describe('event field attribute callback namespace', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-bv-emailaddress data-bv-onsuccess="My.NameSpace.onEmailValid" data-bv-onerror="My.NameSpace.onEmailInvalid" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').bootstrapValidator();

        this.bv     = $('#eventForm').data('bootstrapValidator');
        this.$email = this.bv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').bootstrapValidator('destroy').remove();
    });

    it('call data-bv-onsuccess', function() {
        this.$email.val('email@domain.com');
        this.bv.validate();
        expect($('#msg').html()).toEqual('My.NameSpace.onEmailValid() called, email is valid');
    });

    it('call data-bv-onerror', function() {
        this.$email.val('email@domain');
        this.bv.validate();
        expect($('#msg').html()).toEqual('My.NameSpace.onEmailInvalid() called, email is invalid');
    });
});

describe('event field trigger', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-bv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm')
            .bootstrapValidator()
            .on('success.field.bv', '[name="email"]', function(e, data) {
                $('#msg').html('triggered success.field.bv on ' + data.field);
            })
            .on('error.field.bv', '[name="email"]', function(e, data) {
                $('#msg').html('triggered error.field.bv on ' + data.field);
            });

        this.bv     = $('#eventForm').data('bootstrapValidator');
        this.$email = this.bv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').bootstrapValidator('destroy').remove();
    });

    it('trigger success.field.bv', function() {
        this.$email.val('email@domain.com');
        this.bv.validate();
        expect($('#msg').html()).toEqual('triggered success.field.bv on email');
    });

    it('trigger error.field.bv', function() {
        this.$email.val('email@domain');
        this.bv.validate();
        expect($('#msg').html()).toEqual('triggered error.field.bv on email');
    });
});

describe('event field programmatically', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-bv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').bootstrapValidator({
            fields: {
                email: {
                    onSuccess: function(e, data) {
                        $('#msg').html('onSuccess() called');
                    },
                    onError: function(e, data) {
                        $('#msg').html('onError() called');
                    },
                    validator: {
                        emailAddress: {}
                    }
                }
            }
        });

        this.bv     = $('#eventForm').data('bootstrapValidator');
        this.$email = this.bv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').bootstrapValidator('destroy').remove();
    });

    it('call onSuccess()', function() {
        this.$email.val('email@domain.com');
        this.bv.validate();
        expect($('#msg').html()).toEqual('onSuccess() called');
    });

    it('call onError()', function() {
        this.$email.val('email@domain');
        this.bv.validate();
        expect($('#msg').html()).toEqual('onError() called');
    });
});

describe('excluded', function() {
    beforeEach(function() {
        $([
            '<div class="container">',
                '<form class="form-horizontal" id="excludedForm" data-bv-excluded="[name=\'email\']">',
                    '<div class="form-group">',
                        '<input type="text" name="username" required />',
                    '</div>',
                    '<div class="form-group">',
                        '<input type="text" name="email" required data-bv-emailaddress />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('')).appendTo('body');

        $('#excludedForm').bootstrapValidator();

        this.bv        = $('#excludedForm').data('bootstrapValidator');
        this.$username = this.bv.getFieldElements('username');
        this.$email    = this.bv.getFieldElements('email');
    });

    afterEach(function() {
        $('#excludedForm').bootstrapValidator('destroy').parent().remove();
    });

    it('excluded form declarative', function() {
        this.bv.validate();
        expect(this.bv.isValid()).toEqual(false);

        this.bv.resetForm();
        this.$username.val('your_user_name');
        this.$email.val('');
        this.bv.validate();
        expect(this.bv.isValid()).toBeTruthy();
    });

    it('excluded form programmatically', function() {
        this.bv.destroy();
        $('#excludedForm').removeAttr('data-bv-excluded');

        $('#excludedForm').bootstrapValidator({
            excluded: '[name="username"]'
        });

        this.bv        = $('#excludedForm').data('bootstrapValidator');
        this.$username = this.bv.getFieldElements('username');
        this.$email    = this.bv.getFieldElements('email');

        this.$username.val('');
        this.$email.val('invalid#email.com');
        this.bv.validate();
        expect(this.bv.isValid()).toEqual(false);

        this.bv.resetForm();
        this.$email.val('valid@email.com');
        this.bv.validate();
        expect(this.bv.isValid()).toBeTruthy();
    });

    it('excluded field declarative', function() {
        this.bv.destroy();
        $('#excludedForm').removeAttr('data-bv-excluded');
        $('#excludedForm').find('[name="username"]').attr('data-bv-excluded', 'true');
        $('#excludedForm').find('[name="email"]').attr('data-bv-excluded', 'false');

        this.bv        = $('#excludedForm').bootstrapValidator().data('bootstrapValidator');
        this.$username = this.bv.getFieldElements('username');
        this.$email    = this.bv.getFieldElements('email');

        this.$username.val('');
        this.$email.val('');
        this.bv.validate();
        expect(this.bv.isValid()).toEqual(false);

        this.bv.resetForm();
        this.$email.val('invalid#email.com');
        this.bv.validate();
        expect(this.bv.isValid()).toEqual(false);

        this.bv.resetForm();
        this.$email.val('valid@email.com');
        this.bv.validate();
        expect(this.bv.isValid()).toBeTruthy();
    });

    it('excluded field programmatically true/false', function() {
        this.bv.destroy();
        $('#excludedForm').removeAttr('data-bv-excluded');

        $('#excludedForm').bootstrapValidator({
            fields: {
                username: {
                    excluded: true
                },
                email: {
                    excluded: false
                }
            }
        });

        this.bv        = $('#excludedForm').bootstrapValidator().data('bootstrapValidator');
        this.$username = this.bv.getFieldElements('username');
        this.$email    = this.bv.getFieldElements('email');

        this.$username.val('');
        this.$email.val('');
        this.bv.validate();
        expect(this.bv.isValid()).toEqual(false);

        this.bv.resetForm();
        this.$email.val('invalid#email.com');
        this.bv.validate();
        expect(this.bv.isValid()).toEqual(false);

        this.bv.resetForm();
        this.$email.val('valid@email.com');
        this.bv.validate();
        expect(this.bv.isValid()).toBeTruthy();
    });

    it('excluded field programmatically "true"/"false"', function() {
        this.bv.destroy();
        $('#excludedForm').removeAttr('data-bv-excluded');

        $('#excludedForm').bootstrapValidator({
            fields: {
                username: {
                    excluded: 'false'
                },
                email: {
                    excluded: 'true'
                }
            }
        });

        this.bv        = $('#excludedForm').bootstrapValidator().data('bootstrapValidator');
        this.$username = this.bv.getFieldElements('username');
        this.$email    = this.bv.getFieldElements('email');

        this.$username.val('');
        this.$email.val('valid@email.com');
        this.bv.validate();
        expect(this.bv.isValid()).toEqual(false);

        this.bv.resetForm();
        this.$username.val('your_user_name');
        this.$email.val('invalid#email.com');
        this.bv.validate();
        expect(this.bv.isValid()).toBeTruthy();
    });
});

describe('group option', function() {
    beforeEach(function() {
        $([
            '<form id="groupForm" method="post" class="form-horizontal">',
                '<div class="form-group">',
                    '<div class="firstNameGroup">',
                        '<label class="col-sm-2 control-label">First name</label>',
                        '<div class="col-sm-4">',
                            '<input type="text" class="form-control" name="firstName" />',
                        '</div>',
                    '</div>',
                    '<div class="lastNameGroup">',
                        '<label class="col-sm-2 control-label">Last name</label>',
                        '<div class="col-sm-4">',
                            '<input type="text" class="form-control" name="lastName" data-bv-group=".lastNameGroup" />',
                        '</div>',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-sm-2 control-label">Username</label>',
                    '<div class="col-sm-5">',
                        '<input type="text" class="form-control" name="username" />',
                    '</div>',
                '</div>',
            '</form>'
        ].join('')).appendTo('body');

        $('#groupForm').bootstrapValidator({
            fields: {
                firstName: {
                    group: '.firstNameGroup',
                    validators: {
                        notEmpty: {
                            message: 'The first name is required and cannot be empty'
                        }
                    }
                },
                lastName: {
                    validators: {
                        notEmpty: {
                            message: 'The last name is required and cannot be empty'
                        }
                    }
                },
                username: {
                    validators: {
                        notEmpty: {
                            message: 'The username is required and cannot be empty'
                        },
                        stringLength: {
                            min: 6,
                            max: 30,
                            message: 'The username must be more than 6 and less than 30 characters long'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z0-9_\.]+$/,
                            message: 'The username can only consist of alphabetical, number, dot and underscore'
                        }
                    }
                }
            }
        });

        this.bv         = $('#groupForm').data('bootstrapValidator');
        this.$firstName = this.bv.getFieldElements('firstName');
        this.$lastName  = this.bv.getFieldElements('lastName');
        this.$username  = this.bv.getFieldElements('username');
    });

    afterEach(function() {
        $('#groupForm').bootstrapValidator('destroy').remove();
    });

    it('group default', function() {
        this.$username.val('123@#$');
        this.bv.validate();
        expect(this.$username.parents('.form-group').hasClass('has-error')).toBeTruthy();
        expect(this.$username.parents('.form-group').hasClass('has-success')).toEqual(false);

        this.bv.resetForm();
        this.$username.val('validUser.Name');
        this.bv.validate();
        expect(this.$username.parents('.form-group').hasClass('has-success')).toBeTruthy();
        expect(this.$username.parents('.form-group').hasClass('has-error')).toEqual(false);
    });

    it('group programmatically', function() {
        this.$firstName.val('');
        this.bv.validate();
        expect(this.$firstName.parents('.firstNameGroup').hasClass('has-error')).toBeTruthy();
        expect(this.$firstName.parents('.firstNameGroup').hasClass('has-success')).toEqual(false);
        expect(this.$firstName.parents('.form-group').hasClass('has-error')).toEqual(false);
    });

    it('group declarative', function() {
        this.$firstName.val('First');
        this.$lastName.val('Last');
        this.bv.validate();
        expect(this.$lastName.parents('.lastNameGroup').hasClass('has-success')).toBeTruthy();
        expect(this.$lastName.parents('.lastNameGroup').hasClass('has-error')).toEqual(false);
        expect(this.$lastName.parents('.form-group').hasClass('has-success')).toEqual(false);
        expect(this.$lastName.parents('.form-group').hasClass('has-error')).toEqual(false);
    });
});

describe('i18n', function() {
    beforeEach(function() {
        $([
            '<form id="i18nForm" class="form-horizontal">',
                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Full name</label>',
                    '<div class="col-lg-5">',
                        '<input type="text" class="form-control" name="fullName" />',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Username</label>',
                    '<div class="col-lg-5">',
                        '<input type="text" class="form-control" name="username" />',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Email address</label>',
                    '<div class="col-lg-5">',
                        '<input type="text" class="form-control" name="email" />',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Password</label>',
                    '<div class="col-lg-5">',
                        '<input type="password" class="form-control" name="password" />',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Retype password</label>',
                    '<div class="col-lg-5">',
                        '<input type="password" class="form-control" name="confirmPassword" />',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Gender</label>',
                    '<div class="col-lg-5">',
                        '<div class="radio">',
                            '<label><input type="radio" name="gender" value="male" /> Male</label>',
                        '</div>',
                        '<div class="radio">',
                            '<label><input type="radio" name="gender" value="female" /> Female</label>',
                        '</div>',
                        '<div class="radio">',
                            '<label><input type="radio" name="gender" value="other" /> Other</label>',
                        '</div>',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Age</label>',
                    '<div class="col-lg-3">',
                        '<input type="text" class="form-control" name="age" />',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Website</label>',
                    '<div class="col-lg-5">',
                        '<input type="text" class="form-control" name="website" />',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Phone number</label>',
                    '<div class="col-lg-5">',
                        '<input type="text" class="form-control" name="phoneNumber" />',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Languages</label>',
                    '<div class="col-lg-5">',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="languages[]" value="english" /> English</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="languages[]" value="french" /> French</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="languages[]" value="german" /> German</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="languages[]" value="russian" /> Russian</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="languages[]" value="other" /> Other</label>',
                        '</div>',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Programming Languages</label>',
                    '<div class="col-lg-5">',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="programs[]" value="net" /> .Net</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="programs[]" value="java" /> Java</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="programs[]" value="c" /> C/C++</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="programs[]" value="php" /> PHP</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="programs[]" value="perl" /> Perl</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="programs[]" value="ruby" /> Ruby</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="programs[]" value="python" /> Python</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="programs[]" value="javascript" /> Javascript</label>',
                        '</div>',
                    '</div>',
                '</div>',
            '</form>'
        ].join('')).appendTo('body');

        $('#i18nForm').bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                fullName: {
                    validators: {
                        notEmpty: {},
                        stringCase: {
                            'case': 'upper'
                        }
                    }
                },
                username: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 6,
                            max: 20
                        },
                        regexp: {
                            regexp: /^[a-zA-Z0-9_\.]+$/
                        },
                        different: {
                            field: 'password'
                        }
                    }
                },
                email: {
                    validators: {
                        emailAddress: {}
                    }
                },
                password: {
                    validators: {
                        notEmpty: {},
                        identical: {
                            field: 'confirmPassword'
                        },
                        different: {
                            field: 'username'
                        }
                    }
                },
                confirmPassword: {
                    validators: {
                        notEmpty: {},
                        identical: {
                            field: 'password'
                        },
                        different: {
                            field: 'username'
                        }
                    }
                },
                age: {
                    validators: {
                        notEmpty: {},
                        digits: {},
                        greaterThan: {
                            value: 18
                        },
                        lessThan: {
                            value: 100
                        }
                    }
                },
                website: {
                    validators: {
                        notEmpty: {},
                        uri: {}
                    }
                },
                phoneNumber: {
                    validators: {
                        notEmpty: {},
                        digits: {},
                        phone: {
                            country: 'US'
                        }
                    }
                },
                gender: {
                    validators: {
                        notEmpty: {}
                    }
                },
                'languages[]': {
                    validators: {
                        notEmpty: {}
                    }
                },
                'programs[]': {
                    validators: {
                        choice: {
                            min: 2,
                            max: 4
                        }
                    }
                }
            }
        });

        this.bv        = $('#i18nForm').data('bootstrapValidator');
        this.$fullName = this.bv.getFieldElements('fullName');
        this.$email    = this.bv.getFieldElements('email');
        this.$userName = this.bv.getFieldElements('username');
        this.$password = this.bv.getFieldElements('password');
        this.$confirm  = this.bv.getFieldElements('confirmPassword');
        this.$age      = this.bv.getFieldElements('age');
        this.$website  = this.bv.getFieldElements('website');
        this.$phone    = this.bv.getFieldElements('phoneNumber');
        this.$program  = this.bv.getFieldElements('programs[]');
    });

    afterEach(function() {
        $('#i18nForm').bootstrapValidator('destroy').remove();
    });

    it('default message', function() {
        this.bv.validate();
        expect(this.bv.getMessages(this.$fullName, 'notEmpty')[0]).toEqual($.fn.bootstrapValidator.i18n.notEmpty['default']);

        this.$fullName.val('lowerName');
        this.bv.revalidateField('fullName');
        expect(this.bv.getMessages('fullName', 'stringCase')[0]).toEqual($.fn.bootstrapValidator.i18n.stringCase.upper);

        this.bv.resetForm();
        this.$userName.val('123');
        this.bv.validate();
        expect(this.bv.getMessages('username', 'stringLength')[0]).toEqual($.fn.bootstrapValidator.i18n.stringLength.getMessage({ min: 6, max: 20 }));

        this.bv.resetForm();
        this.$userName.val('contain@#$');
        this.bv.validate();
        expect(this.bv.getMessages(this.$userName, 'regexp')[0]).toEqual($.fn.bootstrapValidator.i18n.regexp['default']);

        this.bv.resetForm();
        this.$userName.val('validUserName');
        this.$password.val('validUserName');
        this.bv.validate();
        expect(this.bv.getMessages('username', 'different')[0]).toEqual($.fn.bootstrapValidator.i18n.different['default']);

        this.bv.resetForm();
        this.$email.val('invalid#email@address');
        this.bv.validate();
        expect(this.bv.getMessages(this.$email, 'emailAddress')[0]).toEqual($.fn.bootstrapValidator.i18n.emailAddress['default']);

        this.bv.resetForm();
        this.$password.val('@S3cur3P@@w0rd');
        this.$confirm.val('notMatch');
        this.bv.validate();
        expect(this.bv.getMessages('password', 'identical')[0]).toEqual($.fn.bootstrapValidator.i18n.identical['default']);

        this.bv.resetForm();
        this.$age.val('notDigit');
        this.bv.validate();
        expect(this.bv.getMessages('age', 'digits')[0]).toEqual($.fn.bootstrapValidator.i18n.digits['default']);

        this.bv.resetForm();
        this.$age.val(10);
        this.bv.validate();
        expect(this.bv.getMessages(this.$age, 'greaterThan')[0]).toEqual($.fn.bootstrapValidator.i18n.greaterThan.getMessage({ value: 18 }));

        this.bv.resetForm();
        this.$age.val(120);
        this.bv.validate();
        expect(this.bv.getMessages('age', 'lessThan')[0]).toEqual($.fn.bootstrapValidator.i18n.lessThan.getMessage({ value: 100 }));

        this.bv.resetForm();
        this.$website.val('http://invalidWebsite');
        this.bv.validate();
        expect(this.bv.getMessages('website', 'uri')[0]).toEqual($.fn.bootstrapValidator.i18n.uri['default']);

        this.bv.resetForm();
        this.$phone.val('123456');
        this.bv.validate();
        expect(this.bv.getMessages('phoneNumber', 'phone')[0]).toEqual($.fn.bootstrapValidator.i18n.phone.getMessage({ country: 'US' }));

        this.bv.resetForm();
        this.$program.eq(0).prop('checked', 'checked');
        this.bv.validate();
        expect(this.bv.getMessages(this.$program, 'choice')[0]).toEqual($.fn.bootstrapValidator.i18n.choice.getMessage({ min: 2, max: 4 }));

        this.bv.resetForm();
        this.$program.prop('checked', 'checked');
        this.bv.validate();
        expect(this.bv.getMessages('programs[]', 'choice')[0]).toEqual($.fn.bootstrapValidator.i18n.choice.getMessage({ min: 2, max: 4 }));
    });
});

describe('message', function() {
    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="messageForm">',
                    '<div class="form-group">',
                        '<input type="password" class="form-control" name="password" placeholder="Enter secure password" />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#messageForm').bootstrapValidator({
            fields: {
                password: {
                    validators: {
                        notEmpty: {
                            message: 'The password is required'
                        },
                        callback: {
                            callback: function(value, validator) {
                                // Check the password strength
                                if (value.length < 6) {
                                    return {
                                        valid: false,
                                        message: 'The password must be more than 6 characters'
                                    }
                                }

                                if (value === value.toLowerCase()) {
                                    return {
                                        valid: false,
                                        message: 'The password must contain at least one upper case character'
                                    }
                                }
                                if (value === value.toUpperCase()) {
                                    return {
                                        valid: false,
                                        message: 'The password must contain at least one lower case character'
                                    }
                                }
                                if (value.search(/[0-9]/) < 0) {
                                    return {
                                        valid: false,
                                        message: 'The password must contain at least one digit'
                                    }
                                }

                                return true;
                            }
                        }
                    }
                }
            }
        });

        this.bv        = $('#messageForm').data('bootstrapValidator');
        this.$password = this.bv.getFieldElements('password');
    });

    afterEach(function() {
        $('#messageForm').bootstrapValidator('destroy').parent().remove();
    });

    it('update message from callback', function() {
        this.bv.resetForm();
        this.$password.val('123');
        this.bv.validate();
        expect(this.bv.getMessages('password', 'callback')[0]).toEqual('The password must be more than 6 characters');

        this.bv.resetForm();
        this.$password.val('no_upper_case!@#');
        this.bv.validate();
        expect(this.bv.getMessages('password', 'callback')[0]).toEqual('The password must contain at least one upper case character');

        this.bv.resetForm();
        this.$password.val('NO_LOWER_CASE123');
        this.bv.validate();
        expect(this.bv.getMessages('password', 'callback')[0]).toEqual('The password must contain at least one lower case character');

        this.bv.resetForm();
        this.$password.val('NoDigits!@#');
        this.bv.validate();
        expect(this.bv.getMessages('password', 'callback')[0]).toEqual('The password must contain at least one digit');
    });

    it('call updateMessage()', function() {
        this.bv.updateStatus('password', this.bv.STATUS_INVALID, 'callback');

        this.bv.updateMessage('password', 'callback', 'The password is weak');
        expect(this.bv.getMessages('password', 'callback')[0]).toEqual('The password is weak');

        this.bv.updateMessage(this.$password, 'callback', 'The password is not strong');
        expect(this.bv.getMessages(this.$password, 'callback')[0]).toEqual('The password is not strong');
    });
});

function validateCaptcha(value, validator, $field) {
    var items = $('#captchaOperation').html().split(' '), sum = parseInt(items[0]) + parseInt(items[2]);
    return value === sum + '';
};

describe('callback', function() {
    beforeEach(function() {
        $(['<div class="container">',
                '<form class="form-horizontal" id="callbackForm">',
                    '<div class="form-group">',
                        '<label class="col-md-3 control-label" id="captchaOperation"></label>',
                        '<div class="col-md-2">',
                            '<input type="text" class="form-control" name="captcha" />',
                        '</div>',
                    '</div>',
                    '<div class="form-group">',
                        '<div class="col-md-2 col-md-offset-3">',
                            '<input type="text" class="form-control" name="declarativeCaptcha" data-bv-callback data-bv-callback-callback="validateCaptcha" />',
                        '</div>',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n')).appendTo('body');

        $('#callbackForm').bootstrapValidator({
            fields: {
                captcha: {
                    validators: {
                        callback: {
                            message: 'Wrong answer',
                            callback: function(value, validator, $field) {
                                return validateCaptcha(value, validator, $field);
                            }
                        }
                    }
                }
            }
        });

        this.bv                  = $('#callbackForm').data('bootstrapValidator');
        this.$captcha            = this.bv.getFieldElements('captcha');
        this.$declarativeCaptcha = this.bv.getFieldElements('declarativeCaptcha');
    });

    afterEach(function() {
        $('#callbackForm').bootstrapValidator('destroy').parent().remove();
    });

    it('execute the callback', function() {
        $('#captchaOperation').html('1 + 2');

        this.$captcha.val('3');
        this.bv.validate();
        expect(this.bv.isValidField('captcha')).toBeTruthy();

        this.bv.resetForm();
        this.$captcha.val('5');
        this.bv.validate();
        expect(this.bv.isValidField('captcha')).toEqual(false);
    });

    it('callback declarative', function() {
        $('#captchaOperation').html('10 + 20');

        this.$declarativeCaptcha.val('40');
        this.bv.validate();
        expect(this.bv.isValidField('declarativeCaptcha')).toEqual(false);

        this.bv.resetForm();
        this.$declarativeCaptcha.val('30');
        this.bv.validate();
        expect(this.bv.isValidField('declarativeCaptcha')).toBeTruthy();
    });
});

describe('creditCard', function() {
    // Get the fake credit card number at http://www.getcreditcardnumbers.com/

    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="ccForm">',
                    '<div class="form-group">',
                        '<input type="text" name="cc" data-bv-creditcard />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#ccForm').bootstrapValidator();

        this.bv          = $('#ccForm').data('bootstrapValidator');
        this.$creditCard = this.bv.getFieldElements('cc');
    });

    afterEach(function() {
        $('#ccForm').bootstrapValidator('destroy').parent().remove();
    });

    it('accept spaces', function() {
        this.$creditCard.val('5267 9789 9451 9654');
        this.bv.validate();
        expect(this.bv.isValidField('cc')).toBeTruthy();
    });

    it('accept dashes', function() {
        this.$creditCard.val('6011-2649-6840-4521');
        this.bv.validate();
        expect(this.bv.isValidField('cc')).toBeTruthy();
    });

    it('invalid format', function() {
        this.$creditCard.val('4539.1870.2954.3862');
        this.bv.validate();
        expect(this.bv.isValidField('cc')).toEqual(false);
    });

    it('American Express', function() {
        this.$creditCard.val('340653705597107');
        this.bv.validate();
        expect(this.bv.isValidField('cc')).toBeTruthy();
    });

    it('American Express invalid length', function() {
        this.$creditCard.val('3744148309166730');
        this.bv.validate();
        expect(this.bv.isValidField('cc')).toEqual(false);
    });

    it('American Express invalid prefix', function() {
        this.$creditCard.val('356120148436654');
        this.bv.validate();
        expect(this.bv.isValidField('cc')).toEqual(false);
    });

    it('Diners Club', function() {
        this.$creditCard.val('30130708434187');
        this.bv.validate();
        expect(this.bv.isValidField('cc')).toBeTruthy();
    });

    it('Diners Club (US)', function() {
        this.$creditCard.val('5517479515603901');
        this.bv.validate();
        expect(this.bv.isValidField('cc')).toBeTruthy();
    });

    it('Discover', function() {
        this.$creditCard.val('6011734674929094');
        this.bv.validate();
        expect(this.bv.isValidField('cc')).toBeTruthy();
    });

    it('JCB', function() {
        this.$creditCard.val('3566002020360505');
        this.bv.validate();
        expect(this.bv.isValidField('cc')).toBeTruthy();
    });

    it('Laser', function() {
        this.$creditCard.val('6304 9000 1774 0292 441');
        this.bv.validate();
        expect(this.bv.isValidField('cc')).toBeTruthy();
    });

    it('Maestro', function() {
        this.$creditCard.val('6762835098779303');
        this.bv.validate();
        expect(this.bv.isValidField('cc')).toBeTruthy();
    });

    it('Mastercard', function() {
        this.$creditCard.val('5303765013600904');
        this.bv.validate();
        expect(this.bv.isValidField('cc')).toBeTruthy();
    });

    it('Solo', function() {
        this.$creditCard.val('6334580500000000');
        this.bv.validate();
        expect(this.bv.isValidField('cc')).toBeTruthy();
    });

    it('Visa', function() {
        this.$creditCard.val('4929248980295542');
        this.bv.validate();
        expect(this.bv.isValidField('cc')).toBeTruthy();
    });

    it('Visa invalid check digit', function() {
        this.$creditCard.val('4532599916257826');
        this.bv.validate();
        expect(this.bv.isValidField('cc')).toEqual(false);
    });
});

describe('ean', function() {
    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="eanForm">',
                    '<div class="form-group">',
                        '<input type="text" name="ean" data-bv-ean />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#eanForm').bootstrapValidator();

        this.bv   = $('#eanForm').data('bootstrapValidator');
        this.$ean = this.bv.getFieldElements('ean');
    });

    afterEach(function() {
        $('#eanForm').bootstrapValidator('destroy').parent().remove();
    });

    it('valid', function() {
        var samples = ['73513537', '9780471117094', '4006381333931'];

        for (var i in samples) {
            this.$ean.val(samples[i]);
            this.bv.validate();
            expect(this.bv.isValidField('ean')).toBeTruthy();
        }
    });

    it('contains only digits', function() {
        this.$ean.val('123abcDEF!@#');
        this.bv.validate();
        expect(this.bv.isValidField('ean')).toEqual(false);
    });

    it('invalid length', function() {
        this.$ean.val('1234567');
        this.bv.validate();
        expect(this.bv.isValidField('ean')).toEqual(false);
    });

    it('invalid check digit', function() {
        this.$ean.val('73513536');
        this.bv.validate();
        expect(this.bv.isValidField('ean')).toEqual(false);
    });
});

describe('iban', function() {
    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="ibanForm">',
                    '<div class="form-group">',
                        '<input type="text" name="iban" data-bv-iban />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#ibanForm').bootstrapValidator();

        this.bv    = $('#ibanForm').data('bootstrapValidator');
        this.$iban = this.bv.getFieldElements('iban');
    });

    afterEach(function() {
        $('#ibanForm').bootstrapValidator('destroy').parent().remove();
    });

    it('not supported country', function() {
        this.$iban.val('US123456789');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toEqual(false);
    });

    it('Albania', function() {
        this.$iban.val('AL47212110090000000235698741');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Algeria', function() {
        this.$iban.val('DZ4000400174401001050486');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Andorra', function() {
        this.$iban.val('AD1200012030200359100100');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Angola', function() {
        this.$iban.val('AO06000600000100037131174');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Austria', function() {
        this.$iban.val('AT611904300234573201');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Azerbaijan', function() {
        this.$iban.val('AZ21NABZ00000000137010001944');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Bahrain', function() {
        this.$iban.val('BH29BMAG1299123456BH00');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Belgium', function() {
        this.$iban.val('BE68539007547034');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Benin', function() {
        this.$iban.val('BJ11B00610100400271101192591');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Brazil', function() {
        this.$iban.val('BR9700360305000010009795493P1');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Bulgaria', function() {
        this.$iban.val('BG80BNBG96611020345678');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Burkina Faso', function() {
        this.$iban.val('BF1030134020015400945000643');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });
    it('Burundi', function() {
        this.$iban.val('BI43201011067444');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Cameroon', function() {
        this.$iban.val('CM2110003001000500000605306');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Cape Verde', function() {
        this.$iban.val('CV64000300004547069110176');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Costa Rica', function() {
        this.$iban.val('CR0515202001026284066');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Croatia', function() {
        this.$iban.val('HR1210010051863000160');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });
    it('Cyprus', function() {
        this.$iban.val('CY17002001280000001200527600');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Czech Republic', function() {
        this.$iban.val('CZ6508000000192000145399');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Denmark', function() {
        this.$iban.val('DK5000400440116243');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Dominican Republic', function() {
        this.$iban.val('DO28BAGR00000001212453611324');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Estonia', function() {
        this.$iban.val('EE382200221020145685');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });
    it('Faroe Islands', function() {
        this.$iban.val('FO1464600009692713');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Finland', function() {
        this.$iban.val('FI2112345600000785');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('France', function() {
        this.$iban.val('FR1420041010050500013M02606');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Guatemala', function() {
        this.$iban.val('GT82TRAJ01020000001210029690');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Georgia', function() {
        this.$iban.val('GE29NB0000000101904917');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Germany', function() {
        this.$iban.val('DE89370400440532013000');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Gibraltar', function() {
        this.$iban.val('GI75NWBK000000007099453');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Greece', function() {
        this.$iban.val('GR1601101250000000012300695');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Greenland', function() {
        this.$iban.val('GL8964710001000206');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Hungary', function() {
        this.$iban.val('HU42117730161111101800000000');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Iceland', function() {
        this.$iban.val('IS140159260076545510730339');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Iran', function() {
        this.$iban.val('IR580540105180021273113007');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Ireland', function() {
        this.$iban.val('IE29AIBK93115212345678');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Israel', function() {
        this.$iban.val('IL620108000000099999999');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Italy', function() {
        this.$iban.val('IT60X0542811101000000123456');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Ivory Coast', function() {
        this.$iban.val('CI05A00060174100178530011852');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Jordan', function() {
        this.$iban.val('JO94CBJO0010000000000131000302');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Kazakhstan', function() {
        this.$iban.val('KZ176010251000042993');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Kuwait', function() {
        this.$iban.val('KW74NBOK0000000000001000372151');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Latvia', function() {
        this.$iban.val('LV80BANK0000435195001');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Lebanon', function() {
        this.$iban.val('LB30099900000001001925579115');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Liechtenstein', function() {
        this.$iban.val('LI21088100002324013AA');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Lithuania', function() {
        this.$iban.val('LT121000011101001000');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Luxembourg', function() {
        this.$iban.val('LU280019400644750000');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Macedonia', function() {
        this.$iban.val('MK07300000000042425');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Madagascar', function() {
        this.$iban.val('MG4600005030010101914016056');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Malta', function() {
        this.$iban.val('MT84MALT011000012345MTLCAST001S');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Mauritania', function() {
        this.$iban.val('MR1300012000010000002037372');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Mauritius', function() {
        this.$iban.val('MU17BOMM0101101030300200000MUR');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Mali', function() {
        this.$iban.val('ML03D00890170001002120000447');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Moldova', function() {
        this.$iban.val('MD24AG000225100013104168');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Monaco', function() {
        this.$iban.val('MC5813488000010051108001292');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Montenegro', function() {
        this.$iban.val('ME25505000012345678951');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Mozambique', function() {
        this.$iban.val('MZ59000100000011834194157');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Netherlands', function() {
        this.$iban.val('NL91ABNA0417164300');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Norway', function() {
        this.$iban.val('NO9386011117947');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Pakistan', function() {
        this.$iban.val('PK24SCBL0000001171495101');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Palestine', function() {
        this.$iban.val('PS92PALS000000000400123456702');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Poland', function() {
        this.$iban.val('PL27114020040000300201355387');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Portugal', function() {
        this.$iban.val('PT50000201231234567890154');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Qatar', function() {
        this.$iban.val('QA58DOHB00001234567890ABCDEFG');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Romania', function() {
        this.$iban.val('RO49AAAA1B31007593840000');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('San Marino', function() {
        this.$iban.val('SM86U0322509800000000270100');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Saudi Arabia', function() {
        this.$iban.val('SA0380000000608010167519');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Senegal', function() {
        this.$iban.val('SN12K00100152000025690007542');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Serbia', function() {
        this.$iban.val('RS35260005601001611379');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Slovakia', function() {
        this.$iban.val('SK3112000000198742637541');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Slovenia', function() {
        this.$iban.val('SI56191000000123438');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Spain', function() {
        this.$iban.val('ES9121000418450200051332');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Sweden', function() {
        this.$iban.val('SE3550000000054910000003');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Switzerland', function() {
        this.$iban.val('CH9300762011623852957');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Tunisia', function() {
        this.$iban.val('TN5914207207100707129648');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Turkey', function() {
        this.$iban.val('TR330006100519786457841326');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('United Arab Emirates', function() {
        this.$iban.val('AE260211000000230064016');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('United Kingdom', function() {
        this.$iban.val('GB29NWBK60161331926819');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('Virgin Islands, British', function() {
        this.$iban.val('VG96VPVG0000012345678901');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toBeTruthy();
    });

    it('invalid checksum', function() {
        this.$iban.val('TR330006100519786457841325');
        this.bv.validate();
        expect(this.bv.isValidField('iban')).toEqual(false);
    });
});

describe('id', function() {
    beforeEach(function () {
        var html = [
            '<form class="form-horizontal" id="idForm">',
                '<div class="form-group">',
                    '<input type="text" name="id" data-bv-id />',
                '</div>',
            '</form>',
        ].join('\n');

        $(html).appendTo('body');
        $('#idForm').bootstrapValidator();

        /**
         * @type {BootstrapValidator}
         */
        this.bv  = $('#idForm').data('bootstrapValidator');
        this.$id = this.bv.getFieldElements('id');
    });

    afterEach(function () {
        $('#idForm').bootstrapValidator('destroy').remove();
    });

    it('Bulgarian national identification number (EGN)', function() {
        this.bv.updateOption('id', 'id', 'country', 'BG');

        // Valid samples
        var validSamples = ['7523169263', '8032056031', '803205 603 1', '8001010008', '7501020018', '7552010005', '7542011030'];
        for (var i in validSamples) {
            this.bv.resetForm();
            this.$id.val(validSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['8019010008'];
        for (i in invalidSamples) {
            this.bv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toEqual(false);
        }
    });

    it('Brazilian national identification number (CPF)', function() {
        this.bv.updateOption('id', 'id', 'country', 'BR');

        // Valid samples
        var validSamples = ['39053344705', '390.533.447-05', '111.444.777-35'];
        for (var i in validSamples) {
            this.bv.resetForm();
            this.$id.val(validSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['231.002.999-00'];
        for (i in invalidSamples) {
            this.bv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toEqual(false);
        }
    });

    it('Swiss Social Security Number (AHV-Nr/No AVS)', function() {
        this.bv.updateOption('id', 'id', 'country', 'CH');

        // Valid samples
        var validSamples = ['756.1234.5678.95', '7561234567895'];
        for (var i in validSamples) {
            this.bv.resetForm();
            this.$id.val(validSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toBeTruthy();
        }
    });

    it('Chilean national identification number (RUN/RUT)', function() {
        this.bv.updateOption('id', 'id', 'country', 'CL');

        // Valid samples
        var validSamples = ['76086428-5', '22060449-7', '12531909-2'];
        for (var i in validSamples) {
            this.bv.resetForm();
            this.$id.val(validSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toBeTruthy();
        }
    });

    it('Czech national identification number (RC)', function() {
        this.bv.updateOption('id', 'id', 'country', 'CZ');

        // Valid samples
        var validSamples = ['7103192745', '991231123'];
        for (var i in validSamples) {
            this.bv.resetForm();
            this.$id.val(validSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['1103492745', '590312123'];
        for (i in invalidSamples) {
            this.bv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toEqual(false);
        }
    });

    it('Danish Personal Identification number (CPR)', function() {
        this.bv.updateOption('id', 'id', 'country', 'DK');

        // Valid samples
        var validSamples = ['2110625629', '211062-5629'];
        for (var i in validSamples) {
            this.bv.resetForm();
            this.$id.val(validSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['511062-5629'];
        for (i in invalidSamples) {
            this.bv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toEqual(false);
        }
    });

    it('Estonian Personal Identification Code (isikukood)', function() {
        this.bv.updateOption('id', 'id', 'country', 'EE');

        // Valid samples
        var validSamples = ['37605030299'];
        for (var i in validSamples) {
            this.bv.resetForm();
            this.$id.val(validSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toBeTruthy();
        }
    });

    it('Spanish personal identity code (DNI/NIE)', function() {
        this.bv.updateOption('id', 'id', 'country', 'ES');

        // Valid samples
        var validSamples = ['54362315K', '54362315-K', 'X2482300W', 'X-2482300W', 'X-2482300-W'];
        for (var i in validSamples) {
            this.bv.resetForm();
            this.$id.val(validSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['54362315Z', 'X-2482300A'];
        for (i in invalidSamples) {
            this.bv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toEqual(false);
        }
    });

    it('Finnish Personal Identity Code (HETU)', function() {
        this.bv.updateOption('id', 'id', 'country', 'FI');

        // Valid samples
        var validSamples = ['311280-888Y', '131052-308T'];
        for (var i in validSamples) {
            this.bv.resetForm();
            this.$id.val(validSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['131052-308U', '310252-308Y'];
        for (i in invalidSamples) {
            this.bv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toEqual(false);
        }
    });

    it('Croatian personal identification number (OIB)', function() {
        this.bv.updateOption('id', 'id', 'country', 'HR');

        // Valid samples
        var validSamples = ['33392005961'];
        for (var i in validSamples) {
            this.bv.resetForm();
            this.$id.val(validSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['33392005962'];
        for (i in invalidSamples) {
            this.bv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toEqual(false);
        }
    });

    it('Irish Personal Public Service Number (PPS)', function() {
        this.bv.updateOption('id', 'id', 'country', 'IE');

        // Valid samples
        var validSamples = ['6433435F', '6433435FT', '6433435FW', '6433435OA', '6433435IH', '1234567TW', '1234567FA'];
        for (var i in validSamples) {
            this.bv.resetForm();
            this.$id.val(validSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['6433435E', '6433435VH'];
        for (i in invalidSamples) {
            this.bv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toEqual(false);
        }
    });

    it('Iceland national identification number (Kennitala)', function() {
        this.bv.updateOption('id', 'id', 'country', 'IS');

        // Valid samples
        var validSamples = ['120174-3399', '1201743399', '0902862349'];
        for (var i in validSamples) {
            this.bv.resetForm();
            this.$id.val(validSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toBeTruthy();
        }
    });

    it('Lithuanian Personal Code (Asmens kodas)', function() {
        this.bv.updateOption('id', 'id', 'country', 'LT');

        // Valid samples
        var validSamples = ['38703181745'];
        for (var i in validSamples) {
            this.bv.resetForm();
            this.$id.val(validSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['38703181746', '78703181745', '38703421745'];
        for (i in invalidSamples) {
            this.bv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toEqual(false);
        }
    });

    it('Latvian Personal Code (Personas kods)', function() {
        this.bv.updateOption('id', 'id', 'country', 'LV');

        // Valid samples
        var validSamples = ['161175-19997', '16117519997'];
        for (var i in validSamples) {
            this.bv.resetForm();
            this.$id.val(validSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['161375-19997'];
        for (i in invalidSamples) {
            this.bv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toEqual(false);
        }
    });

    it('Dutch national identification number (BSN)', function() {
        this.bv.updateOption('id', 'id', 'country', 'NL');

        // Valid samples
        var validSamples = ['111222333', '941331490', '9413.31.490'];
        for (var i in validSamples) {
            this.bv.resetForm();
            this.$id.val(validSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['111252333'];
        for (i in invalidSamples) {
            this.bv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toEqual(false);
        }
    });

    it('Romanian numerical personal code (CNP)', function() {
        this.bv.updateOption('id', 'id', 'country', 'RO');

        // Valid samples
        var validSamples = ['1630615123457', '1800101221144'];
        for (var i in validSamples) {
            this.bv.resetForm();
            this.$id.val(validSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['8800101221144', '1632215123457', '1630615123458'];
        for (i in invalidSamples) {
            this.bv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toEqual(false);
        }
    });

    it('Swedish personal identity number (personnummer)', function() {
        this.bv.updateOption('id', 'id', 'country', 'SE');

        // Valid samples
        var validSamples = ['8112289874', '811228-9874', '811228+9874'];
        for (var i in validSamples) {
            this.bv.resetForm();
            this.$id.val(validSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['811228-9873'];
        for (i in invalidSamples) {
            this.bv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toEqual(false);
        }
    });

    it('Slovak national identifier number (RC)', function() {
        this.bv.updateOption('id', 'id', 'country', 'SK');

        // Valid samples
        var validSamples = ['7103192745', '991231123'];
        for (var i in validSamples) {
            this.bv.resetForm();
            this.$id.val(validSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['7103192746', '1103492745'];
        for (i in invalidSamples) {
            this.bv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toEqual(false);
        }
    });

    it('South African ID', function() {
        this.bv.updateOption('id', 'id', 'country', 'ZA');

        // Valid samples
        var validSamples = ['8001015009087'];
        for (var i in validSamples) {
            this.bv.resetForm();
            this.$id.val(validSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['8001015009287', '8001015009086'];
        for (i in invalidSamples) {
            this.bv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.bv.validate();
            expect(this.bv.isValid()).toEqual(false);
        }
    });
});

describe('isbn', function() {
    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="isbnForm">',
                    '<div class="form-group">',
                        '<input type="text" name="isbn" data-bv-isbn />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#isbnForm').bootstrapValidator();

        this.bv    = $('#isbnForm').data('bootstrapValidator');
        this.$isbn = this.bv.getFieldElements('isbn');
    });

    afterEach(function() {
        $('#isbnForm').bootstrapValidator('destroy').parent().remove();
    });

    it('isbn10 hyphen', function() {
        var samples = ['99921-58-10-7', '9971-5-0210-0', '960-425-059-0', '80-902734-1-6'];

        for (var i in samples) {
            this.$isbn.val(samples[i]);
            this.bv.validate();
            expect(this.bv.isValidField('isbn')).toBeTruthy();
        }
    });

    it('isbn10 space', function() {
        var samples = ['85 359 0277 5', '1 84356 028 3', '0 684 84328 5', '0 85131 041 9', '0 943396 04 2'];

        for (var i in samples) {
            this.$isbn.val(samples[i]);
            this.bv.validate();
            expect(this.bv.isValidField('isbn')).toBeTruthy();
        }
    });

    it('isbn10 hyphen with X', function() {
        var samples = ['0-8044-2957-X', '0-9752298-0-X'];
        for (var i in samples) {
            this.$isbn.val(samples[i]);
            this.bv.validate();
            expect(this.bv.isValidField('isbn')).toBeTruthy();
        }
    });

    it('isbn10 invalid check digit', function() {
        this.$isbn.val('99921-58-10-6');
        this.bv.validate();
        expect(this.bv.isValidField('isbn')).toEqual(false);
    });

    it('isbn13', function() {
        this.$isbn.val('978-0-306-40615-7');
        this.bv.validate();
        expect(this.bv.isValidField('isbn')).toBeTruthy();
    });

    it('isbn13 invalid check digit', function() {
        this.$isbn.val('978-0-306-40615-6');
        this.bv.validate();
        expect(this.bv.isValidField('isbn')).toEqual(false);
    });
});

describe('isin', function() {
    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="isinForm">',
                    '<div class="form-group">',
                        '<input type="text" name="isin" data-bv-isin />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#isinForm').bootstrapValidator();

        this.bv    = $('#isinForm').data('bootstrapValidator');
        this.$isin = this.bv.getFieldElements('isin');
    });

    afterEach(function() {
        $('#isinForm').bootstrapValidator('destroy').parent().remove();
    });

    it('valid', function() {
        var samples = ['US0378331005', 'AU0000XVGZA3', 'GB0002634946'];

        for (var i in samples) {
            this.$isin.val(samples[i]);
            this.bv.validate();
            expect(this.bv.isValidField('isin')).toBeTruthy();
        }
    });

    it('invalid country code', function() {
        this.$isin.val('AA0000XVGZA3');
        this.bv.validate();
        expect(this.bv.isValidField('isin')).toEqual(false);
    });

    it('contains only digits and alphabet', function() {
        this.$isin.val('US12345ABC@#$');
        this.bv.validate();
        expect(this.bv.isValidField('isin')).toEqual(false);
    });

    it('invalid length', function() {
        this.$isin.val('US1234567');
        this.bv.validate();
        expect(this.bv.isValidField('isin')).toEqual(false);
    });

    it('invalid check digit', function() {
        this.$isin.val('US0378331004');
        this.bv.validate();
        expect(this.bv.isValidField('isin')).toEqual(false);
    });
});

describe('ismn', function() {
    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="ismnForm">',
                    '<div class="form-group">',
                        '<input type="text" name="ismn" data-bv-ismn />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#ismnForm').bootstrapValidator();

        this.bv    = $('#ismnForm').data('bootstrapValidator');
        this.$ismn = this.bv.getFieldElements('ismn');
    });

    afterEach(function() {
        $('#ismnForm').bootstrapValidator('destroy').parent().remove();
    });

    it('valid start with M', function() {
        this.$ismn.val('M230671187');
        this.bv.validate();
        expect(this.bv.isValidField('ismn')).toBeTruthy();
    });

    it('valid start with 979', function() {
        this.$ismn.val('9790060115615');
        this.bv.validate();
        expect(this.bv.isValidField('ismn')).toBeTruthy();
    });

    it('valid contains spaces', function() {
        this.$ismn.val('979 0 3452 4680 5');
        this.bv.validate();
        expect(this.bv.isValidField('ismn')).toBeTruthy();
    });

    it('valid contains dashes', function() {
        this.$ismn.val('979-0-0601-1561-5');
        this.bv.validate();
        expect(this.bv.isValidField('ismn')).toBeTruthy();
    });

    it('invalid format', function() {
        this.$ismn.val('N123456789');
        this.bv.validate();
        expect(this.bv.isValidField('ismn')).toEqual(false);
    });

    it('invalid check digit', function() {
        this.$ismn.val('9790060115614');
        this.bv.validate();
        expect(this.bv.isValidField('ismn')).toEqual(false);
    });
});

describe('issn', function() {
    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="issnForm">',
                    '<div class="form-group">',
                        '<input type="text" name="issn" data-bv-issn />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#issnForm').bootstrapValidator();

        this.bv    = $('#issnForm').data('bootstrapValidator');
        this.$issn = this.bv.getFieldElements('issn');
    });

    afterEach(function() {
        $('#issnForm').bootstrapValidator('destroy').parent().remove();
    });

    it('valid', function() {
        var samples = ['0378-5955', '0024-9319', '0032-1478'];

        for (var i in samples) {
            this.$issn.val(samples[i]);
            this.bv.validate();
            expect(this.bv.isValidField('issn')).toBeTruthy();
        }
    });

    it('not contains hyphen', function() {
        this.$issn.val('03785955');
        this.bv.validate();
        expect(this.bv.isValidField('issn')).toEqual(false);
    });

    it('contains only digits, X', function() {
        this.$issn.val('1234-566A');
        this.bv.validate();
        expect(this.bv.isValidField('issn')).toEqual(false);
    });

    it('invalid check sum', function() {
        this.$issn.val('0032-147X');
        this.bv.validate();
        expect(this.bv.isValidField('issn')).toEqual(false);
    });
});
