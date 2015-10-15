var sonNotes=[];
var sonIntensitats=[];
function analisiDespres()
{
    for (var t = 0; t < temps.length; t++) 
    {
        //crear array d'intensitats i frequencies, tot -1 excepte en els pics. Aquests tenen el valor correcte de freq i intensitat.
        for (var i = 0; i < llargadafft; i++) {
            freqPics[i] = -1;
            intensitat[i] = -1;
        };

        var mitjana = temps[t][0];
        var totalPics = temps[t][1];

        for (var i = 2; i < temps[t].length; i++) {
            pics[i-2]=temps[t][i].pic;
            intensitat[pics[i-2]]=temps[t][i].intensitat;
        };
     
        for (var i = 0; i < pics.length; i++) {
            freqPics[pics[i]] = getFrequency(pics[i]);
        };
        freqPics[0]=-1;

        var b = [];
        //mirar pic per pic si són nota. En aquest cas, s'afegeixen a la llista de notes
        for (var i = 0; i < freqPics.length; i++) 
        {
            if(freqPics[i]!=-1)
            {
                if(esNota(freqPics[i]))
                {
                    sonNotes.push(freqPics[i]);
                    sonIntensitats.push(intensitat[i]);                
                }
            }
        };

        var notaReal;
        var esfantasma;
        //Totes les frequències que són notes s'afegeixen a la melodia
        for (var i = 0; i < sonNotes.length; i++) 
        {
            notaReal = fantasma(sonNotes[i]);
            if (notaReal==sonNotes[i]) 
                esfantasma=false;
            else
                esfantasma=true;

            //afegir la nota si no ha estat afegida anteriorment
            var afegir = true;
            var nom_nota = note[Math.round(12*(Math.log(notaReal)-Math.log(C0)) / Math.log(2))];

            for (var j = 0; j < b.length; j++) {
                if(b[j].nota==nom_nota)
                {
                    afegir=false;
                    break;
                }
            };

            if(afegir)
            {
                var a = new Nota(nom_nota, numHarmonics(notaReal), esfantasma, notaReal, 
                    intensHarm(notaReal)/numHarmonics(notaReal), intensHarm(notaReal), totalPics, mitjana);
                b.push(a);
                console.log(a);
            }
        };

        console.log(t, pics, sonNotes);
        melodia.push(b);

        //Totes les variables es tornen a posar a 0.
        pics=[];
        intensitat=[];
        freqPics=[];
        sonNotes=[];
        sonIntensitats=[];

    }
    temps=[];
    arreglaMelodia();    
}

function esNota(freq)
{
    //mirar si és un hatmònic d'una frequència ja afegida
    for (var i = 0; i < sonNotes.length; i++) {
        if(freq%sonNotes[i]<30 || Math.abs((freq%sonNotes[i])-freq)<30)
        {
            return false;
        }   
    };

    //mirar si compleix les condicions d'harmònics
    if(harmonics(freq, 2))
    {
        return true;
    }
        
    //mirar si sonava i encara té algun harmònic
    else if(sonava(freq) && harmonics(freq, 4))
    {
        return true;
    }  
    
    return false;
}

function sonava(freq)
{
    if(melodia.length==0)
        return false;

    for (var i = 0; i < melodia[melodia.length-1].length; i++) {
        if(melodia[melodia.length - 1][i].nota == note[Math.round(12*(Math.log(freq)-Math.log(C0)) / Math.log(2))])
        {
            return true;
        }
    };
    return false;
}

function numHarmonics(freq)
{
    var num = 0;
    for (var i = 2; getIndex(freq*i) < freqPics.length; i++) 
    {
        var harm1 = getIndex(freq*i*Math.pow(2, 1/48))+1;
        var harm2 = getIndex(freq*i*Math.pow(2, -1/48))-1; 
        
        for (var j = harm2; j <= harm1; j++) 
        {
            if(isPic(j))
            {
                num++;
                break;
            }               
        };
    };

    return num;
}

function intensHarm(freq)
{
    var res = 0;
    for (var i = 2; getIndex(freq*i) < freqPics.length; i++) 
    {
        var harm1 = getIndex(freq*i*Math.pow(2, 1/48))+1;
        var harm2 = getIndex(freq*i*Math.pow(2, -1/48))-1;
        
        for (var j = harm2; j <= harm1; j++) 
        {
            if(isPic(j))
            {
                res += intensitat[j];
                break;
            }               
        };
    };

    return res;
}

function fantasma(freq)
{
    var numeroHarmonicsBons;
    var ghost=freq;
    ubec:
    for (var i = 2; i < 6; i++) //ojooooo s'ha de tornar a posar a 6
    {
        var possibleFantasma = freq/i;
        if(possibleFantasma<50)
            break;

        var numHarm = numHarmonics(possibleFantasma);
        if(numHarm<numHarmonics(freq)*i*0.9)
            continue ubec;

        if(numHarm<5 && !sonava(possibleFantasma))
            continue ubec;

        if(numHarm<numHarmonics(ghost)*i*ghost/freq*0.7)
            continue ubec;

        numeroHarmonicsBons=0;
        seguent_harmonic:
        for (var j = 2; getIndex(possibleFantasma*j) < freqPics.length; j++) 
        {
            var freqAnalitzada = possibleFantasma*j;
            for (var k = 0; k < sonNotes.length; k++) {
                if(freqAnalitzada%sonNotes[k]<11)
                    continue seguent_harmonic;
            };

            var harm1 = getIndex(freqAnalitzada*Math.pow(2, 1/48))+1;
            var harm2 = getIndex(freqAnalitzada*Math.pow(2, -1/48))-1;                
            
            for (var k = harm2; k <= harm1; k++) 
            {
                if(isPic(k))
                {
                    numeroHarmonicsBons++;
                    break;
                }               
            };

            if(numeroHarmonicsBons==2)
            {
                ghost=possibleFantasma;
                break seguent_harmonic;
            }
        }
    }
    return ghost;
}

function harmonics(freq, filtre)
{
    var c1 = true;
    var c2 = filtre;
    for (var i = 2; i < 6; i++) 
    {
        var harm1 = getIndex(freq*i*Math.pow(2, 1/48))+1;
        var harm2 = getIndex(freq*i*Math.pow(2, -1/48))-1; 
        
        for (var j = harm2; j <= harm1; j++) 
        {
            if(isPic(j))
            {
                c1=true;
                break;
            }               
            else 
                c1=false;
        };

        if(!c1)
            c2--;

        if(c2==0)
            return false;
    }

    return true;
}

function isPic(index)
{
    for (var i = 0; i < pics.length; i++) {
        if(pics[i]==index)
            return true;
    };
    return false;
}

function getFrequency(index) 
{
    var nyquist = context.sampleRate/2;
    var frequency = (index * nyquist) / llargadafft;
    return frequency;
}

function getIndex(frequency) 
{
    var nyquist = context.sampleRate/2;
    var index = Math.round(frequency/nyquist * llargadafft);
    return index;
}