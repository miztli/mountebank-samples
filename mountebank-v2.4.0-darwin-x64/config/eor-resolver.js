function (requestData, logger) { 
	var messageLength = requestData.readInt32BE(0); 
	logger.info('Message length: ' + messageLength + ', so far: ' + requestData.length); 
	return requestData.length === messageLength; 
}