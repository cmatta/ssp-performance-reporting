var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var PortTransferRateSchema = new Schema({
    "array_serial": {type: String, required: true },
    "adaptor_id": {type: String, required: true},
    "processor_id": {type: String, required: true},
    "processor_type": {type: String, required: true},
    "metric": {type: Number, required: true},
    "datetime": {type: Date, required: true}
    },   
    { collection: 'port_transfer_rate_1m'}
);

var PortTransfer = mongoose.model('PortTransfer', PortTransferRateSchema);
var PortTransferModel = function(){};

PortTransferModel.prototype.getArrays = function (callback) {
    PortTransfer.find().distinct('array_serial', function(err, arrays){
        callback(null, arrays);
    })
}

PortTransferModel.prototype.getPorts = function(arraySerial, callback) {
    PortTransfer.find({'array_serial' : arraySerial}).distinct('port_name', function (err, ports) {
        callback(null, ports);
    })
}

PortTransferModel.prototype.getDates = function(arraySerial, ports, callback) {
    PortTransfer.find({'array_serial' : arraySerial, 'port_name' : {$in : ports }})
          .distinct('datetime', function (err, ports) {
        callback(null, ports);
    })
}
// Inputs 
// arraySerial - string
// ports - array
// fromDate/toDate - Date 
// resolution - in minutes
PortTransferModel.prototype.getReport = function(arraySerial, ports, fromDate, toDate, callback) {
    var query = PortTransfer.find({'array_serial': arraySerial })
                                .where('port_name').in(ports)
                                .where('datetime').gte(fromDate).lte(toDate);

    console.log(query._conditions);
    query.exec(function(err, reports){
            callback(null, reports);
    })
};
module.exports.PortTransfer = PortTransferModel;