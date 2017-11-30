 var data;

 /** Function used to convert the array with the content to CSV format */
 function ArrayToCSV(objArray) {
   var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
   var str = '';

   for (var i = 0; i < array.length; i++) {
     var line = '';
     for (var index in array[i]) {
       if (line != '') line += ','

       line += array[i][index];
     }

     str += line + '\r\n';
   }

   return str;
 }

 /** Function used to enable Download link, add utf-8 encoding and the name of the CSV */
 function CSVFile(title, items, name) {
   if (title) {
     items.unshift(title);
   }

   var jsonObject = JSON.stringify(items);

   var csv = ArrayToCSV(jsonObject);

   var exportedFilenmae = name + '.csv' || 'export.csv';

   var blob = new Blob([csv], {
     type: 'text/csv;charset=utf-8;'
   });
   if (navigator.msSaveBlob) {
     navigator.msSaveBlob(blob, exportedFilenmae);
   } else {
     var link = document.getElementById("download");
     if (link.download !== undefined) {
       var url = URL.createObjectURL(blob);
       link.setAttribute("href", url);
       link.setAttribute("download", exportedFilenmae);
       link.style.display = 'block';
     }
   }
 }

 $(document).ready(function () {

   $("#csv-file").change(function (evt) {
     var file = evt.target.files[0];
     Papa.parse(file, {
       header: true,
       dynamicTyping: true,
       complete: function (results) {
         data = results;

         if (data) {
           var json_pre;
           var datas;
           var fields;
           var value = [];
           var ref_comb;
           var ref;
           var prova;
           var items = [];
           var columns = {
             referencia: 'referencia',
             referencia_comb: 'ref_Combinacion',
             descripcion: 'descripcion',
             color: 'color',
             marcaje: 'marcaje',
             precio_venta: 'precio_venta'
           };
           var colorstring;

           var name = 'destino';
           for (var i = 0; i < data.data.length; i++) {

             var color = "";

             if (i === (data.data.length - 1)) {
               break;
             }

             ref = data.data[i].ref_proveedor + data.data[i].referencia;
             colorstring = data.data[i].colores.split(',');

             for (var j = 0; j < colorstring.length; j++) {
               if (!color) {
                 color = "";
               }
               color += colorstring[j].replace(/\s/g, '') + "-";

             }

             color = color.substring(0, color.length - 1);
             ref_comb = ref + "-" + color + "-" + data.data[i].marcaje;

             //Used to store the content of every line of the CSV.
             prova = [ref, ref_comb, data.data[i].descripcion, data.data[i].marcaje, data.data[i].precio_venta, color]; 

             var regExp_marcaje = /\(([^)]+)\)/;
             var marcaje = regExp_marcaje.exec(prova[3]);
             var marcaje_result;

             // We need to change the phrase depending on the number of the colors.
             if (marcaje[1] > 1) {
               marcaje_result = "Marcaje " + marcaje[1] + " Colores";
             }
             if (marcaje[1] < 1) {
               marcaje_result = "Sin Marcaje";
             }
             if (marcaje[1] == "1") {
               marcaje_result = "Marcaje " + marcaje[1] + " Color";
             }

             value.push(prova); 
           }
           value.slice(0).forEach((item) => {
             items.push({
               referencia: item[0],
               referencia_comb: item[1],
               descripcion: item[2],
               color: item[5],
               marcaje: marcaje_result,
               precio_venta: JSON.stringify(item[4])
             });
           });
           CSVFile(columns, items, name); // We call to the function when the array is made.
         }
       }
     });



   });

 });