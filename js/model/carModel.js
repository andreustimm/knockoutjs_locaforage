//CONFIG INITIAL
var CarStore = localforage.createInstance({
    driver: [
        localforage.INDEXEDDB,
        localforage.WEBSQL,
        localforage.LOCALSTORAGE
    ],
    version: 1.0,
    name: 'miromi',
    storeName: 'cars'
});

function AppCarModel() {
    var self = this;

    self.myName = ko.observable('');
    self.cars = ko.observableArray();
    self.table = 'cars';

    self.load = function () {
        self.cars([]);

        CarStore.getItem(self.table).then(function (car) {
            if (car != null) {
                for (let i = 0; i < car.length; i++) {
                    self.cars.push(car[i]);
                }
            }
        }).catch(function (err) {
            console.log('Error in getItem: ' + err);
        });
    };

    self.updateCar = function () {
        CarStore.removeItem(self.table).then(function () {
            CarStore.setItem(self.table, self.cars()).then(function (value) {
                console.log('Updated: ' + value);
                self.load();
            }).catch(function (err) {
                console.log('Error in setItem: ' + err);
            });
        }).catch(function (err) {
            console.log('Error in removeItem: ' + err);
        });
    };

    self.addCar = function () {
        let name = self.myName();
        let id = self.cars().length + 1;

        self.cars.push({
            id: id,
            name: name
        });

        self.updateCar();
        self.myName('');
    };

    self.removeCar = function () {
        self.cars.remove(this);
        self.updateCar();
    };

    self.load();
}

var AppCar = new AppCarModel();

ko.applyBindings(AppCar);
