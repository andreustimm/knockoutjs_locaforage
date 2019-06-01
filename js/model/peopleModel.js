//CONFIG INITIAL
var PeopleStore = localforage.createInstance({
    driver: [
        localforage.INDEXEDDB,
        localforage.WEBSQL,
        localforage.LOCALSTORAGE
    ],
    version: 1.0,
    name: 'miromi',
    storeName: 'people'
});

function AppPeopleModel() {
    var self = this;

    self.myName = ko.observable('');
    self.people = ko.observableArray();
    self.table = 'people';

    self.load = function () {
        self.people([]);

        PeopleStore.getItem(self.table).then(function (person) {
            if (person != null) {
                for (let i = 0; i < person.length; i++) {
                    self.people.push(person[i]);
                }
            }
        }).catch(function (err) {
            console.log('Error in getItem: ' + err);
        });
    };

    self.updatePeople = function () {
        PeopleStore.removeItem(self.table).then(function () {
            PeopleStore.setItem(self.table, self.people()).then(function (value) {
                self.load();
            }).catch(function (err) {
                console.log('Error in setItem: ' + err);
            });
        }).catch(function (err) {
            console.log('Error in removeItem: ' + err);
        });
    };

    self.addPerson = function () {
        let name = self.myName();
        let id = self.people().length + 1;

        self.people.push({
            id: id,
            name: name
        });

        self.updatePeople();
        self.myName('');
    };

    self.removePerson = function () {
        self.people.remove(this);
        self.updatePeople();
    };

    self.load();
}

var AppPeople = new AppPeopleModel();

ko.applyBindings(AppPeople);

PeopleStore.ready(function() {
    PeopleStore.configObservables({
        crossTabNotification: true,
        crossTabChangeDetection: true
    });

    var observable = PeopleStore.newObservable({
        crossTabNotification: true,
        changeDetection: true
    });

    var observableLogs = [];

    var subscription = observable.subscribe({
        next: function (args) {
            observableLogs.push(`${args.methodName}('${args.key}')`);
            if (args.crossTabNotification) {
                AppPeople.load();
                console.log('!!Received from an other tab!!', args);
            } else {
                console.log('I observe everything', args);
            }
        },
        error: function (err) {
            console.log('Found an error!', err);
        },
        complete: function () {
            console.log('Observable destroyed!');
        }
    });
});
