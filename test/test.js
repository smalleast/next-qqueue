var qqueue = require('../src/next-qqueue');
var Q = require('q');
var nx = require('next-js-core2');

var promiseFn = function(inData){
  var defferd = Q.defer();
  setTimeout(function(){
    defferd.resolve(
      nx.mix({name:'fei test 1000s'},inData)
    );
    // console.log(1233);
  },Math.random()*3*1000)
  return defferd.promise;
};

// Q.all([
//   promiseFn({ test1:'value1'}),
//   promiseFn({ test2:'value2',items:[{name:1234}]}),
//   promiseFn({ test3:'value3'}),
//   promiseFn({ test4:'value4'}),
//   promiseFn({ test5:'value5'}),
// ]);

/**
//result:
{ test1: 'value1' }
{ test3: 'value3' }
{ test5: 'value5' }
{ test4: 'value4' }
{ test2: 'value2', items: [ { name: 1234 } ] }
 */


qqueue.queue([
  { test1:'value1'},
  { test2:'value2'},
  { test3:'value3'},
  { test4:'value4'},
  { test5:'value5'},
],promiseFn).then(function(response){
  console.log(response)
});

/**
//result:
{ test1: 'value1' }
{ test2: 'value2' }
{ test3: 'value3' }
{ test4: 'value4' }
{ test5: 'value5' }
 */



