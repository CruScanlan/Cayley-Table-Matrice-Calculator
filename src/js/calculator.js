var noMatricies = 1;

function addMatrix(){
    noMatricies++;
    return $('#matrix-area').append(`<div class="row matrix" id="matrix-${noMatricies}"><div class="col-md-4 matrix-label">Matrix ${noMatricies}</div><div class="col-md-4"><input type="text" class="form-control" id="matrix-${noMatricies}-pos-1"></div><div class="col-md-4"><input type="text" class="form-control" id="matrix-${noMatricies}-pos-2"></div><div class="col-md-4"></div><div class="col-md-4"><input type="text" class="form-control" id="matrix-${noMatricies}-pos-3"></div><div class="col-md-4"><input type="text" class="form-control" id="matrix-${noMatricies}-pos-4"></div></div>`)
}

function calculate(){
    var matricies = getMatricies();
    console.log(matricies);
    var cayleyResponse = createCayleyMatricies(matricies);
    var cayleyMatricies = cayleyResponse.cayleyMatricies;
    console.log(cayleyMatricies);
    var cayleyMatriciesName = getCayleyByName(matricies,cayleyMatricies);
    console.log(cayleyMatriciesName);

    var tableHTML = "<tr>";
    var cellHozCount = 0;
    for(var i=0; i<cayleyMatriciesName.length; i++) {
        if(cellHozCount>(noMatricies-1)) {
            cellHozCount=0;
            tableHTML+="</tr><tr>";
        }
        cellHozCount++;

        tableHTML+=`<td>${cayleyMatriciesName[i]}</td>`;
    }
    $('#table-area').html(tableHTML);

    if($('#working').is(':checked'))    {
        var workingHTML = "";
        for(var i=0; i<cayleyResponse.products.length; i++) {
            var html = `<div class="row" style="margin-top: 10px"><div class="col-md-2">${cayleyResponse.names[i]}</div><div class="col-md-5">`; //start and name
            html+= `<p>${cayleyResponse.working[i][0]} = ${cayleyResponse.products[i][0]}</p><p>${cayleyResponse.working[i][1]} = ${cayleyResponse.products[i][1]}</p><p>${cayleyResponse.working[i][2]} = ${cayleyResponse.products[i][2]}</p><p>${cayleyResponse.working[i][3]} = ${cayleyResponse.products[i][3]}</p>`; //working
            html+= `</div><div class="col-md-5"><table class="table table-bordered"><tbody><tr><td>${cayleyResponse.products[i][0]}</td><td>${cayleyResponse.products[i][1]}</td></tr><tr><td>${cayleyResponse.products[i][2]}</td><td>${cayleyResponse.products[i][3]}</td></tr></tbody></table></div></div>`
            workingHTML+=html;
        }
        $('#working-area').html(workingHTML);
    }
}

function getMatricies(){
    var matricies = {};
    for(var i=1; i<noMatricies+1; i++)    {
        var pos1 = $('#matrix-'+i+'-pos-1').val();
        var pos2 = $('#matrix-'+i+'-pos-2').val();
        var pos3 = $('#matrix-'+i+'-pos-3').val();
        var pos4 = $('#matrix-'+i+'-pos-4').val();
        matricies['Matrix '+i]=[[pos1,pos2],[pos3,pos4]];
    }
    return matricies;
}

function createCayleyMatricies(matricies) {
    var matrixNames = Object.keys(matricies);
    var cayleyMatricies = [];
    var working = [];
    var products = [];
    var names = [];

    for(var i=0; i<noMatricies; i++)  {
        for(var p=0; p<matrixNames.length; p++) {
            var matrix1 = matricies[matrixNames[i]];
            var matrix2 = matricies[matrixNames[p]];

            var newMatrix = multiplyMatricies(matrix1,matrix2);

            cayleyMatricies.push(newMatrix.matrix);
            working.push(newMatrix.working);
            products.push(newMatrix.products);
            names.push(`${matrixNames[i]} * ${matrixNames[p]}`);
        }
    }
    return {
        cayleyMatricies:cayleyMatricies,
        working:working,
        products:products,
        names:names
    };
}

function multiplyMatricies(matrix1,matrix2) {
    var working = [
        `(${matrix1[0][0]}*${matrix2[0][0]})+(${matrix1[0][1]}*${matrix2[1][0]})`,
        `(${matrix1[0][0]}*${matrix2[0][1]})+(${matrix1[0][1]}*${matrix2[1][1]})`,
        `(${matrix1[1][0]}*${matrix2[0][0]})+(${matrix1[1][1]}*${matrix2[1][0]})`,
        `(${matrix1[1][0]}*${matrix2[0][1]})+(${matrix1[1][1]}*${matrix2[1][1]})`
    ];
    var products = [
        math.eval(working[0]),
        math.eval(working[1]),
        math.eval(working[2]),
        math.eval(working[3])
    ];
    return {
        working: working,
        products:products,
        matrix:[
            [
                products[0],
                products[1]
            ],
            [
                products[2],
                products[3]
            ]
        ]
    };
}

function getCayleyByName(matricies,cayleyMatricies)  {
    var matrixNames = Object.keys(matricies);
    var cayleyMatriciesName = [];
    for(var i=0; i<cayleyMatricies.length; i++) {
        for(var p=0; p<matrixNames.length; p++) {
            if(cayleyMatricies[i][0][0] != matricies[matrixNames[p]][0][0]) continue;
            if(cayleyMatricies[i][0][1] != matricies[matrixNames[p]][0][1]) continue;
            if(cayleyMatricies[i][1][0] != matricies[matrixNames[p]][1][0]) continue;
            if(cayleyMatricies[i][1][1] != matricies[matrixNames[p]][1][1]) continue;
            cayleyMatriciesName.push(matrixNames[p]);
        }
    }
    return cayleyMatriciesName;
}