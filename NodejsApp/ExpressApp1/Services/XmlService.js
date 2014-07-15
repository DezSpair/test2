function XmlParse(xml) {
    var tables = xml.root.name;
    var data = xml.root.data;

    var model = [];

    tables.forEach(function(v, k) {
        var table = {};
        table.name = v;
        table.records = [];
        data[k].row.forEach(function(val, key) {
            var rows = [];
            for (var p in val) {
                var row = {};
                row.type = val[p][0].$.type;
                row.name = p;
                row.value = val[p][0]._;
                rows.push(row);
            }
            table.records.push(rows);

        });
        model.push(table);
    });

    return model;
}

exports.XmlParse = XmlParse;