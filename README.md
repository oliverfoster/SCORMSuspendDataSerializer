SCORMSuspendDataSerializer
============================
Boolean+Number Arrays to Base64 serializer/deserializer library.


[Example Calculator](https://rawgit.com/oliverfoster/SCORMSuspendDataSerializer/master/example/index.html)

Usage:

```javascript
//make simple nested number/boolean arrays storing question component user selections + states
var originalArray = Array[Array[number],Array[boolean],...];

//serialize originalArray
var base64EncodedString = SCORMSuspendData.serialize( originalArray );

//store base64EncodedString in LMS
//fetch base64EncodedString from LMS

//deserialize base64EncodedString
var restoredArray = SCORMSuspendData.deserialize( base64EncodedString );

//use array to restore question component user selections + states

```
