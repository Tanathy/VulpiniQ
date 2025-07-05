Q.Method('wait', function(ms) {
	return new Promise(resolve => setTimeout(() => resolve(this), ms));
});
