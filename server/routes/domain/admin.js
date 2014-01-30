/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 07/01/14, at 14:35.
 */
(function () {
    var collectionName = 'admins';

    exports.login = function (username, password, callback) {
        console.log('Trying to login with: ' + username + '/' + password);

        db.collection(collectionName, function (err, collection) {
            collection.findOne({'username': username}, function (err, item) {
                var result;

                if (item) {
                    console.log('User found');
                    result = item.username === username && item.password === password;
                } else {
                    console.log('User not found');
                    result = false;
                }

                callback(err, result);
            });
        });
    };


    var findAll = function (callback) {
        db.collection(collectionName, function (err, collection) {
            collection.find().toArray(callback);
        });
    };

}());

