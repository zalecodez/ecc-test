var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
    name: { type: Types.Name, required: true, index: true },
    email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
    password: { type: Types.Password, initial: true, required: true },
    keystoneAccess: { type: Boolean, default: true, hidden: true, },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Admin', index: true },
        
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.keystoneAccess;
});


User.schema.methods.wasActive = function () {
    this.lastActiveOn = new Date();
    return this;
};


User.relationship({path: 'comments', ref:'Comment', refPath:'user'});
User.defaultColumns = 'name, email, isAdmin';
/**
 * Registration
 */
User.register();
