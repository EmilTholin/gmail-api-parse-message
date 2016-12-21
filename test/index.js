var should = require('chai').should();
var parseMessage = require('../lib');
var plainTextMessage = require('./messages/plainTextMessage');
var multipartAlternativeMessage = require('./messages/multipartAlternativeMessage');
var multipartAlternativeWithAttachmentsMessage = require('./messages/multipartAlternativeWithAttachmentsMessage');
var multipartAlternativePlainTextAttachmentMessage = require('./messages/multipartAlternativePlainTextAttachmentMessage');
var multipartAlternativeDraft = require('./messages/multipartAlternativeDraft');

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

  it('can parse a multipart alternative message with plain text attachments', function () {
    var parsedMessage = parseMessage(multipartAlternativePlainTextAttachmentMessage);
    parsedMessage.textHtml.should.equal('<div dir="ltr">cool <b>stuff</b></div>\r\n');
    parsedMessage.textPlain.should.equal('cool *stuff*\r\n');
    parsedMessage.attachments.should.have.deep.property('[0].filename', 'a_text_file.txt');
  });

    it('can parse a multipart alternative draft', function () {
    var parsedDraft = parseMessage(multipartAlternativeDraft.message);
    parsedDraft.textHtml.should.equal('<div dir="ltr">Can it parse <b>draft </b>now? Sure can!</div>\r\n');
    parsedDraft.textPlain.should.equal('Can it parse *draft *now? Sure can!\r\n');
  });
});
