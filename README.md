# gmail-api-parse-message
Parses the response from the Gmail API's GET message method.

## Example usage

```js
var rp = require('request-promise');
var parseMessage = require('gmail-api-parse-message');

rp({
  uri: 'https://www.googleapis.com/gmail/v1/users/me/messages/{MESSAGE_ID}?access_token={ACCESS_TOKEN}',
  json: true
}).then(function (response) {
  var parsedMessage = parseMessage(response);
  console.log(parsedMessage);
  // { 
  //   id: '{MESSAGE_ID}',
  //   threadId: '{THREAD_ID}',
  //   labelIds: [ 'SENT', 'INBOX', 'UNREAD' ],
  //   snippet: 'This is one cool message, buddy.',
  //   historyId: '701725',
  //   internalDate: 1451995756000,
  //   attachments: [{ 
  //     filename: 'example.jpg',
  //     mimeType: 'image/jpeg',
  //     size: 100446,
  //     attachmentId: '{ATTACHMENT_ID}' 
  //   }],
  //   headers: {
  //     subject: 'Example subject',
  //     from: 'Example Name <example@gmail.com>',
  //     to: '<foo@gmail.com>, Foo Bar <fooBar@gmail.com>',
  //     ...
  //   },
  //   textPlain: 'This is one cool *message*, buddy.\r\n',
  //   textHtml: '<div dir="ltr">This is one cool <b>message</b>, buddy.</div>\r\n' 
  // }
});

```

## API


```js
/**
 * Takes a response from the Gmail API's GET message method and extracts all the relevant data.
 * @param  {object} response - The response from the Gmail API parsed to a JavaScript object.
 * @return {object} result
 */
 parseMessage(response);
```

## Licence
MIT
