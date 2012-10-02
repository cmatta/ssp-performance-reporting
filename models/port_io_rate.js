var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var PortIOSchema = new Schema({
    "array_serial": {type: String, required: true, index: 1 },
    "port_name": {type: String, required: true, index: 1 },
    "port_number": {type: String, required: true, index: 1 },
    "metric": {type: Number, required: true, index: 1},
    "datetime": {type: Date, required: true, index: 1}
    },
    {collection: 'port_io_rate_1m'}
);

var PortIO = mongoose.model('PortIO', PortIOSchema);
var PortIOModel = function(){};

PortIOModel.prototype.getArrays = function (callback) {
    PortIO.find().distinct('array_serial', function(err, arrays){
        callback(null, arrays);
    })
}

PortIOModel.prototype.getPorts = function(arraySerial, callback) {
    PortIO.find({'array_serial' : arraySerial}).distinct('port_name', function (err, ports) {
        callback(null, ports);
    })
}

PortIOModel.prototype.getDates = function(arraySerial, ports, callback) {
    PortIO.find({'array_serial' : arraySerial, 'port_name' : {$in : ports }})
          .distinct('datetime', function (err, ports) {
        callback(null, ports);
    })
}
// Inputs 
// arraySerial - string
// ports - array
// fromDate/toDate - Date 
// resolution - in minutes
PortIOModel.prototype.getReport = function(arraySerial, ports, fromDate, toDate, callback) {
    var query = PortIO.find({'array_serial': arraySerial })
                                .where('port_name').in(ports)
                                .where('datetime').gte(fromDate).lte(toDate);

    console.log(query._conditions);
    query.exec(function(err, reports){
            callback(null, reports);
    })
};


module.exports.PortIOModel = PortIOModel;
