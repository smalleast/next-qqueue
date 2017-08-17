(function (global) {

  var nx = global.nx || require('next-js-core2');
  var Q = global.Q || require('q');
  var newPromise = function(inData,inPromiseCallback){
    return function () {
      var deferred = Q.defer();
      inPromiseCallback(inData).then(
        function(response){
          deferred.resolve(response);
        },
        function(error){
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };
  };

  var Qqueue = nx.declare('nx.Qqueue', {
    statics:{
      queue:function(inArray,inPromiseCallback){
        var promiseStack = [];
        var result = [];
        var deferred = Q.defer();
        var fire = function () {
          // If the queue has remaining items...
          return promiseStack.length &&

          // Remove the first promise from the array
          // and execute it
          promiseStack.shift()()

          // When that promise resolves, fire the next
          // promise in our queue
          .then(function (response) {
            result.push(response);
            if(promiseStack.length === 0){
              deferred.resolve(result);
              return deferred.promise;
            }else{
              return fire();
            }
          },function(error){
            deferred.reject(error);
            return deferred.promise;
          });
        };

        inArray.forEach(function(data){
          promiseStack.push(
            newPromise(data,inPromiseCallback)
          );
        });
        return fire();
      }
    }
  });


  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Qqueue;
  }

}(this));
