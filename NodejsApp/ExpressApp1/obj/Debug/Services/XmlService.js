function XmlParse(xml) {
    var tables = xml.root.name;
    var data = xml.root.data;

    var model = [];

    tables.forEach(function(v, k) {
        var table = {};
        table.name = v;
        table.rows = [];
        data[k].row.forEach(function(val, key) {
            var row = {};
            for (var p in val) {
                row.type = val[p][0].$.type;
                row.name = p;
                row.value = val[p][0]._;
            }
            table.rows.push(row);
        });
        model.push(table);
    });

    return model;
}

exports.XmlParse = XmlParse;