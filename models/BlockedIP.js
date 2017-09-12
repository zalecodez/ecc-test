var keystone = require('keystone');
var striptags = require('striptags');
var Types = keystone.Field.Types;

var BlockedIP = new keystone.List('BlockedIP', {
    label: 'Blocked IPs',
});

BlockedIP.add({
    address: {type: String, required: true, initial: true, required:true}, 
    comment: {type: Types.Relationship, ref:'Comment' },
    loggedAt: {type: Date, default: Date.now, noedit: true, index: {expireAfterSeconds: 60}},
});

BlockedIP.register();
