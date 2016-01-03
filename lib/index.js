var isNode = typeof module !== 'undefined' && this.module !== module;
var atob = isNode ? require('atob') : window.atob;

/**
 * Decodes a url safe Base64 string to its original representation.
 * @param  {string} string
 * @return {string}
 */
function urlB64Decode(string) {
  return atob(string.replace(/\-/g, '+').replace(/\_/g, '\\'));
}

/**
 * Takes the header array filled with objects and transforms it into a more
 * pleasant key-value object.
 * @param  {array} headers
 * @return {object}
 */
function indexHeaders(headers) {
  var indexedHeaders = {};
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
  var result = {};
  result.id = response.id;
  result.threadId = response.threadId;
  result.labelIds = response.labelIds;
  result.snippet = response.snippet;
  result.historyId = response.historyId;
  result.internalDate = response.internalDate;
  result.attachments = [];

  var payload = response.payload;
  var headers = indexHeaders(payload.headers);
  result.subject = headers.subject;
  result.from = headers.from;
  result.to = headers.to;
  result.cc = headers.cc;
  result.bcc = headers.bcc;
  result.messageId = headers['message-id'];

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

    var contentType = headers['content-type'];
    var contentDisposition = headers['content-disposition'];
    if (contentType.indexOf('text/html') !== -1) {
      result.textHtml = urlB64Decode(part.body.data);
    } else if (contentType.indexOf('text/plain') !== -1) {
      result.textPlain = urlB64Decode(part.body.data);
    } else if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
      var body = part.body;
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
