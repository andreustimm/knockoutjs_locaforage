//CONFIG INITIAL
localforage.setDriver([
    localforage.INDEXEDDB,
    localforage.WEBSQL,
    localforage.LOCALSTORAGE
]);

var key = 'pessoa';
var value = [
    {
        'id': 1,
        'name': 'Andreus'
    },
    {
        'id': 2,
        'name': 'Mariana'
    },
    {
        'id': 3,
        'name': 'Bernardo'
    },
];

//setValue
localforage.setItem(key, value);

//getValue
localforage.getItem(key).then(function(pessoa) {
    console.log('Read: ', pessoa[0].nome);
});
