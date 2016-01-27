'use strict';

var b64Decode = require('base-64').decode;
var pick = require('lodash.pick');
var assign = require('lodash.assign');

/**
 * Decodes a url safe Base64 string to its original representation.
 * @param  {string} string
 * @return {string}
 */
function urlB64Decode(string) {
  return decodeURIComponent(escape(b64Decode(string.replace(/\-/g, '+').replace(/\_/g, '/'))));
}

/**
 * Takes the header array filled with objects and transforms it into a more
 * pleasant key-value object.
 * @param  {array} headers
 * @return {object}
 */
function indexHeaders(headers) {
  var indexedHeaders = {};
  if(!headers) {
    return indexedHeaders;
  }
  headers.forEach(function(header) {
    indexedHeaders[header.name.toLowerCase()] = header.value;
  });
  return indexedHeaders;
}

/**
 * Takes a response from the Gmail API's GET message method and extracts all
 * the relevant data.
 * @param  {object} response
 * @return {object}
 */
module.exports = function parseMessage(response) {
  var result = pick(response, 'id', 'threadId', 'labelIds', 'snippet', 'historyId');
  if (response.internalDate) {
    result.internalDate = parseInt(response.internalDate);
  }

  var payload = response.payload;
  if(!payload) {
    return result;
  }

  var headers = indexHeaders(payload.headers);
  assign(result, pick(headers, 'subject', 'from',  'to',  'cc',  'bcc'));
  if(headers['message-id']) {
    result.messageId = headers['message-id'];
  }

  var parts = [payload];
  var firstPartProcessed = false;

  while (parts.length !== 0) {
    var part = parts.shift();
    if (part.parts) {
      parts = parts.concat(part.parts);
    }
    if (firstPartProcessed) {
      headers = indexHeaders(part.headers);
    }

    var contentType = part.mimeType || '';
    var contentDisposition = headers['content-disposition'] || '';

    if (contentType.indexOf('text/html') !== -1) {
      result.textHtml = urlB64Decode(part.body.data);
    } else if (contentType.indexOf('text/plain') !== -1) {
      result.textPlain = urlB64Decode(part.body.data);
    } else if (contentDisposition.indexOf('attachment') !== -1) {
      var body = part.body;
      if(!result.attachments) {
        result.attachments = [];
      }
      result.attachments.push({
        filename: part.filename,
        mimeType: part.mimeType,
        size: body.size,
        attachmentId: body.attachmentId
      });
    }

    firstPartProcessed = true;
  }

  return result;
};
