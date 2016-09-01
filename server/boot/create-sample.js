module.exports = function (app) {
    // Seed database

    var ds = app.dataSources.mysqlDS;

    ds.autoupdate(function () {
    
    });
}