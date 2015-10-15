var durada;
var numPics;
var harm;
var sumaHarm;
var text;
function arreglaMelodia()
{
    //treuFitxerMelodia();
    for (var i = 0; i < melodia.length; i++) {
        for (var j = 0; j < melodia[i].length; j++) 
        {
            durada = 0;
            numPics = melodia[i][j].numPics;
            harm = melodia[i][j].harmonics;
            sumaHarm = melodia[i][j].sumaHarm;
            do 
            {
                durada++;
            }
            while (seguent(melodia[i][j].nota, i+durada));

            if(durada>2 && !melodia[i][j].fantasma)
            {
                var a = new NotaArreglada(melodia[i][j].nota, i, durada);
                melodiaArreglada.push(a);
            }

            else if(melodia[i][j].fantasma && durada>8)
            {
                var a = new NotaArreglada(melodia[i][j].nota, i, durada);
                melodiaArreglada.push(a);
            }

        };
    };
    melodia = [];
    t=0;
    //treuFitxerPartirura();
    console.log(melodiaArreglada);
    escriuPartitura();
    escriuResultat();
}

/*function treuFitxerMelodia()
{
    text = "<table><tr><th>Temps</th><th>Nota</th><th>Pics</th><th>Mitja Harmonics</th><th>Suma Harmonics</th><th>Numero Harmonics</th></tr>";
     for (var i = 0; i < melodia.length; i++) 
     {
        
        for (var j = 0; j < melodia[i].length; j++)
        {
            text+= "<tr>";
            text+= "<td>" + i + "</td>";
            text+= "<td>" + melodia[i][j].nota + "</td>";
            text+= "<td>" + melodia[i][j].numPics + "</td>";
            text+= "<td>" + melodia[i][j].mitjaHarm + "</td>";
            text+= "<td>" + melodia[i][j].sumaHarm + "</td>";
            text+= "<td>" + melodia[i][j].harmonics + "</td>";
            text+="</tr>";
        }
        
    }
    text += "</table>";
}

function treuFitxerPartirura()
{
    text += "<br><table><tr><th>Nota</th><th>Inici</th><th>Durada</th></tr>";

    for (var j = 0; j < melodiaArreglada.length; j++)
    {
        text+= "<tr>";
        text+= "<td>" + melodiaArreglada[j].nota + "</td>";
        text+= "<td>" + melodiaArreglada[j].inici + "</td>";
        text+= "<td>" + melodiaArreglada[j].durada + "</td>";
        text+="</tr>";
    }

    text+="</table>";

    var filename = "ubec";
    var blob = new Blob([text], {type: "text/html;charset=utf-8"});
    saveAs(blob, filename+".html");
}*/
    

function seguent(nomNota, t)
{
    if(melodia.length-1<t)
        return false;

    for (var i = 0; i < melodia[t].length; i++) {
        if (melodia[t][i].nota==nomNota) 
        {
            if(notaRepe(t, i, melodia[t][i].freq, nomNota))
                return false;
            else
            {
               harm=melodia[t][i].harmonics;
               numPics = melodia[t][i].numPics;
               sumaHarm = melodia[t][i].sumaHarm;   
               melodia[t].splice(i, 1);
               return true; 
            }
            
        };
    };

    if(melodia.length-1==t)
        return false;

    for (var i = 0; i < melodia[t+1].length; i++) {
        if (melodia[t+1][i].nota==nomNota) 
        {
            return true;
        };
    };

    if(melodia.length-1==t+1)
        return false;

    for (var i = 0; i < melodia[t+2].length; i++) {
        if(melodia[t+2][i].nota == nomNota)
        {
            if(melodia[t+2][i].harmonics>harm || melodia[t+2][i].numPics>=numPics || melodia[t+2][i].sumaHarm>sumaHarm)
                return false;
            else
                return true;
        }
    };

    return false;
}

function notaRepe(t, index, freq, nomNota)
{
    //el número d'harmònics s'acosta al que tocaria
    if(melodia[t][index].harmonics > 2294/freq && melodia[t][index].harmonics>harm)
    {
        if(melodia.length-1==t)
            return false;
        for (var i = 0; i < melodia[t+1].length; i++) {
            if(melodia[t+1][i].nota==nomNota)
            {
                if(melodia[t+1][i].harmonics < melodia[t][index].harmonics-3)
                    return false;
            }
        };
    }
    else
        return false;

    //el numero de pics augmenta considerablement
    if(melodia[t][index].numPics>=numPics+5)
    {
        //els pics no descendeixen
        for (var i = 0; i < melodia[t+1].length; i++) {
            if(melodia[t+1][i].nota==nomNota)
            {
                if(melodia[t+1][i].numPics < melodia[t][index].numPics-1)
                    return false;

                return true;
            }
        };
    }

    return false;
}