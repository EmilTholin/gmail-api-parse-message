var should = require('chai').should();
var parseMessage = require('../lib');
var plainTextMessage = require('./messages/plainTextMessage');
var multipartAlternativeMessage = require('./messages/multipartAlternativeMessage');
var multipartAlternativeWithAttachmentsMessage = require('./messages/multipartAlternativeWithAttachmentsMessage');

describe('#parse', function() {
  it('can parse a plain text message', function() {
    parseMessage(plainTextMessage).textPlain.should.equal('The actual message text goes here');
  });

  it('can parse a multipart alternative message', function () {
    var parsedMessage = parseMessage(multipartAlternativeMessage);
    parsedMessage.textHtml.should.equal('<div dir="ltr">wow</div>\r\n');
    parsedMessage.textPlain.should.equal('wow\r\n');
  });

  it('can parse a multipart alternative message with attachments', function () {
    var parsedMessage = parseMessage(multipartAlternativeWithAttachmentsMessage);
    parsedMessage.textHtml.should.equal('<div dir="ltr">cool <b>stuff</b></div>\r\n');
    parsedMessage.textPlain.should.equal('cool *stuff*\r\n');
    parsedMessage.attachments.should.have.deep.property('[0].filename', 'a3Ln90e_460s.jpg');
    parsedMessage.attachments.should.have.deep.property('[1].filename', 'feelthebern.jpg');
  });
});
