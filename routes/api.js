var PortIO = new (require('../models/port_io_rate').PortIOModel);
var PortTransfer = new (require('../models/port_transfer_rate').PortTransfer);
var PortCpu = new (require('../models/port_processor_busy').PortCpu);

var getModel = {'port_io_rate': PortIO,
                'port_transfer_rate': PortTransfer,
                'processor_busy_rate': PortCpu};

exports.getArrays = function(req, res) {
    var reportModel = getModel[req.params.report];
    // reportModel = getModel['req.params.report'];
    // console.log(reportModel);
    console.log(req.params.report);
    reportModel.getArrays(function(err, arrays){
        res.json(arrays)
    })

}

exports.getPorts = function(req, res) {
    var reportModel = getModel[req.params.report]
    , arraySerial = req.params.array;

    reportModel.getPorts(arraySerial, function(err, ports){
        res.json(ports);
    })
}

exports.getDates = function(req, res){
    var reportModel = getModel[req.params.report]
    , arraySerial = req.params.array
    , ports = req.params.ports.split(",");

    reportModel.getDates(arraySerial, ports, function(err, dates){
        res.json(dates);
    })
}

exports.getReport = function(req, res) {
    
    var reportModel = getModel[req.params.report];

    var arraySerial = req.params.array
    , fromDate = Date.parse(req.params.startdate)
    , toDate = Date.parse(req.params.enddate)
    , ports = req.params.ports.split(",");
    
    var dateRecords = toDate - fromDate;
    // if(dateRecords <= 1440) { // one day
    //     resolution = 1; //return minute data
    // } else if(dateRecords <= 1440 * 3) { // three days
    //     resolution = 5; // return five minute data
    // } else if(dateRecords <= 1440 * 7) { //one week
    //     resolution = 15; // return fifteen minute data
    // } else  { 
    //     resolution = 60; // return hourly data
    // }

    reportModel.getReport(arraySerial,
                          ports,
                          fromDate,
                          toDate, function(err, report){
        res.json(report)
    })
}

