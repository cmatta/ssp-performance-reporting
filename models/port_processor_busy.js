var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var PortCpuSchema = new Schema({
    "array_serial": {type: String, required: true },
    "adaptor_id": {type: String, required: true},
    "processor_id": {type: String, required: true},
    "processor_type": {type: String, required: true},
    "metric": {type: Number, required: true},
    "datetime": {type: Date, required: true}
    },   
    { collection: 'processor_busy_rate_1m'}
);

var PortCpu = mongoose.model('PortCpu', PortCpuSchema);
var PortCpuModel = function(){};

PortCpuModel.prototype.getArrays = function (callback) {
    PortCpu.find().distinct('array_serial', function(err, arrays){
        callback(null, arrays);
    })
}

PortCpuModel.prototype.getPorts = function(arraySerial, callback) {
    var array = require('./storage-array');
    console.log(array);
    array.getArrayModel(arraySerial, function(err, model){
        console.log(model);
        PortCpu.find({'array_serial' : arraySerial}).distinct('adaptor_id', function (err, adaptors) {
            
            callback(null, adaptors);
        })
    });
}

PortCpuModel.prototype.getDates = function(arraySerial, ports, callback) {
    PortCpu.find({'array_serial' : arraySerial, 'port_name' : {$in : ports }})
          .distinct('datetime', function (err, ports) {
        callback(null, ports);
    })
}
// Inputs 
// arraySerial - string
// ports - array
// fromDate/toDate - Date 
// resolution - in minutes
PortCpuModel.prototype.getReport = function(arraySerial, ports, fromDate, toDate, callback) {
    var query = PortCpu.find({'array_serial': arraySerial })
                                .where('port_name').in(ports)
                                .where('datetime').gte(fromDate).lte(toDate);

    console.log(query._conditions);
    query.exec(function(err, reports){
            callback(null, reports);
    })
};


module.exports.PortCpu = PortCpuModel;